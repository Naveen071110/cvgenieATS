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
  User
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
    <div className="group relative bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
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
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-slate-100",
    tertiary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 animate-pulse">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-96" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Welcome to CVGenie
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Please sign in to access your dashboard and manage your resumes.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900"
            >
              Go to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
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

  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
  const firstName = fullName.split(' ')[0] || '';
  const welcomeText = firstName ? `Welcome back, ${firstName}` : 'Welcome back';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
                {welcomeText}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                Free
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Generate a resume, check ATS score, or upgrade anytime.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard 
            icon={<FileText className="w-5 h-5" />} 
            label="Resumes generated" 
            value={0} 
          />
          <StatCard 
            icon={<Target className="w-5 h-5" />} 
            label="ATS checks" 
            value={0} 
          />
          <StatCard 
            icon={<Download className="w-5 h-5" />} 
            label="Exports" 
            value={0} 
          />
          <StatCard 
            icon={<Clock className="w-5 h-5" />} 
            label="Last active" 
            value="—" 
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <QuickActionButton 
            to="/generator" 
            icon={<FileText className="w-4 h-4" />} 
            label="Generate Resume" 
            variant="primary" 
          />
          <QuickActionButton 
            to="/ats-score" 
            icon={<BarChart3 className="w-4 h-4" />} 
            label="ATS Score" 
            variant="secondary" 
          />
          <QuickActionButton 
            to="/#pricing" 
            icon={<Crown className="w-4 h-4" />} 
            label="Upgrade to Pro" 
            variant="tertiary" 
          />
        </div>

        <div className="bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent activity
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
              No activity yet. Generate your first resume to see it here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
