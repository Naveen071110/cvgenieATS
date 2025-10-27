import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { initializeResumeTable } from "./database/resumeQueries";

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

// Cache CSS and JS files for 1 hour with revalidation
app.use(/\.(css|js)$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  next();
});

// Cache images for 1 week
app.use(/\.(jpg|jpeg|png|gif|ico|svg|webp|avif)$/, (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=604800');
  next();
});

(async () => {
  // Initialize Neon database table
  try {
    await initializeResumeTable();
    log("Neon database table initialized successfully");
  } catch (error: any) {
    log(`Warning: Failed to initialize database table: ${error.message}`);
  }

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