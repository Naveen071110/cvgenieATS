
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface AILoadingStateProps {
  isVisible: boolean;
  currentStep?: number;
  progress?: number;
  onComplete?: () => void;
}

const processingSteps = [
  {
    id: 'extract',
    title: 'Extracting content and structure',
    description: 'Reading and parsing your resume',
    icon: FileText,
    duration: 2000
  },
  {
    id: 'analyze',
    title: 'Analyzing job requirements',
    description: 'Matching skills and experience',
    icon: Target,
    duration: 3000
  },
  {
    id: 'optimize',
    title: 'Generating optimizations',
    description: 'AI is crafting improvements',
    icon: Brain,
    duration: 4000
  },
  {
    id: 'format',
    title: 'Formatting final resume',
    description: 'Applying ATS-friendly formatting',
    icon: CheckCircle,
    duration: 1500
  }
];

export function AILoadingState({ isVisible, currentStep = 0, progress = 0, onComplete }: AILoadingStateProps) {
  const [localStep, setLocalStep] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setLocalStep(0);
      setLocalProgress(0);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    
    // Simulate realistic progress if not provided externally
    const stepInterval = setInterval(() => {
      setLocalStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= processingSteps.length) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsAnimating(false);
            onComplete?.();
          }, 500);
          return prev;
        }
        return nextStep;
      });
    }, 3000);

    // Progress animation
    const progressInterval = setInterval(() => {
      setLocalProgress(prev => {
        const increment = Math.random() * 15 + 5; // Random 5-20% increments
        const newProgress = Math.min(prev + increment, 95);
        
        if (localStep >= processingSteps.length - 1 && newProgress >= 95) {
          setLocalProgress(100);
          clearInterval(progressInterval);
          return 100;
        }
        
        return newProgress;
      });
    }, 800);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible, onComplete, localStep]);

  const currentStepData = processingSteps[currentStep || localStep];
  const displayProgress = progress || localProgress;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-lg bg-white shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* AI Brain Animation */}
            <div className="ai-brain-animation relative mx-auto w-24 h-24">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                    '0 0 0 20px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Synapse animations */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="synapse absolute w-2 h-2 bg-primary/60 rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${15 + i * 25}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            {/* Processing Status */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                AI is analyzing your resume...
              </h3>
              
              {currentStepData && (
                <motion.div
                  key={currentStepData.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="processing-step space-y-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <currentStepData.icon className="w-5 h-5 text-primary" />
                    <p className="text-lg font-semibold text-gray-800">
                      {currentStepData.title}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {currentStepData.description}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="processing-progress space-y-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{Math.round(displayProgress)}%</span>
              </div>
              <Progress 
                value={displayProgress} 
                className="h-3 bg-gray-100"
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {processingSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === (currentStep || localStep);
                const isCompleted = index < (currentStep || localStep);
                
                return (
                  <motion.div
                    key={step.id}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                      isActive 
                        ? "bg-primary border-primary text-white scale-110" 
                        : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                    )}
                    animate={isActive ? { 
                      scale: [1, 1.1, 1],
                      borderColor: ['#3b82f6', '#1d4ed8', '#3b82f6']
                    } : {}}
                    transition={{ 
                      duration: 1.5, 
                      repeat: isActive ? Infinity : 0 
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                );
              })}
            </div>

            {/* Estimated Time */}
            <div className="text-xs text-gray-500 mt-4">
              Estimated time: 30-60 seconds
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// LoadingStateManager class for programmatic control
export class LoadingStateManager {
  private static instance: LoadingStateManager;
  private currentStep: number = 0;
  private progress: number = 0;
  private callbacks: Set<(step: number, progress: number) => void> = new Set();

  static getInstance(): LoadingStateManager {
    if (!LoadingStateManager.instance) {
      LoadingStateManager.instance = new LoadingStateManager();
    }
    return LoadingStateManager.instance;
  }

  subscribe(callback: (step: number, progress: number) => void) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  showAIProcessing() {
    this.currentStep = 0;
    this.progress = 0;
    this.notifyCallbacks();
  }

  updateProgress(step: number, percentage: number) {
    this.currentStep = step;
    this.progress = percentage;
    this.notifyCallbacks();
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.currentStep, this.progress));
  }

  reset() {
    this.currentStep = 0;
    this.progress = 0;
    this.notifyCallbacks();
  }
}
