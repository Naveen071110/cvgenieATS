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
        isActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg scale-105" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md",
        isCompleted && "border-green-500 bg-green-50 dark:bg-green-900/30"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className={cn(
        "step-icon w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl transition-colors",
        isActive ? "bg-blue-500 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
      )}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
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
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ATS Compatibility Score</span>
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
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
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

  const steps = [
    {
      number: 1,
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Resume",
      description: "Any format - DOC, DOCX, or TXT"
    },
    {
      number: 2,
      icon: <Sparkles className="w-6 h-6" />,
      title: "Get your Live ATS score",
      description: "Get your resume's ATS score"
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

  return (
    <section className={cn("py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 fade-in-up">
            Get Your ATS Score Live
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            Paste your resume content and get instant AI-powered ATS analysis
          </p>
        </div>

        {/* Interactive Process Steps */}
        <div className="mb-12 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
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
            <Card className="fade-in-up bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {activeStep === 1 ? 'Paste Your Resume Content' : 'See Your Optimized Content'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeStep === 1 
                      ? "Paste a section of your resume here to see real-time AI optimization..."
                      : "Your optimized content will appear here..."
                  }
                  className="min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500"
                  disabled={activeStep === 2}
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
            <Card className="fade-in-up bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Brain className="w-5 h-5 text-green-600" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ATS Score */}
                <div>
                  <ATSScoreBar score={atsScore} isVisible={input.length > 0} />
                </div>

                {/* Improvements */}
                {improvements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Suggested Improvements</h4>
                    <div className="space-y-3">
                      {improvements.map((improvement, index) => (
                        <div
                          key={improvement.id}
                          className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 fade-in-up"
                          style={{ animationDelay: `${1 + index * 0.1}s` }}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                            {improvement.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{improvement.text}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {improvement.impact}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {input.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p>Start typing to see AI-powered improvements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          {improvements.length > 0 && (
            <div className="text-center mt-12 fade-in-up" style={{ animationDelay: '1.2s' }}>
              <Button className="magic-cta group genie-lamp" size="lg">
                Reveal All Secrets
                <Sparkles className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                See {improvements.length} more magical improvements in the full version
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}