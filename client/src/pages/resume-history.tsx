import ResumeHistory from '@/components/ResumeHistory';
import { SEO } from '@/components/SEO';

export default function ResumeHistoryPage() {
  return (
    <>
      <SEO
        title="Resume History &amp; Saved Versions | CVGenie ATS"
        description="Access and download your previously generated ATS-friendly resumes and tailored cover letters in PDF and Word formats."
        noindex={true}
      />
      <ResumeHistory />
    </>
  );
}
