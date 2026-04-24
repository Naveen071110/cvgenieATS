import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import Home from "@/pages/home";

const Generator = lazy(() => import("@/pages/generator"));
const ResumeHistoryPage = lazy(() => import("@/pages/resume-history"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const PricingPolicy = lazy(() => import("@/pages/pricing-policy"));
const About = lazy(() => import("@/pages/about"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ATSScore = lazy(() => import("@/pages/ats-score"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/generator">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <ProtectedRoute>
            <Generator />
          </ProtectedRoute>
        </Suspense>
      </Route>
      <Route path="/resume-history">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <ProtectedRoute>
            <ResumeHistoryPage />
          </ProtectedRoute>
        </Suspense>
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
      <Route path="/about">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <About />
        </Suspense>
      </Route>
      <Route path="/dashboard">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Suspense>
      </Route>
      <Route path="/ats-score">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <ProtectedRoute>
            <ATSScore />
          </ProtectedRoute>
        </Suspense>
      </Route>
      <Route path="/blog/:slug">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <BlogPost />
        </Suspense>
      </Route>
      <Route path="/blog">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="branded-spinner"></div></div>}>
          <Blog />
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
  if (!clerkPubKey) {
    console.warn('Clerk publishable key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your environment variables.');
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey || ''}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;