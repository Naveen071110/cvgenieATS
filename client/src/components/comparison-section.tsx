import React, { useState } from "react";
import { Check, X, AlertTriangle, Sparkles, TrendingUp, Target, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface ComparisonRow {
  feature: string;
  cvgenie: { text: string; status: "success" };
  canva: { text: string; status: "error" | "warning" };
  word: { text: string; status: "error" | "warning" };
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "ATS Parse Success Rate",
    cvgenie: { text: "94%+ Success Rate", status: "success" },
    canva: { text: "28% (Frequently Dropped)", status: "error" },
    word: { text: "55% (Varies by Layout)", status: "warning" }
  },
  {
    feature: "Job Description Keyword Matching",
    cvgenie: { text: "Automated 2-Pass AI Matching", status: "success" },
    canva: { text: "None (Manual Guesswork)", status: "error" },
    word: { text: "None (Manual Typing)", status: "error" }
  },
  {
    feature: "Single-Column ATS Compliance",
    cvgenie: { text: "100% Guaranteed Structure", status: "success" },
    canva: { text: "Multi-column crashes parsers", status: "error" },
    word: { text: "Manual formatting required", status: "warning" }
  },
  {
    feature: "Matched Tailored Cover Letter",
    cvgenie: { text: "Instant role-specific letter", status: "success" },
    canva: { text: "Not supported", status: "error" },
    word: { text: "Write from scratch", status: "error" }
  },
  {
    feature: "Quantified Bullet Point Enhancement",
    cvgenie: { text: "AI achievement restructuring", status: "success" },
    canva: { text: "No content assistance", status: "error" },
    word: { text: "No content assistance", status: "error" }
  },
  {
    feature: "Universal Vector Document Export",
    cvgenie: { text: "PDF, Word DOCX & Plain TXT", status: "success" },
    canva: { text: "Rasterized / flat PDF", status: "warning" },
    word: { text: "DOCX / basic PDF", status: "warning" }
  }
];

export function ComparisonSection() {
  const [activeMetricTab, setActiveMetricTab] = useState<"keywords" | "structure" | "impact">("keywords");

  return (
    <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Comparison Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            CVGenie vs. Traditional Resume Builders
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Graphic design tools look pretty to human eyes, but applicant tracking systems choke on columns, images, and tables. Here is how CVGenie gets you into the interview queue.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                <th className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">Capability</th>
                <th className="py-4 px-6 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/30">
                  CVGenie AI
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400">Canva / Design Tools</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-400">Generic Word Templates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.cvgenie.text}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      {row.canva.status === "error" ? (
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>{row.canva.text}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      {row.word.status === "error" ? (
                        <X className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>{row.word.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real Transformation Before/After Breakdown */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                Real Case Study
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Before & After AI Optimization
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-md">
              <button
                onClick={() => setActiveMetricTab("keywords")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetricTab === "keywords" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                +13 Keywords
              </button>
              <button
                onClick={() => setActiveMetricTab("structure")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetricTab === "structure" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                ATS Format
              </button>
              <button
                onClick={() => setActiveMetricTab("impact")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMetricTab === "impact" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Measurable Impact
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-rose-400">Before CVGenie</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ATS Score: 42%
                </span>
              </div>
              <p className="text-sm text-slate-300 italic">
                "Responsible for team software development. Managed daily standups and created features for customer web app."
              </p>
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/10">
                <p>❌ Missing key job keywords (TypeScript, CI/CD, Microservices)</p>
                <p>❌ Vague responsibilities with zero quantifiable business metrics</p>
                <p>❌ Unformatted headers ignored by Workday ATS</p>
              </div>
            </div>

            {/* After Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/30 border border-blue-400/30 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-400">After CVGenie AI</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ATS Score: 91%
                </span>
              </div>
              <p className="text-sm text-white font-medium">
                "Architected scalable TypeScript & React microservices reducing page latency by 38%; spearheaded CI/CD pipeline automation across 6 scrum teams."
              </p>
              <div className="space-y-1.5 text-xs text-blue-200 pt-2 border-t border-white/10">
                <p>✅ Integrated 13 critical role-matched keywords</p>
                <p>✅ Quantified business impact (+38% latency improvement)</p>
                <p>✅ 100% ATS-compliant single-column vector document</p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all"
            >
              Transform Your Resume Now
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
