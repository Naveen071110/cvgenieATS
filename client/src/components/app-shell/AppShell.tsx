import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  History,
  Crown,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionStatus {
  isPro: boolean;
  subscriptionStatus: string;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  requiresPro?: boolean;
}

function Sidebar({ 
  isOpen, 
  onClose,
  isPro 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  isPro: boolean;
}) {
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { to: "/generator", icon: <FileText className="w-5 h-5" />, label: "Generate Resume" },
    { to: "/ats-score", icon: <BarChart3 className="w-5 h-5" />, label: "ATS Score" },
    { to: "/resume-history", icon: <History className="w-5 h-5" />, label: "Resume History", badge: isPro ? undefined : "Pro", requiresPro: true },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">CVGenie</span>
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
                  ${isActive(item.to)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400 -ml-px pl-[11px]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {!isPro && (
              <Link
                to="/#pricing"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
              >
                <Crown className="w-5 h-5" />
                <span>Upgrade to Pro</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            )}
            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help & Support</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ 
  onMenuClick, 
  title,
  user,
  signOut
}: { 
  onMenuClick: () => void;
  title: string;
  user: { email?: string; user_metadata?: { avatar_url?: string; name?: string } } | null;
  signOut: () => void;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user?.email || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Signed in
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children, title = "Dashboard" }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status"],
    enabled: !!user,
    retry: false,
  });

  const isPro = subscriptionStatus?.isPro && subscriptionStatus?.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isPro={!!isPro}
      />
      
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          user={user}
          signOut={signOut}
        />
        
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
