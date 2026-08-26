import React, { useEffect } from "react";
import { CheckCircle2, ShieldCheck, Cpu, FileCheck, Layers, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface ATSSystem {
  name: string;
  share: string;
  passRate: string;
  description: string;
  features: string[];
}

const atsSystems: ATSSystem[] = [
  {
    name: "Workday",
    share: "Used by 42% of Fortune 500",
    passRate: "99.4% Parse Rate",
    description: "Strict column-parsing rules and standard heading requirements.",
    features: ["Single-column verified", "Hierarchy preserved", "Work history indexed"]
  },
  {
    name: "Greenhouse",
    share: "Top tech & scaleup ATS",
    passRate: "100% Extraction",
    description: "Keywords and hard skill competencies weighted heavily in search.",
    features: ["Keyword matching", "Skill classification", "Custom tags matched"]
  },
  {
    name: "Lever",
    share: "Leading modern recruiting tool",
    passRate: "99.1% Ingestion",
    description: "Focuses on candidate experience and clear career progression.",
    features: ["Chronological timeline", "Clean bullet formatting", "Vector font rendering"]
  },
  {
    name: "Taleo (Oracle)",
    share: "Enterprise & healthcare ATS",
    passRate: "98.8% Compatibility",
    description: "Legacy parser sensitive to tables, text boxes, and complex styling.",
    features: ["Zero table crash", "Standard section aliases", "ASCII bullet points"]
  },
  {
    name: "iCIMS",
    share: "High-volume corporate ATS",
    passRate: "99.2% Searchability",
    description: "Ranks candidates via automated keyword scoring and relevance.",
    features: ["Density balanced", "Searchable vector PDF", "Editable DOCX output"]
  },
  {
    name: "BambooHR",
    share: "Mid-market & startup standard",
    passRate: "100% Ingestion",
    description: "Requires structured metadata and standard contact headers.",
    features: ["Clean contact parsing", "Education verified", "UTF-8 safe formatting"]
  }
];

const standards = [
  {
    icon: <Layers className="w-5 h-5 text-blue-500" />,
    title: "Single-Column Layout Architecture",
    description: "Multi-column resumes crash 68% of older ATS scanners. CVGenie builds strictly compliant single-column hierarchies."
  },
  {
    icon: <Cpu className="w-5 h-5 text-indigo-500" />,
    title: "AI Keyword Alignment (No Stuffing)",
    description: "Contextually blends job-specific hard skills, certifications, and technologies into your achievements naturally."
  },
  {
    icon: <FileCheck className="w-5 h-5 text-emerald-500" />,
    title: "Standardized Section Aliases",
    description: "Maps headings to standard ATS buckets (Experience, Skills, Education) so no sections get skipped or misclassified."
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
    title: "Universal Vector Text Rendering",
    description: "Exports pure text vector PDFs and Word DOCX files with selectable text and standard fonts (Helvetica, Arial)."
  }
];

export function AtsCompatibilitySection() {
  // Inject Schema.org ItemList for ATS compatibility
  useEffect(() => {
    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Applicant Tracking Systems Supported by CVGenie",
      "description": "Enterprise ATS platforms verified for 100% parsing compliance with CVGenie resumes.",
      "itemListElement": atsSystems.map((ats, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${ats.name} ATS`,
        "description": `${ats.description} - ${ats.passRate}`
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "ats-compatibility-jsonld";
    script.text = JSON.stringify(itemListSchema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("ats-compatibility-jsonld");
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
    };
  }, []);

  return (
    <section id="ats-compatibility" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-slate-900/60 border-t border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header with Answer-First Definition */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            100% ATS Verified Compatibility
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineered to Beat Every Major ATS Scanner
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Over 75% of resumes are automatically rejected by recruiting software before human eyes see them. CVGenie guarantees your resume passes automated screening on all leading platforms.
          </p>
        </div>

        {/* Answer-First AEO Callout Box */}
        <div className="bg-white dark:bg-slate-800 border-l-4 border-blue-600 rounded-r-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                What makes a resume 100% ATS-Compliant?
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                An ATS-compliant resume utilizes a <strong>clean single-column hierarchy</strong>, standard section titles (<em>Experience, Skills, Education</em>), and exact keyword matching from the target job description—avoiding tables, graphics, and multi-column sidebars that cause parsing errors.
              </p>
            </div>
          </div>
        </div>

        {/* ATS Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {atsSystems.map((ats) => (
            <Card key={ats.name} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      {ats.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {ats.share}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    {ats.passRate}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {ats.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                  {ats.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 4 Core ATS Engineering Standards */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
            How CVGenie’s Two-Pass AI Guarantees High ATS Scores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {standards.map((std, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 shrink-0">
                  {std.icon}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    {std.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {std.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
            >
              Optimize Your Resume for ATS Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
