import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is an ATS, and why does my resume need to be \"ATS-compliant\"?",
    answer: "An Applicant Tracking System (ATS) is software used by most employers to automatically screen, filter, and rank job applications. A resume that's not ATS-friendly might be rejected before a human ever sees it. CVGenie helps you create resumes that are specifically formatted for ATSs—using the right keywords, section headers, and layouts—so your application reaches real recruiters."
  },
  {
    question: "How is my data used in CVGenie? Do you store my personal information or resume?",
    answer: "Your data privacy is important to us. CVGenie processes your resume and job description only to generate your tailored documents. We do not store or reuse your uploaded resumes, job descriptions, or generated outputs unless you create an account and explicitly save them. For free and anonymous users, all data is deleted after generation."
  },
  {
    question: "What makes CVGenie's resumes better than free templates or generic AI tools?",
    answer: "CVGenie's AI is fine-tuned to produce resumes and cover letters that are optimized for ATS software. Unlike generic tools, it analyzes your target job description, matches keywords, and formats results according to best industry practices—giving you a better shot at interviews with large companies."
  },
  {
    question: "How many times can I use CVGenie for free?",
    answer: "You can generate up to 3 resumes or cover letters per month at no cost, with no signup required. If you need more generations or want premium features (like unlimited usage or priority support), consider upgrading to our Pro plan."
  },
  {
    question: "What file formats can I download? Will my formatting remain \"ATS-safe\"?",
    answer: "You can download your documents as plain text (TXT) or rich text (RTF). Both formats are designed to avoid common ATS issues—no tables, columns, images, or fancy graphics—so your submission remains machine-readable and recruiter-friendly."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about CVGenie
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-xl">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-500 transform transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}