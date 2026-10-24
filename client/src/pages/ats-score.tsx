import { AppShell } from "@/components/app-shell/AppShell";
import { InteractiveDemo } from "@/components/interactive-demo";
import { SEO } from "@/components/SEO";

export default function ATSScore() {
  return (
    <AppShell title="ATS Score Checker">
      <SEO
        title="Free ATS Resume Score Checker &amp; Keyword Scanner | CVGenie ATS"
        description="Scan your resume against any job description for free. Check your ATS score, keyword density, section formatting, and get actionable improvement tips."
        canonical="https://cvgenieats.com/ats-score"
      />
      <InteractiveDemo />
    </AppShell>
  );
}
