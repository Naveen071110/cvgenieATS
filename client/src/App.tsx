import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ImagePerformanceMonitor } from "@/components/ui/image-performance-monitor";
import Home from "@/pages/home";

// Lazy load non-critical pages
const Generator = lazy(() => import("@/pages/generator"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const PricingPolicy = lazy(() => import("@/pages/pricing-policy"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/generator">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <Generator />
        </Suspense>
      </Route>
      <Route path="/blog" nest>
        <Switch>
          <Route path="/">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
              <Blog />
            </Suspense>
          </Route>
          <Route path="/:slug">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
              <BlogPost />
            </Suspense>
          </Route>
        </Switch>
      </Route>
      <Route path="/terms">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <Terms />
        </Suspense>
      </Route>
      <Route path="/privacy">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <Privacy />
        </Suspense>
      </Route>
      <Route path="/pricing-policy">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <PricingPolicy />
        </Suspense>
      </Route>
      <Route>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <NotFound />
        </Suspense>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;