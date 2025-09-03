
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    label: string;
    description?: string;
  }>;
  className?: string;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  steps, 
  className 
}: ProgressIndicatorProps) {
  return (
    <div className={cn("progress-indicator w-full max-w-4xl mx-auto", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
            }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div 
              key={stepNumber}
              className={cn(
                "step flex flex-col items-center relative z-10",
                "transition-all duration-300 ease-out",
                isActive && "scale-105"
              )}
            >
              {/* Step circle */}
              <div 
                className={cn(
                  "step-circle w-12 h-12 rounded-full flex items-center justify-center",
                  "border-2 font-semibold text-sm transition-all duration-300",
                  isCompleted && "bg-green-600 border-green-600 text-white",
                  isActive && "bg-blue-600 border-blue-600 text-white shadow-lg",
                  isUpcoming && "bg-white border-gray-300 text-gray-400"
                )}
                role="status"
                aria-label={`Step ${stepNumber}: ${step.label} ${
                  isCompleted ? '(completed)' : 
                  isActive ? '(current)' : 
                  '(upcoming)'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <span className="step-number">{stepNumber}</span>
                )}
              </div>

              {/* Step label */}
              <div className="mt-3 text-center max-w-[120px]">
                <div 
                  className={cn(
                    "step-label text-sm font-medium transition-colors duration-300",
                    isCompleted && "text-green-700",
                    isActive && "text-blue-700",
                    isUpcoming && "text-gray-500"
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div 
                    className={cn(
                      "text-xs mt-1 transition-colors duration-300",
                      isCompleted && "text-green-600",
                      isActive && "text-blue-600",
                      isUpcoming && "text-gray-400"
                    )}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </div>
      </div>
    </div>
  );
}
