import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Upload, Target, Sparkles, CheckCircle, TrendingUp, FileText, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Improvement {
  id: string;
  type: 'keyword' | 'format' | 'metric' | 'section';
  text: string;
  impact: string;
  icon: React.ReactNode;
}

interface ProcessStepProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ProcessStep({ step, isActive, isCompleted, icon, title, description, onClick }: ProcessStepProps) {
  return (
    <div
      className={cn(
        "process-step cursor-pointer transition-all duration-300 p-6 rounded-xl border-2 text-center",
        isActive ? "border-blue-500 bg-blue-50 shadow-lg scale-105" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md",
        isCompleted && "border-green-500 bg-green-50"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className={cn(
        "step-icon w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl transition-colors",
        isActive ? "bg-blue-500 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
      )}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {isCompleted && (
        <div className="mt-3">
          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
        </div>
      )}
    </div>
  );
}

function ATSScoreBar({ score, isVisible = false }: { score: number; isVisible?: boolean }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">ATS Compatibility Score</span>
        <span className={cn(
          "text-xl font-bold",
          score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
        )}>
          {isVisible ? score : 0}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getScoreColor(score))}
          style={{ width: isVisible ? `${score}%` : '0%' }}
        />
      </div>
      <p className="text-xs text-gray-500 text-center font-medium">
        {getScoreLabel(score)}
      </p>
    </div>
  );
}

function generateMockImprovements(input: string): Improvement[] {
  const improvements: Improvement[] = [];
  const words = input.toLowerCase().split(/\s+/);

  if (words.length > 5) {
    improvements.push({
      id: '1',
      type: 'keyword',
      text: 'Added 3 industry-specific keywords',
      impact: '+15% ATS match',
      icon: <Target className="w-4 h-4" />
    });
  }

  if (words.some(word => ['worked', 'responsible', 'helped'].includes(word))) {
    improvements.push({
      id: '2',
      type: 'metric',
      text: 'Quantified achievements with metrics',
      impact: '+20% impact',
      icon: <TrendingUp className="w-4 h-4" />
    });
  }

  if (input.length > 50) {
    improvements.push({
      id: '3',
      type: 'format',
      text: 'Optimized formatting for ATS parsing',
      impact: '+10% readability',
      icon: <FileText className="w-4 h-4" />
    });
  }

  if (words.length > 20) {
    improvements.push({
      id: '4',
      type: 'section',
      text: 'Enhanced professional summary',
      impact: '+25% engagement',
      icon: <Brain className="w-4 h-4" />
    });
  }

  return improvements;
}

function calculateMockScore(input: string): number {
  const baseScore = 45;
  const words = input.split(/\s+/).filter(word => word.length > 0);

  let score = baseScore;

  // Add points for length
  score += Math.min(words.length * 2, 30);

  // Add points for keywords
  const keywords = ['experience', 'skills', 'management', 'development', 'leadership', 'project', 'team', 'results'];
  const foundKeywords = words.filter(word => keywords.includes(word.toLowerCase()));
  score += foundKeywords.length * 3;

  // Add points for numbers (metrics)
  const hasNumbers = /\d/.test(input);
  if (hasNumbers) score += 10;

  // Add points for professional words
  const professionalWords = ['achieved', 'implemented', 'led', 'developed', 'managed', 'created'];
  const foundProfessional = words.filter(word => professionalWords.includes(word.toLowerCase()));
  score += foundProfessional.length * 2;

  return Math.min(Math.max(score, 15), 95);
}

