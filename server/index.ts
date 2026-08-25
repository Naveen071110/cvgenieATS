import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { initializeResumeTable } from "./database/resumeQueries";
import { initializeUsageSessionsTable } from "./database/subscriptionQueries";
import dodoWebhookRouter from "./webhooks/dodoPayments";
import { listAvailableProducts, PRODUCT_ID } from "./services/dodoPayments";

import fs from "fs";

// Load local .env if present (for local development without crashing in production)
try {
  const envFilePath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envFilePath)) {
    const content = fs.readFileSync(envFilePath, "utf8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  // Ignore error if running on cloud platform without local .env
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = import.meta.url.includes('/dist/') ? 'production' : 'development';
}

const app = express();

// Enable compression middleware early in the stack
app.use(compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req: Request, res: Response) => {
    // Don't compress responses if the request includes a cache-control header to prevent compression
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

app.use(express.json({
  limit: "10mb",
  verify: (req: any, _res: any, buf: Buffer) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Apply Clerk middleware globally (only if key is configured, otherwise fallback safely for public routes)
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (clerkPublishableKey) {
  app.use(clerkMiddleware({
    publishableKey: clerkPublishableKey,
    secretKey: clerkSecretKey,
  }));
} else {
  log("⚠️ Clerk publishable key is not configured. Authentication middleware will be disabled for public routes.");
  app.use((req, _res, next) => {
    (req as any).auth = { userId: null };
    next();
  });
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Cache /assets/* for 1 year — Vite content-hashes every filename so files are
// safe to cache indefinitely. We lock res.setHeader so that the downstream
// express.static (serve-static / send package) cannot override it with its
// default max-age=0.
app.use('/assets', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  const _setHeader = res.setHeader.bind(res);
  (res as any).setHeader = (name: string, value: any) => {
    if (typeof name === 'string' && name.toLowerCase() === 'cache-control') return res;
    return _setHeader(name, value);
  };
  next();
});

// Cache images for 1 week
app.use(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=604800');
  next();
});

(async () => {
  // Initialize Neon database tables
  if (process.env.DATABASE_URL) {
    try {
      await initializeResumeTable();
      await initializeUsageSessionsTable();
      log("Neon database tables initialized successfully");
    } catch (error: any) {
      log("⚠️ Failed to initialize Neon database tables:", error.message);
    }
  } else {
    log("⚠️ DATABASE_URL not configured. Database features will be unavailable.");
  }

  // Validate Dodo Payments configuration
  const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY;
  const dodoProductId = process.env.DODO_PAYMENTS_PRODUCT_ID;

  if (!dodoApiKey || !dodoProductId) {
    log("⚠️  WARNING: Dodo Payments not configured. Subscription features will not work.");
    log("⚠️  Set DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_PRODUCT_ID in environment variables.");
  } else if (!dodoProductId.startsWith('pdt_') && !dodoProductId.startsWith('prod_')) {
    log("❌ ERROR: Invalid DODO_PAYMENTS_PRODUCT_ID format. Must start with 'pdt_' or 'prod_'");
    log(`❌ Current value: ${dodoProductId}`);
  } else {
    // Note: Dodo environment logging is now in dodoPayments.ts on import
    log(`✅ Dodo Payments Product ID configured: [CONFIGURED]`);
    
    // Verify product exists in Dodo Payments
    try {
      log('🔍 Verifying Dodo Payments product configuration...');
      const products = await listAvailableProducts();
      const productExists = products.some((p: any) => p.product_id === PRODUCT_ID);
      
      if (productExists) {
        log(`✅ Product verified successfully in Dodo Payments`);
      } else {
        log(`❌ WARNING: Product ID ${PRODUCT_ID} NOT FOUND in Dodo Payments!`);
        if (products.length > 0) {
          log(`💡 Available products: ${products.map((p: any) => `${p.name} (${p.product_id})`).join(', ')}`);
        } else {
          log(`⚠️ No products found. Please create a product in your Dodo Payments dashboard.`);
        }
      }
    } catch (error: any) {
      log(`⚠️ Could not verify Dodo Payments product: ${error.message}`);
      log(`💡 This may indicate an API key or environment mismatch.`);
    }
  }

  // Serve SEO files with correct content types (before other routes)
  app.get('/robots.txt', (_req, res) => {
    // In production, files are in dist/public, in development they're in client/public
    const isDev = app.get("env") === "development";
    const robotsPath = isDev
      ? path.join(process.cwd(), 'client', 'public', 'robots.txt')
      : path.join(import.meta.dirname, 'public', 'robots.txt');
    res.type('text/plain');
    res.sendFile(robotsPath);
  });

  app.get('/sitemap.xml', (_req, res) => {
    // In production, files are in dist/public, in development they're in client/public
    const isDev = app.get("env") === "development";
    const sitemapPath = isDev
      ? path.join(process.cwd(), 'client', 'public', 'sitemap.xml')
      : path.join(import.meta.dirname, 'public', 'sitemap.xml');
    res.type('application/xml');
    res.sendFile(sitemapPath);
  });

  // Add webhook routes before regular routes
  app.use('/api/webhooks', dodoWebhookRouter);

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    log(`[error] ${status} - ${message}`);
    if (status >= 500 && err.stack) {
      console.error(err.stack);
    }
  });

  // Create HTTP server instance
  const server = app.listen(parseInt(process.env.PORT || '5000', 10), "0.0.0.0", () => {
    const port = parseInt(process.env.PORT || '5000', 10);
    log(`serving on port ${port}`);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();