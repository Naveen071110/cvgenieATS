
import { useState } from 'react';
import { Check, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Improvement {
  icon: React.ReactNode;
  text: string;
  metric?: string;
}

const improvements: Improvement[] = [
  {
    icon: <Check className="w-5 h-5" />,
    text: "Added 15 relevant keywords",
    metric: "+15"
  },
  {
    icon: <Check className="w-5 h-5" />,
    text: "Improved ATS compatibility",
    metric: "+89%"
  },
  {
    icon: <Check className="w-5 h-5" />,
    text: "Enhanced formatting structure",
    metric: "100%"
  },
  {
    icon: <Check className="w-5 h-5" />,
    text: "Optimized section ordering",
    metric: "+25%"
  },
  {
    icon: <Check className="w-5 h-5" />,
    text: "Improved readability score",
    metric: "+40%"
  },
  {
    icon: <Check className="w-5 h-5" />,
    text: "Added quantified achievements",
    metric: "+8"
  }
];

const OriginalResume = () => (
  <div className="bg-white p-6 border border-gray-200 rounded-lg min-h-[500px]">
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-medium text-gray-900">John Smith</h3>
        <p className="text-gray-600">Software Developer</p>
        <p className="text-sm text-gray-500">john@email.com | 555-0123</p>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="font-medium">Developer at ABC Company</p>
          <p>• Worked on web applications</p>
          <p>• Used various technologies</p>
          <p>• Collaborated with team members</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
        <p className="text-sm text-gray-600">JavaScript, HTML, CSS, React</p>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Education</h4>
        <p className="text-sm text-gray-600">Bachelor's Degree in Computer Science</p>
      </div>
    </div>
    
    <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded">
      <div className="flex items-center text-red-600">
        <span className="text-xs font-medium">⚠️ ATS Score: 45% - Needs Improvement</span>
      </div>
    </div>
  </div>
);

const OptimizedResume = () => (
  <div className="bg-white p-6 border border-gray-200 rounded-lg min-h-[500px]">
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-xl font-bold text-gray-900">John Smith</h3>
        <p className="text-lg font-semibold text-primary">Senior Software Developer</p>
        <p className="text-sm text-gray-600">john.smith@email.com | (555) 123-4567 | LinkedIn: /john-smith-dev</p>
      </div>
      
      <div>
        <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Professional Experience</h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-bold text-gray-900">Senior Frontend Developer | ABC Technology Solutions</p>
            <p className="text-gray-600 italic">March 2022 - Present</p>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li>• Developed 12+ responsive React applications serving 50,000+ daily active users</li>
              <li>• Implemented TypeScript and modern JavaScript ES6+ features reducing bugs by 35%</li>
              <li>• Led cross-functional team of 5 developers on agile product development cycles</li>
              <li>• Optimized application performance achieving 40% faster load times</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Technical Skills</h4>
        <div className="text-sm text-gray-700">
          <p><strong>Frontend:</strong> React, TypeScript, JavaScript ES6+, HTML5, CSS3, Redux, Next.js</p>
          <p><strong>Backend:</strong> Node.js, Express, RESTful APIs, GraphQL</p>
          <p><strong>Tools:</strong> Git, Docker, AWS, Jest, Webpack, Agile/Scrum</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Education</h4>
        <p className="text-sm text-gray-700">
          <strong>Bachelor of Science in Computer Science</strong><br/>
          University of Technology | Graduated Magna Cum Laude (GPA: 3.8/4.0)
        </p>
      </div>
    </div>
    
    <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded">
      <div className="flex items-center text-green-600">
        <Check className="w-4 h-4 mr-2" />
        <span className="text-xs font-medium">✅ ATS Score: 94% - Excellent Match</span>
      </div>
    </div>
  </div>
);

export function ResumeComparison() {
  const [activeView, setActiveView] = useState<'before' | 'after'>('before');

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See the CVGenie Difference
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how our AI transforms your resume into an ATS-optimized, professional document that gets results
          </p>
        </div>

        <Card className="resume-comparison shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Toggle Controls */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  className={cn(
                    "px-6 py-3 rounded-md font-medium transition-all duration-200",
                    "flex items-center gap-2",
                    activeView === 'before'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                  onClick={() => setActiveView('before')}
                  aria-pressed={activeView === 'before'}
                >
                  <FileText className="w-4 h-4" />
                  Original Resume
                </button>
                <button
                  className={cn(
                    "px-6 py-3 rounded-md font-medium transition-all duration-200",
                    "flex items-center gap-2",
                    activeView === 'after'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                  onClick={() => setActiveView('after')}
                  aria-pressed={activeView === 'after'}
                >
                  <Sparkles className="w-4 h-4" />
                  CVGenie Optimized
                </button>
              </div>
            </div>

            {/* Resume Display */}
            <div className="relative mb-8">
              <div 
                className="resume-display transition-all duration-500 ease-in-out"
                role="region"
                aria-live="polite"
                aria-label={`${activeView === 'before' ? 'Original' : 'Optimized'} resume preview`}
              >
                {activeView === 'before' ? <OriginalResume /> : <OptimizedResume />}
              </div>
              
              {/* Transition Arrow */}
              {activeView === 'after' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white p-2 rounded-full animate-bounce">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Improvements List */}
            <div 
              className={cn(
                "improvements-section transition-all duration-500",
                activeView === 'after' ? "opacity-100 transform translate-y-0" : "opacity-50 transform translate-y-4"
              )}
            >
              <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Key Improvements Made
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className={cn(
                      "improvement-item flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg",
                      "transition-all duration-300 hover:bg-green-100 hover:border-green-300",
                      activeView === 'after' && "animate-in slide-in-from-bottom-2"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      {improvement.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-green-800">
                        {improvement.text}
                      </span>
                      {improvement.metric && (
                        <div className="text-xs font-bold text-green-600 mt-1">
                          {improvement.metric}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8"
              >
                Transform My Resume Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
