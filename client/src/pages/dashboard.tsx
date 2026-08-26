import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { 
  FileText, 
  BarChart3, 
  Download, 
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Crown,
  User,
  Plus
} from "lucide-react";
import { AppShell } from "@/components/app-shell/AppShell";
import { useQuery } from "@tanstack/react-query";

interface SubscriptionStatus {
  isPro: boolean;
  subscriptionStatus: string;
}

interface ResumeHistoryItem {
  id: number;
  job_description: string | null;
  resume_text: string;
  created_at: string;
  has_cover_letter?: boolean;
}

function StatCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
}) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ 
  to, 
  icon, 
  label, 
  variant = "secondary" 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  variant?: "primary" | "secondary" | "tertiary";
}) {
  const baseClasses = "flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
    tertiary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow-md"
  };

  return (
    <Link to={to} className={`${baseClasses} ${variantClasses[variant]}`}>
      {icon}
      {label}
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 p-8 pt-24 max-w-6xl mx-auto">
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64" />
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-96" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Welcome to CVGenie
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Please sign in to access your dashboard and manage your resumes.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900"
        >
          Go to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  
  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status"],
    enabled: !!user,
    retry: false,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isPro = Boolean(subscriptionStatus?.isPro && subscriptionStatus?.subscriptionStatus === 'active');

  const { data: resumeHistoryData } = useQuery<{ resumes: ResumeHistoryItem[] }>({
    queryKey: ["/api/resume-history"],
    enabled: !!user && isPro,
    retry: false,
    staleTime: 60000,
  });

  const resumes = resumeHistoryData?.resumes || [];
  const resumeCount = resumes.length;
  const lastActiveDate = resumes[0]?.created_at
    ? new Date(resumes[0].created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const firstName = fullName.split(' ')[0] || '';
  const welcomeText = firstName ? `Welcome back, ${firstName}` : 'Welcome back';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight break-words">
              {welcomeText}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              isPro 
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Generate resumes, check ATS scores, or manage your career documents.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <QuickActionButton 
          to="/generator" 
          icon={<Plus className="w-4 h-4" />} 
          label="New Resume" 
          variant="primary" 
        />
        <QuickActionButton 
          to="/ats-score" 
          icon={<BarChart3 className="w-4 h-4" />} 
          label="ATS Score" 
          variant="secondary" 
        />
        {!isPro && (
          <QuickActionButton 
            to="/#pricing" 
            icon={<Crown className="w-4 h-4" />} 
            label="Upgrade to Pro" 
            variant="tertiary" 
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<FileText className="w-5 h-5" />} 
          label="Resumes saved" 
          value={resumeCount} 
        />
        <StatCard 
          icon={<Target className="w-5 h-5" />} 
          label="ATS passes" 
          value={resumeCount > 0 ? resumeCount : 0} 
        />
        <StatCard 
          icon={<Download className="w-5 h-5" />} 
          label="Export formats" 
          value="PDF, DOCX" 
        />
        <StatCard 
          icon={<Clock className="w-5 h-5" />} 
          label="Last active" 
          value={lastActiveDate} 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent activity
          </h2>
          {isPro && resumeCount > 0 && (
            <Link 
              to="/resume-history"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              View all history →
            </Link>
          )}
        </div>

        {resumeCount > 0 ? (
          <div className="space-y-3">
            {resumes.slice(0, 3).map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {item.job_description ? item.job_description.slice(0, 60) + "..." : "Optimized Resume"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Created on {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link
                  to="/resume-history"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline shrink-0"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm">
              No activity yet. Generate your first resume to see it here.
            </p>
            <Link 
              to="/generator"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Generate your first resume
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showLoading = isLoading && !loadingTimeout;

  if (showLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <SignInPrompt />;
  }

  return (
    <AppShell title="Dashboard">
      <DashboardContent />
    </AppShell>
  );
}
