
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { ProgressIndicator } from './progress-indicator';
import { FileUpload } from './file-upload';
import { ArrowLeft, ArrowRight, Download, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_FORMATS } from '@/lib/constants';

interface FormData {
  uploadedFile?: File;
  resumeText: string;
  jobDescription: string;
  generatedContent?: string;
}

interface ValidationState {
  [key: string]: {
    isValid: boolean;
    message?: string;
  };
}

export function EnhancedResumeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    resumeText: '',
    jobDescription: '',
  });
  const [validation, setValidation] = useState<ValidationState>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  const totalSteps = 3;
  const steps = [
    { 
      label: 'Upload', 
      description: 'Add your resume' 
    },
    { 
      label: 'Optimize', 
      description: 'Tailor to job' 
    },
    { 
      label: 'Download', 
      description: 'Get your resume' 
    }
  ];

  // Auto-save functionality
  const autoSave = useCallback(() => {
    setAutoSaveStatus('saving');
    try {
      localStorage.setItem('cvgenie-form-data', JSON.stringify(formData));
      localStorage.setItem('cvgenie-current-step', currentStep.toString());
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(null), 3000);
    }
  }, [formData, currentStep]);

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('cvgenie-form-data');
      const savedStep = localStorage.getItem('cvgenie-current-step');
      
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.warn('Failed to load saved form data');
    }
  }, []);

  // Auto-save when form data changes
  useEffect(() => {
    const timer = setTimeout(autoSave, 1000);
    return () => clearTimeout(timer);
  }, [autoSave]);

  // Validation logic
  const validateStep = (step: number): boolean => {
    const newValidation: ValidationState = {};

    switch (step) {
      case 1:
        if (!formData.uploadedFile && !formData.resumeText.trim()) {
          newValidation.upload = {
            isValid: false,
            message: 'Please upload a file or paste your resume content'
          };
        } else {
          newValidation.upload = { isValid: true };
        }
        break;

      case 2:
        if (!formData.jobDescription.trim()) {
          newValidation.jobDescription = {
            isValid: false,
            message: 'Please paste the job description'
          };
        } else if (formData.jobDescription.trim().length < 50) {
          newValidation.jobDescription = {
            isValid: false,
            message: 'Job description seems too short. Please provide more details.'
          };
        } else {
          newValidation.jobDescription = { isValid: true };
        }
        break;

      case 3:
        if (!formData.generatedContent) {
          newValidation.generation = {
            isValid: false,
            message: 'Content generation is required'
          };
        } else {
          newValidation.generation = { isValid: true };
        }
        break;
    }

    setValidation(newValidation);
    return Object.values(newValidation).every(v => v.isValid);
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 2) {
      // Process generation
      setIsProcessing(true);
      try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFormData(prev => ({
          ...prev,
          generatedContent: 'Generated optimized resume content...'
        }));
      } catch (error) {
        console.error('Generation failed:', error);
        return;
      } finally {
        setIsProcessing(false);
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (file: File) => {
    setFormData(prev => ({ ...prev, uploadedFile: file }));
  };

  const handleResumeTextChange = (text: string) => {
    setFormData(prev => ({ ...prev, resumeText: text }));
  };

  const handleJobDescriptionChange = (text: string) => {
    setFormData(prev => ({ ...prev, jobDescription: text }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Your Resume
              </h2>
              <p className="text-gray-600">
                Upload your existing resume or paste the content below
              </p>
            </div>

            <FileUpload 
              onFileSelect={handleFileUpload}
              className="mb-6"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or paste your resume</span>
              </div>
            </div>

            <div>
              <Textarea
                value={formData.resumeText}
                onChange={(e) => handleResumeTextChange(e.target.value)}
                placeholder="Paste your resume content here..."
                className="min-h-[200px] resize-none"
                aria-label="Resume content"
              />
              {validation.upload && !validation.upload.isValid && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {validation.upload.message}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Add Job Description
              </h2>
              <p className="text-gray-600">
                Paste the job description to optimize your resume
              </p>
            </div>

            <div>
              <Textarea
                value={formData.jobDescription}
                onChange={(e) => handleJobDescriptionChange(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[300px] resize-none"
                aria-label="Job description"
              />
              {validation.jobDescription && !validation.jobDescription.isValid && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {validation.jobDescription.message}
                </div>
              )}
            </div>

            {isProcessing && (
              <Alert>
                <Sparkles className="w-4 h-4 animate-spin" />
                <AlertDescription>
                  AI is optimizing your resume for this specific job...
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Optimized Resume
              </h2>
              <p className="text-gray-600">
                Review and download your ATS-optimized resume
              </p>
            </div>

            {formData.generatedContent && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Generation Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded border min-h-[200px] font-mono text-sm">
                    {formData.generatedContent}
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-12">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />
      </div>

      {/* Auto-save status */}
      {autoSaveStatus && (
        <div className="mb-4">
          <Alert className={cn(
            autoSaveStatus === 'saved' && "border-green-200 bg-green-50",
            autoSaveStatus === 'saving' && "border-blue-200 bg-blue-50",
            autoSaveStatus === 'error' && "border-red-200 bg-red-50"
          )}>
            <AlertDescription className="text-sm">
              {autoSaveStatus === 'saved' && '✓ Progress saved automatically'}
              {autoSaveStatus === 'saving' && '⏳ Saving progress...'}
              {autoSaveStatus === 'error' && '⚠ Failed to save progress'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Form Content */}
      <Card className="shadow-lg">
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex items-center gap-2"
          >
            Start Over
          </Button>
        )}
      </div>
    </div>
  );
}
