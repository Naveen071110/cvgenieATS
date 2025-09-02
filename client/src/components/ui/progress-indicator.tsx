
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Upload, FileText, Download } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressIndicator({ steps, className }: ProgressIndicatorProps) {
  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div 
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300',
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.active 
                    ? 'bg-primary text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-500'
              )}
            >
              {step.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4">{step.icon}</div>
              )}
            </div>
            <div className="flex-1">
              <p 
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  step.completed 
                    ? 'text-green-600' 
                    : step.active 
                      ? 'text-primary' 
                      : 'text-gray-500'
                )}
              >
                {step.label}
              </p>
            </div>
            {step.active && !step.completed && (
              <div className="branded-spinner-small" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FileUploadProgress({ 
  progress, 
  fileName, 
  stage = 'uploading' 
}: { 
  progress: number; 
  fileName?: string;
  stage?: 'uploading' | 'processing' | 'generating' | 'complete';
}) {
  const getStageInfo = () => {
    switch (stage) {
      case 'uploading':
        return { label: 'Uploading file...', icon: <Upload className="w-4 h-4" /> };
      case 'processing':
        return { label: 'Processing content...', icon: <FileText className="w-4 h-4" /> };
      case 'generating':
        return { label: 'Generating resume...', icon: <div className="branded-spinner-small" /> };
      case 'complete':
        return { label: 'Complete!', icon: <CheckCircle className="w-4 h-4" /> };
      default:
        return { label: 'Processing...', icon: <div className="branded-spinner-small" /> };
    }
  };

  const { label, icon } = getStageInfo();

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {fileName && (
        <p className="text-sm font-medium text-gray-700 truncate">
          {fileName}
        </p>
      )}
      
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 progress-animated"
              style={{ '--progress-width': `${progress}%`, width: `${progress}%` } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
