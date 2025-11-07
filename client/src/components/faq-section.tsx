
import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
}

const faqData: FAQItem[] = [
  {
    id: 'file-formats',
    question: 'What file formats do you support?',
    answer: 'We support DOC, DOCX, and TXT files. DOCX files provide the best results for our AI analysis. You can also paste your resume content directly into the text area.',
    keywords: ['doc', 'docx', 'txt', 'format', 'upload', 'file']
  },
  {
    id: 'ats-optimization',
    question: 'How does ATS optimization work?',
    answer: 'Our AI analyzes job descriptions and optimizes your resume with relevant keywords, proper formatting, and ATS-friendly structure. We ensure your resume passes through Applicant Tracking Systems used by most companies.',
    keywords: ['ats', 'applicant tracking system', 'optimization', 'keywords', 'formatting']
  },
  {
    id: 'generation-time',
    question: 'How long does it take to generate an optimized resume?',
    answer: 'Resume optimization typically takes 30-60 seconds. Our AI analyzes your content, matches it with the job description, and generates an optimized version with improved keywords and formatting.',
    keywords: ['time', 'duration', 'speed', 'fast', 'generate']
  },
  {
    id: 'pricing-plans',
    question: 'What are your pricing plans?',
    answer: 'We offer both free and premium plans. Free users get 3 resume generations per month. Premium users enjoy unlimited generations, advanced templates, and priority processing for just $9.99/month.',
    keywords: ['pricing', 'cost', 'free', 'premium', 'plans', 'subscription']
  },
  {
    id: 'data-security',
    question: 'Is my resume data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption to protect your data. Your resumes are processed securely and never shared with third parties. You can delete your data anytime from your account.',
    keywords: ['security', 'privacy', 'data', 'safe', 'encryption', 'protection']
  },
  {
    id: 'multiple-jobs',
    question: 'Can I optimize my resume for multiple job applications?',
    answer: 'Yes! You can optimize your resume for different job descriptions. Each optimization creates a tailored version specific to that role, maximizing your chances of getting interviews.',
    keywords: ['multiple', 'jobs', 'different', 'applications', 'tailor', 'customize']
  },
  {
    id: 'download-formats',
    question: 'What download formats are available?',
    answer: 'You can download your optimized resume as DOCX or TXT. DOCX is recommended for most applications, while TXT format allows easy copying and pasting.',
    keywords: ['download', 'export', 'doc', 'docx', 'txt', 'format']
  },
  {
    id: 'ai-accuracy',
    question: 'How accurate is the AI optimization?',
    answer: 'Our AI has been trained on thousands of successful resumes and job descriptions. It achieves a 94% ATS pass rate and significantly improves keyword matching for better visibility to recruiters.',
    keywords: ['ai', 'accuracy', 'success', 'rate', 'effective', 'results']
  },
  {
    id: 'refund-policy',
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with our service, contact support within 30 days of purchase for a full refund.',
    keywords: ['refund', 'money back', 'guarantee', 'cancel', 'return']
  },
  {
    id: 'support',
    question: 'How can I get support?',
    answer: 'Our support team is available via email at support@cvgenie.com. Premium users also get priority support with faster response times. We typically respond within 24 hours.',
    keywords: ['support', 'help', 'contact', 'email', 'assistance', 'customer service']
  }
];

interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQAccordionItem({ item, isOpen, onToggle }: FAQAccordionItemProps) {
  return (
    <Card className="faq-item overflow-hidden transition-all duration-200 hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
      <button
        className="faq-question w-full text-left focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-${item.id}`}
        id={`faq-${item.id}-button`}
      >
        <CardHeader className="py-5 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white leading-6">
              {item.question}
            </CardTitle>
            <ChevronDown
              className={cn(
                "faq-icon w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4",
                isOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </div>
        </CardHeader>
      </button>
      <div
        id={`faq-${item.id}`}
        className={cn(
          "faq-answer overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        role="region"
        aria-labelledby={`faq-${item.id}-button`}
      >
        <CardContent className="px-6 pb-6 pt-0">
          <div className="prose prose-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {item.answer}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqData;

    const query = searchQuery.toLowerCase();
    return faqData.filter(item => 
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      (item.keywords && item.keywords.some(keyword => keyword.includes(query)))
    );
  }, [searchQuery]);

  // Handle accordion toggle
  const toggleItem = useCallback((itemId: string) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev);
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        // Close all other items (accordion behavior)
        newOpenItems.clear();
        newOpenItems.add(itemId);
      }
      return newOpenItems;
    });
  }, []);

  // Handle search input
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Close all items when searching
    setOpenItems(new Set());
  }, []);

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary/10 dark:bg-blue-900/30 rounded-full mb-4 md:mb-6">
            <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-primary dark:text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about CVGenie and our AI-powered resume optimization
          </p>
        </div>

        <div className="faq-container max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="faq-search mb-6 md:mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="faq-search-input pl-12 pr-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 rounded-xl focus:border-primary dark:focus:border-blue-500 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 transition-all duration-200"
                aria-label="Search frequently asked questions"
              />
            </div>
            {searchQuery && (
              <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
                {filteredFAQs.length === 0 && ' - try a different search term'}
              </p>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="faq-accordion space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item) => (
                <FAQAccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              ))
            ) : (
              <Card className="text-center py-12 dark:bg-gray-800 dark:border-gray-700">
                <CardContent>
                  <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No FAQs found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search terms or{' '}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-primary dark:text-blue-400 hover:underline focus:outline-none focus:underline"
                    >
                      clear the search
                    </button>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          
        </div>
      </div>
    </section>
  );
}