export function InteractiveDemo({ className }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [atsScore, setAtsScore] = useState(45);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Added for processing state

  const steps = [
    {
      number: 1,
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Resume",
      description: "Any format - DOC, DOCX, or TXT"
    },
    {
      number: 2,
      icon: <Target className="w-6 h-6" />,
      title: "Paste Job Description",
      description: "From any job board or website"
    },
    {
      number: 3,
      icon: <Sparkles className="w-6 h-6" />,
      title: "Get Optimized Resume",
      description: "ATS-friendly and tailored"
    }
  ];

  useEffect(() => {
    if (input.trim()) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        const newImprovements = generateMockImprovements(input);
        const newScore = calculateMockScore(input);

        setImprovements(newImprovements);
        setAtsScore(newScore);
        setIsTyping(false);

        // Mark steps as completed based on input
        const newCompleted: number[] = [];
        if (input.length > 20) newCompleted.push(1);
        if (input.length > 50) newCompleted.push(2);
        if (input.length > 100) newCompleted.push(3);

        setCompletedSteps(newCompleted);
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      setImprovements([]);
      setAtsScore(45);
      setCompletedSteps([]);
      setIsTyping(false);
    }
  }, [input]);

  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber);
  };

  const startDemo = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      // Optionally, move to the next step or show a success message
    }, 2000);
  };

  return (
    <section className={cn("py-16 bg-gradient-to-br from-blue-50 to-indigo-100", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 fade-in-up">
            See CVGenie in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            Try our interactive demo and watch your resume transform in real-time
          </p>
        </div>

        {/* Interactive Process Steps */}
        <div className="mb-12 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step) => (
              <ProcessStep
                key={step.number}
                step={step.number}
                isActive={activeStep === step.number}
                isCompleted={completedSteps.includes(step.number)}
                icon={step.icon}
                title={step.title}
                description={step.description}
                onClick={() => handleStepClick(step.number)}
              />
            ))}
          </div>
        </div>

        {/* Interactive Demo Form */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="fade-in-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {activeStep === 1 ? 'Paste Your Resume Content' : 
                   activeStep === 2 ? 'Paste Job Description' : 
                   'See Your Optimized Content'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeStep === 1 
                      ? "Paste a section of your resume here to see real-time AI optimization..."
                      : activeStep === 2
                      ? "Paste the job description you're targeting..."
                      : "Your optimized content will appear here..."
                  }
                  className="min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500"
                  disabled={activeStep === 3}
                />
                {isTyping && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600">
                    <div className="loading-spinner inline-block w-4 h-4"></div>
                    <span className="text-sm">AI is analyzing your content...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="fade-in-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                {/* Processing Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center z-10">
                    <div className="flex flex-col items-center space-y-4 relative">
                      {/* Magic sparkles during processing */}
                      <div className="sparkle absolute -top-4 -left-4 w-2 h-2"></div>
                      <div className="sparkle absolute -bottom-2 right-2 w-3 h-3" style={{ animationDelay: '0.8s' }}></div>
                      <div className="sparkle absolute top-2 -right-6 w-2 h-2" style={{ animationDelay: '1.5s' }}></div>

                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--magic-purple)]"></div>
                      <p className="font-semibold" style={{ color: 'var(--magic-purple)' }}>Processing with AI Magic...</p>
                    </div>
                  </div>
                )}
                
                {/* ATS Score */}
                <div>
                  <ATSScoreBar score={atsScore} isVisible={input.length > 0} />
                </div>

                {/* Improvements */}
                {improvements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Suggested Improvements</h4>
                    <div className="space-y-3">
                      {improvements.map((improvement, index) => (
                        <div
                          key={improvement.id}
                          className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200 fade-in-up"
                          style={{ animationDelay: `${1 + index * 0.1}s` }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            {improvement.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{improvement.text}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {improvement.impact}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {input.length === 0 && !isProcessing && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Start typing to see AI-powered improvements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          {improvements.length > 0 && (
            <div className="text-center mt-12 fade-in-up" style={{ animationDelay: '1.2s' }}>
              <Button 
                onClick={startDemo}
                disabled={isProcessing}
                className="magic-button px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: isProcessing ? 'var(--magic-glow)' : 'var(--genie-gradient)' }}
              >
                Get Your Full Optimized Resume
                <Sparkles className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                See {improvements.length} more improvements in the full version
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}