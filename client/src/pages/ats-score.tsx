import { useEffect } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { InteractiveDemo } from "@/components/interactive-demo";

export default function ATSScore() {
  useEffect(() => {
    document.title = "Free ATS Resume Score Checker & Keyword Scanner | CVGenie ATS";
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Scan your resume against any job description for free. Check your ATS score, keyword density, section formatting, and get actionable improvement tips.";

    return () => {
      document.title = "CVGenie ATS - AI Resume Builder & ATS Optimizer | cvgenieats.com";
      const cleanupMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (cleanupMeta) {
        cleanupMeta.content = "CVGenie: AI-powered resume builder that beats ATS systems. Create optimized resumes, cover letters, and get past applicant tracking systems. Free AI resume optimization.";
      }
    };
  }, []);

  return (
    <AppShell title="ATS Score">
      <InteractiveDemo />
    </AppShell>
  );
}
