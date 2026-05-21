import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  Users,
  Wrench,
  Target,
  Crown,
  BookOpen,
} from "lucide-react";

interface InterviewQuestion {
  category: "Behavioral" | "Skills-based" | "Role-specific";
  question: string;
  tip: string;
}

interface ResumeHistoryItem {
  id: number;
  job_description: string | null;
  resume_text: string;
  created_at: string;
}

interface SubscriptionStatus {
  isPro: boolean;
  subscriptionStatus: string;
}

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  Behavioral: {
    icon: <Users className="w-4 h-4" />,
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
  },
  "Skills-based": {
    icon: <Wrench className="w-4 h-4" />,
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
  },
  "Role-specific": {
    icon: <Target className="w-4 h-4" />,
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
  },
};

function QuestionCard({ item, index }: { item: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(false);
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META["Behavioral"];

  return (
    <div
      className={`rounded-xl border ${meta.border} bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
      >
        <span
          className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${meta.bg} ${meta.color}`}
        >
          {index + 1}
        </span>
        <span className="flex-1 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-snug">
          {item.question}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
        )}
      </button>

      {open && (
        <div className={`px-4 pb-4 ${meta.bg} border-t ${meta.border}`}>
          <div className={`flex gap-2 pt-3 text-sm ${meta.color}`}>
            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{item.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl w-full" />
      ))}
    </div>
  );
}

function GroupedQuestions({ questions }: { questions: InterviewQuestion[] }) {
  const categories = ["Behavioral", "Skills-based", "Role-specific"] as const;

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const items = questions.filter((q) => q.category === cat);
        if (items.length === 0) return null;
        const meta = CATEGORY_META[cat];
        return (
          <section key={cat}>
            <div className={`flex items-center gap-2 mb-3`}>
              <span className={`${meta.color}`}>{meta.icon}</span>
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${meta.color}`}>
                {cat}
              </h3>
            </div>
            <div className="space-y-2.5">
              {items.map((item, i) => (
                <QuestionCard
                  key={i}
                  item={item}
                  index={questions.indexOf(item)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function InterviewPrepContent() {
  const { user } = useAuth();

  const { data: subscriptionData, isLoading: subLoading } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status"],
    enabled: !!user,
    staleTime: 30000,
  });

  const isPro =
    !subLoading &&
    subscriptionData?.isPro &&
    subscriptionData?.subscriptionStatus === "active";

  // For Free users: auto-load the most recent in-session resume from sessionStorage.
  // This is written by the generator page on successful generation.
  const sessionResume = (() => {
    try { return sessionStorage.getItem("cvgenie_last_resume") || ""; } catch { return ""; }
  })();

  // Start blank; useEffect fills from sessionStorage once Pro status is known.
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // Once subscription status resolves, auto-load session resume for Free users.
  useEffect(() => {
    if (subLoading) return;
    if (sessionLoaded) return;
    if (!isPro && sessionResume && !resumeText) {
      setResumeText(sessionResume);
    }
    setSessionLoaded(true);
  }, [subLoading, isPro, sessionResume]);

  const { data: historyData, isLoading: historyLoading } = useQuery<{
    resumes: ResumeHistoryItem[];
  }>({
    queryKey: ["/api/resume-history"],
    enabled: !!isPro,
    staleTime: 60000,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/interview-questions", {
        resumeText: resumeText.trim(),
        jobTitle: jobTitle.trim() || undefined,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to generate questions");
      return body as { questions: InterviewQuestion[] };
    },
    onSuccess: (data) => {
      setQuestions(data.questions);
    },
  });

  function handleHistorySelect(id: number) {
    setSelectedHistoryId(id);
    const resume = historyData?.resumes.find((r) => r.id === id);
    if (resume) {
      setResumeText(resume.resume_text);
      if (resume.job_description) {
        const firstLine = resume.job_description.split("\n")[0].trim().slice(0, 80);
        setJobTitle(firstLine);
      }
    }
  }

  const canGenerate = resumeText.trim().length >= 50;
  const hasSessionResume = sessionResume.trim().length >= 50;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Interview Prep
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Get 9 tailored mock interview questions based on your resume, with coaching tips for each.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-5">

        {/* Pro: history dropdown */}
        {isPro && historyLoading && (
          <Skeleton className="h-10 w-full rounded-lg" />
        )}
        {isPro && !historyLoading && historyData && historyData.resumes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Load from resume history
            </label>
            <select
              value={selectedHistoryId ?? ""}
              onChange={(e) => handleHistorySelect(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a saved resume…
              </option>
              {historyData.resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.job_description
                    ? r.job_description.split("\n")[0].trim().slice(0, 60)
                    : `Resume #${r.id}`}{" "}
                  — {new Date(r.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Free: auto-loaded session resume note */}
        {!isPro && hasSessionResume && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Your most recent resume has been loaded automatically.{" "}
              <Link to="/#pricing" className="underline font-medium inline-flex items-center gap-1">
                <Crown className="w-3 h-3" />Upgrade to Pro
              </Link>{" "}
              to switch between saved resumes.
            </p>
          </div>
        )}

        {/* Free: no session resume nudge */}
        {!isPro && !hasSessionResume && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Generate a resume first and it will be loaded here automatically. Or paste your resume text below.{" "}
              <Link to="/#pricing" className="underline font-medium">
                Upgrade to Pro
              </Link>{" "}
              to access your full resume history.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Your resume{" "}
            <span className="text-slate-400 font-normal">
              {!isPro && hasSessionResume ? "(auto-loaded — editable)" : "(paste plain text)"}
            </span>
          </label>
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste the full text of your resume here…"
            className="min-h-[180px] resize-y text-sm font-mono leading-relaxed"
          />
          {resumeText.trim().length > 0 && resumeText.trim().length < 50 && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              Please paste more of your resume (at least 50 characters).
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Target job title{" "}
            <span className="text-slate-400 font-normal">(optional — helps tailor questions)</span>
          </label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Product Manager, Software Engineer…"
            className="text-sm"
          />
        </div>

        <Button
          onClick={() => generateMutation.mutate()}
          disabled={!canGenerate || generateMutation.isPending}
          className="w-full sm:w-auto gap-2"
          size="lg"
        >
          {generateMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : questions ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Regenerate Questions
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Generate Questions
            </>
          )}
        </Button>

        {generateMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {(generateMutation.error as any)?.message ||
              "Something went wrong. Please try again."}
          </p>
        )}
      </div>

      {generateMutation.isPending && (
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 animate-pulse" />
            Analysing your resume and crafting questions…
          </p>
          <QuestionSkeleton />
        </div>
      )}

      {questions && !generateMutation.isPending && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Your {questions.length} mock interview questions
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              Click any question to reveal the coaching tip
            </p>
          </div>
          <GroupedQuestions questions={questions} />
        </div>
      )}

      {!questions && !generateMutation.isPending && !hasSessionResume && !isPro && resumeText.trim().length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Brain className="w-7 h-7 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            No resume generated yet this session. Generate one first and it will appear here automatically.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm"
          >
            Generate a resume
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function InterviewPrep() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AppShell title="Interview Prep">
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-64 rounded-xl w-full" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title="Interview Prep">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-slate-500">Please sign in to use Interview Prep.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Interview Prep">
      <InterviewPrepContent />
    </AppShell>
  );
}
