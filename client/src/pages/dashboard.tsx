import { useAuth } from "@/context/AuthContext";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { 
  FileText, 
  History, 
  Sparkles, 
  Crown, 
  ArrowRight, 
  User,
  Mail,
  Calendar,
  Zap,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user: authUser, isLoading: authLoading, signOut } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const { data: subscriptionData, isLoading: subLoading } = useQuery<{
    isPro: boolean;
    subscriptionStatus: string;
  }>({
    queryKey: ["/api/subscription/status"],
    enabled: !!authUser,
  });

  const { data: resumeHistoryData, isLoading: historyLoading } = useQuery<{
    resumes: any[];
  }>({
    queryKey: ["/api/resume-history"],
    enabled: !!authUser && subscriptionData?.isPro === true,
  });

  const isLoading = (authLoading || !clerkLoaded) && !loadingTimeout;
  const isPro = subscriptionData?.isPro === true;
  const resumeCount = resumeHistoryData?.resumes?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser || !clerkUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">CV</span>
            </div>
            <CardTitle className="text-2xl">Welcome to CVGenie</CardTitle>
            <CardDescription>Sign in to access your dashboard and manage your resumes</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2">
                <User className="w-4 h-4" />
                Sign In to Continue
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitials = clerkUser.firstName && clerkUser.lastName 
    ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`
    : clerkUser.firstName?.[0] || clerkUser.username?.[0] || "U";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">CVGenie</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/generator">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Generator
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="gap-2 text-slate-600 dark:text-slate-400">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-blue-600/10 dark:from-primary/20 dark:to-blue-600/20 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white dark:border-slate-700 shadow-lg">
                <AvatarImage src={clerkUser.imageUrl} alt={clerkUser.fullName || "User"} />
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {clerkUser.firstName || clerkUser.username || "User"}!
                  </h1>
                  {isPro ? (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                      <Crown className="w-3 h-3" />
                      Pro
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      Free Plan
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                  {clerkUser.primaryEmailAddress && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {clerkUser.primaryEmailAddress.emailAddress}
                    </span>
                  )}
                  {clerkUser.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(clerkUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
              {!isPro && (
                <Link to="/#pricing">
                  <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow" data-testid="card-stat-plan">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {subLoading ? <Skeleton className="h-8 w-20" /> : (isPro ? "Pro" : "Free")}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isPro ? "Unlimited generations" : "3 generations/month"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" data-testid="card-stat-resumes">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Saved Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {historyLoading ? <Skeleton className="h-8 w-12" /> : (isPro ? resumeCount : "—")}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isPro ? "Stored in your history" : "Pro feature"}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" data-testid="card-stat-status">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                Active
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ready to create resumes
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/generator" className="block">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group" data-testid="card-action-generate">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Create Resume</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Generate an ATS-optimized resume tailored to your job description
                </p>
                <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/resume-history" className="block">
            <Card className={`h-full hover:shadow-lg transition-all cursor-pointer group ${!isPro ? 'opacity-75' : 'hover:border-primary'}`} data-testid="card-action-history">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Resume History</h3>
                  {!isPro && <Badge variant="outline" className="text-xs">Pro</Badge>}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  View and manage all your previously generated resumes
                </p>
                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View History <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {!isPro && (
            <Link to="/#pricing" className="block">
              <Card className="h-full hover:shadow-lg transition-all hover:border-amber-500 cursor-pointer group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20" data-testid="card-action-upgrade">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Unlock unlimited generations, resume history, and premium features
                  </p>
                  <span className="text-amber-600 dark:text-amber-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Plans <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )}

          {isPro && (
            <Card className="h-full hover:shadow-lg transition-all hover:border-green-500 cursor-pointer group" data-testid="card-action-manage">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Manage Subscription</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  View billing details and manage your Pro subscription
                </p>
                <a href="mailto:billing@cvgenie.com" className="text-green-600 dark:text-green-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Contact Support <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
