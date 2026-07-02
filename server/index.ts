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

const app = express();

// Enable compression middleware early in the stack
app.use(compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress responses if the request includes a cache-control header to prevent compression
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Apply Clerk middleware globally
app.use(clerkMiddleware());

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

// Configure caching headers for static assets
app.use('/assets', (req, res, next) => {
  // Cache static assets for 1 year
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  next();
});

// Cache hashed CSS/JS files for 1 year — Vite appends content hashes so files
// are safe to cache immutably. HTML files are served without caching so users
// always get the latest entry point with updated chunk URLs.
app.use(/\.(css|js)$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
});

// Never cache HTML — browser must always re-fetch so it picks up new chunk hashes
app.use(/\.html$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// Cache images for 1 week
app.use(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=604800');
  next();
});

(async () => {
  // Initialize Neon database tables
  try {
    await initializeResumeTable();
    await initializeUsageSessionsTable();
    log("Neon database tables initialized successfully");
  } catch (error: any) {
    log("Failed to initialize Neon database tables:", error.message);
    process.exit(1);
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
    log(`✅ Dodo Payments Product ID configured: ${dodoProductId.substring(0, 15)}...`);
    
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

    res.status(status).json({ message });
    throw err;
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