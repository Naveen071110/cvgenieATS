import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does CVGenie optimize my resume for ATS systems?",
    answer: "CVGenie analyzes your resume content and the target job description to identify key skills, qualifications, and keywords that ATS systems scan for. It then restructures your resume content, optimizes formatting for machine readability, and ensures proper keyword density without keyword stuffing. Our AI understands ATS parsing patterns and creates clean, structured documents that pass through screening filters while remaining appealing to human recruiters."
  },
  {
    question: "Is my resume data secure and private?",
    answer: "Absolutely. We process your resume data transiently - meaning it's only held in memory during generation and immediately discarded afterward. We don't store your personal information, resume content, or job descriptions on our servers. All processing happens securely through encrypted connections, and we never share your data with third parties. Your privacy and security are our top priorities."
  },
  {
    question: "Can I edit the generated resume and cover letter?",
    answer: "Yes! CVGenie generates optimized documents as a starting point, but you have complete control to edit and customize them. We provide multiple export formats including Word documents that you can easily modify, as well as plain text versions for copying and pasting into online applications. The generated content serves as a professional foundation that you can personalize further."
  },
  {
    question: "What file formats do you accept for resume upload?",
    answer: "Currently, we accept PDF files for resume uploads. PDFs are the most reliable format for text extraction and maintain formatting consistency. If your resume is in Word format, you can easily convert it to PDF using your word processor's \"Save as PDF\" or \"Export to PDF\" feature. We're working on supporting additional formats in future updates."
  },
  {
    question: "How accurate is the AI in understanding job requirements?",
    answer: "Our AI is trained on thousands of job descriptions and successful resumes across various industries. It identifies not just obvious keywords but also understands context, job level requirements, industry-specific terminology, and subtle qualifications that human recruiters value. The system continuously improves its accuracy through machine learning, ensuring it stays current with evolving job market trends and requirements."
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer: "Yes, you can cancel your Pro subscription at any time with no cancellation fees or penalties. You'll continue to have Pro access until the end of your current billing period, after which your account will automatically revert to the free plan with its limitations. You can reactivate Pro whenever you need unlimited access again."
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
