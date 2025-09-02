import { CheckCircle, Mail, Download, Zap, Target, FileText, Package } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import AIBrainIcon from "../assets/icons/ai-brain.svg?react"
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react"
import DocumentTransformIcon from "../assets/icons/document-transform.svg?react"
import MultiFormatExportIcon from "../assets/icons/multi-format-export.svg?react"
import AnalyticsDashboardIcon from "../assets/icons/analytics-dashboard.svg?react"
import TargetBullseyeIcon from "../assets/icons/target-bullseye.svg?react"

const features = [
  {
    icon: AIBrainIcon,
    title: "One-Click Tailoring",
    description: "Upload your resume and paste any job description. Our AI instantly analyzes both and tailors your experience to match exactly what employers are looking for, highlighting relevant skills and achievements.",
    benefits: [
      "Keyword optimization for ATS systems",
      "Smart skill matching and prioritization",
      "Experience reframing for maximum impact"
    ],
    mockup: (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-slate-700">AI Analysis Complete</span>
          </div>
          <div className="space-y-2">
            <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full inline-block">React Developer</div>
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block">JavaScript</div>
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full inline-block">Team Leadership</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Keyword Match</span>
            <span className="text-sm font-semibold text-green-600">94%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
          </div>
        </div>
      </div>
    ),
    reverse: false
  },
  {
    icon: ATSShieldIcon,
    title: "ATS-Optimized Formatting",
    description: "Most resumes get rejected by Applicant Tracking Systems before human eyes see them. Our AI ensures your resume passes through ATS filters with proper formatting, structure, and keyword placement.",
    benefits: [
      "Clean, parseable document structure",
      "Strategic keyword placement",
      "Compatible with all major ATS platforms"
    ],
    mockup: (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="border-b border-slate-200 pb-4 mb-4">
          <h4 className="font-bold text-slate-900">John Smith</h4>
          <p className="text-sm text-slate-600">Senior React Developer</p>
          <p className="text-xs text-slate-500">john.smith@email.com • (555) 123-4567</p>
        </div>
        <div className="space-y-3">
          <div>
            <h5 className="font-semibold text-slate-800 text-sm mb-1">EXPERIENCE</h5>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-medium">Frontend Developer - TechCorp</p>
              <p>• Developed React applications using TypeScript</p>
              <p>• Led team of 4 developers on major product launch</p>
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 text-sm mb-1">SKILLS</h5>
            <p className="text-xs text-slate-600">React, TypeScript, Node.js, GraphQL, AWS</p>
          </div>
        </div>
        <div className="mt-4 p-2 bg-green-50 rounded border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-xs font-medium text-green-700">ATS Compatible</span>
          </div>
        </div>
      </div>
    ),
    reverse: true
  },
  {
    icon: Mail,
    title: "AI-Personalized Cover Letters",
    description: "Don't send generic cover letters. Our AI crafts personalized cover letters that connect your experience directly to the company's needs, mentioning specific requirements and showing genuine interest.",
    benefits: [
      "Company-specific customization",
      "Professional tone and structure",
      "Highlights relevant achievements"
    ],
    mockup: (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <Mail className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-semibold text-slate-800">AI-Generated Cover Letter</span>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p>"Dear Hiring Manager,</p>
          <p>I am excited to apply for the Senior React Developer position at TechCorp. With 5+ years of experience building scalable React applications, I am particularly drawn to your company's focus on innovative fintech solutions.</p>
          <p>Your job posting mentions the need for expertise in TypeScript and GraphQL - technologies I have used extensively in my current role where I lead a team of 4 developers...</p>
          <div className="flex items-center pt-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="px-3 text-xs text-slate-400">Personalized content continues</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
        </div>
      </div>
    ),
    reverse: false
  },
  {
    icon: MultiFormatExportIcon,
    title: "Multiple Export Formats",
    description: "Get your documents in the format you need. Whether you're applying online, emailing directly, or printing for in-person interviews, we've got you covered with multiple professional formats.",
    benefits: [
      "PDF for professional submission",
      "Plain text for easy copying",
      "Word document for easy editing"
    ],
    mockup: (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">Export Options</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 font-bold text-sm">PDF</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">PDF Resume</p>
                <p className="text-sm text-slate-500">Professional format</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-sm">DOC</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Word Document</p>
                <p className="text-sm text-slate-500">Easy to customize</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-gray-600 font-bold text-sm">TXT</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Plain Text</p>
                <p className="text-sm text-slate-500">Copy & paste ready</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    ),
    reverse: true
  }
];

export default function FeaturesSection() {
  const scrollFadeInRef = useScrollAnimation();

  return (
    <section 
      id="features" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="features-title"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" ref={scrollFadeInRef}>
          <h2 
            id="features-title"
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            Powerful Features for Perfect Resumes
          </h2>
          <p className="text-body-large max-w-2xl mx-auto text-gray-600">
            Our AI-powered platform combines cutting-edge technology with professional expertise
            to create resumes that stand out in today's competitive job market.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {features.map((feature, index) => {
            const featureAnimation = useScrollAnimation({ threshold: 0.1 });
            const isEven = index % 2 === 0;
            const slideDirection = isEven ? 'slide-in-left' : 'slide-in-right';

            return (
            <div
              key={index}
              ref={featureAnimation.ref}
              className={`grid lg:grid-cols-2 items-center ${slideDirection} ${
                featureAnimation.isVisible ? 'visible' : ''
              } ${feature.reverse ? 'lg:grid-flow-col-dense' : ''}`}
              style={{ 
                gap: 'var(--space-8)',
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div 
                className={`${feature.reverse ? 'lg:col-start-2' : ''}`}
                style={{ 
                  paddingLeft: 'var(--space-2)',
                  paddingRight: 'var(--space-2)'
                }}
              >
                <div 
                  className="flex items-center justify-center feature-icon-hover group cursor-pointer bg-primary/10"
                  style={{ 
                    width: 'var(--space-16)',
                    height: 'var(--space-16)',
                    borderRadius: 'var(--space-6)',
                    marginBottom: 'var(--space-6)'
                  }}
                >
                  <feature.icon 
                    className="transition-transform duration-300 group-hover:scale-110 text-primary"
                    style={{ width: 'var(--space-8)', height: 'var(--space-8)' }}
                  />
                </div>
                <h3 
                  className="text-card-title text-gray-900"
                  style={{ marginBottom: 'var(--space-3)' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-body leading-relaxed text-gray-600"
                  style={{ marginBottom: 'var(--space-4)' }}
                >
                  {feature.description}
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-gray-600">
                      <CheckCircle 
                        className="flex-shrink-0 text-green-500"
                        style={{ 
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                      <span className="text-sm sm:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div 
                className={`${feature.reverse ? 'lg:col-start-1' : ''} feature-mockup-hover`}
                style={{ 
                  paddingLeft: 'var(--space-2)',
                  paddingRight: 'var(--space-2)'
                }}
              >
                {feature.mockup}
              </div>
            </div>
          );
          })}
        </div>

        {/* CTA after features */}
        <div className="text-center mt-16">
          <Link to="/generator">
            <button
              className="cta-primary group"
              aria-label="Start creating your optimized resume for free"
            >
              Create My Resume
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}