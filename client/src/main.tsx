import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PerformanceMonitor, preloadCriticalResources, lazyLoadImages } from "./lib/performance";

// Initialize performance monitoring
const perfMonitor = PerformanceMonitor.getInstance();
perfMonitor.startTiming('app-initialization');

// Preload critical above-the-fold assets for faster initial render
preloadCriticalResources();

const container = document.getElementById("root")!;
const root = createRoot(container);

// Start performance monitoring
perfMonitor.monitorWebVitals();

root.render(<App />);

// Initialize lazy loading after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  perfMonitor.endTiming('app-initialization');
});