import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  isUploading?: boolean;
  uploadProgress?: number;
  uploadStage?: string;
  error?: string;
  selectedFile?: File | null;
  className?: string;
  enableSteps?: boolean;
  isProcessing?: boolean;
}

const defaultAcceptedTypes = ['.pdf'];
const defaultMaxSize = 10; // 10MB

interface ValidationError {
  type: 'file-type' | 'file-size' | 'file-missing';
  message: string;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const validateFile = (file: File): FileValidationResult => {
  // Check file type
  const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const isValidType = validTypes.includes(file.type) ||
    Object.values(ACCEPTED_FILE_TYPES).flat().some(ext => file.name.toLowerCase().endsWith(ext));

  if (!isValidType) {
    return {
      isValid: false,
      error: 'Please upload PDF, DOCX, or TXT files only'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    };
  }

  // Check minimum file size (empty files)
  if (file.size < 1024) { // Less than 1KB
    return {
      isValid: false,
      error: 'File appears to be empty or corrupted. Please select a valid file.'
    };
  }

  return { isValid: true };
};

export function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = defaultAcceptedTypes,
  maxSize = defaultMaxSize,
  isUploading = false,
  uploadProgress = 0,
  uploadStage = '',
  error = '',
  selectedFile = null,
  className,
  enableSteps = true,
  isProcessing = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = enableSteps ? 3 : 1;
  const steps = [
    { id: 1, title: 'Select Resume', description: 'Upload your resume file' },
    { id: 2, title: 'Validate File', description: 'Verify file format and content' },
    { id: 3, title: 'Ready to Process', description: 'Your resume is ready for optimization' }
  ];

  const clearValidationError = () => {
    setValidationError(null);
  };

  const handleRealTimeValidation = (file: File | null) => {
    if (!file) {
      clearValidationError();
      setIsValidated(false);
      return;
    }

    const error = validateFile(file);
    setValidationError(error.error ? { type: 'file-type', message: error.error } : null);
    setIsValidated(!error.error);

    // Auto-advance to next step if validation passes and steps are enabled
    if (!error.error && enableSteps && currentStep === 1) {
      setTimeout(() => setCurrentStep(2), 500);
      setTimeout(() => setCurrentStep(3), 1500);
    }
  };

  const handleFileSelection = (file: File) => {
    handleRealTimeValidation(file);

    const error = validateFile(file);
    if (error.isValid) {
      onFileSelect(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    } else {
      handleRealTimeValidation(null);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    clearValidationError();
    setIsValidated(false);
    setCurrentStep(1);
    onFileRemove?.();
  };

  const handleStepNavigation = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const getUploadStageMessage = () => {
    switch (uploadStage) {
      case 'uploading':
        return 'Uploading your resume...';
      case 'extracting':
        return 'Extracting content from your resume...';
      case 'analyzing':
        return 'Analyzing resume structure...';
      case 'processing':
        return 'Processing and optimizing...';
      case 'complete':
        return 'Upload completed successfully!';
      default:
        return 'Processing your resume...';
    }
  };

  const getEstimatedTime = () => {
    if (uploadProgress < 30) return '~30 seconds remaining';
    if (uploadProgress < 60) return '~20 seconds remaining';
    if (uploadProgress < 90) return '~10 seconds remaining';
    return 'Almost done...';
  };

  // Step Progress Indicator
  const StepProgressIndicator = () => {
    if (!enableSteps) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep >= step.id
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  )}
                  role="progressbar"
                  aria-valuenow={currentStep}
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  aria-label={`Step ${step.id} of ${totalSteps}: ${step.title}`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors duration-300",
                      currentStep >= step.id ? "text-primary" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-20">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-300",
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>
    );
  };

  if (selectedFile && !isUploading) {
    return (
      <div className={cn("space-y-4", className)}>
        <StepProgressIndicator />
        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type ? selectedFile.type.split('/')[1].toUpperCase() : 'Unknown'} Format
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-green-600 hover:text-green-800 hover:bg-green-100"
                aria-label="Remove selected file"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {enableSteps && currentStep === 3 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-700 font-medium">
                ✓ Resume validated and ready for optimization
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isUploading || isProcessing) {
    return (
      <div className={cn("space-y-6", className)}>
        <StepProgressIndicator />
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">
                {getUploadStageMessage()}
              </h4>
              <p className="text-sm text-blue-600">
                {getEstimatedTime()}
              </p>
            </div>

            <div className="space-y-2">
              <Progress
                value={uploadProgress}
                className="w-full h-2"
              />
              <p className="text-xs text-blue-500">
                {uploadProgress}% complete
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <StepProgressIndicator />

      <form id="resume-upload-form" noValidate>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragging
              ? "border-primary bg-primary/10 scale-105"
              : "border-gray-300 bg-gray-50",
            validationError && "border-red-300 bg-red-50",
            isValidated && "border-green-300 bg-green-50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          role="button"
          tabIndex={0}
          aria-label="Upload resume file"
          aria-describedby={validationError ? "file-upload-error" : "file-upload-instructions"}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBrowseClick();
            }
          }}
          aria-live="polite"
        >
          <input
            ref={fileInputRef}
            id="resume"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileInputChange}
            className="hidden"
            aria-hidden="true"
            required
            disabled={isProcessing}
          />

        <div className="space-y-4">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-lg flex items-center justify-center transition-all duration-300",
              isDragging
                ? "bg-primary/20 scale-110"
                : isValidated ? "bg-green-100" :
                validationError
                  ? "bg-red-100"
                  : "bg-gray-200"
            )}>
              {validationError ? (
                <AlertCircle
                  className="w-8 h-8 text-red-500"
                  aria-hidden="true"
                  role="img"
                  aria-label="Error indicator"
                />
              ) : isValidated ? (
                <CheckCircle
                  className="w-8 h-8 text-green-500"
                  aria-hidden="true"
                  role="img"
                  aria-label="Success indicator"
                />
              ) : (
                <Upload className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  isDragging ? "text-primary" : "text-gray-500"
                )}
                aria-hidden="true"
                role="img"
                aria-label="Upload indicator"
                />
              )}
            </div>

            <div className="space-y-2">
              <h3 className={cn(
                "text-lg font-semibold transition-colors duration-300",
                isDragging ? "text-primary" :
                isValidated ? "text-green-600" :
                validationError ? "text-red-600" : "text-gray-900"
              )}>
                {isDragging
                  ? "Drop your resume file here"
                  : isValidated
                    ? "File Ready"
                    : validationError
                      ? "Invalid File"
                      : enableSteps && currentStep === 1
                        ? "Step 1: Select your resume"
                        : "Upload your resume"
                }
              </h3>

              {!validationError && !isValidated && (
                <p className="text-sm text-gray-600">
                  or{' '}
                  <span className="font-medium text-primary hover:text-primary/80">
                    browse files
                  </span>
                </p>
              )}

              {isValidated && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Valid file selected
                </p>
              )}
            </div>

            {!isDragging && !validationError && !isValidated && (
              <Button
                type="button"
                variant="outline"
                className="mt-4 touch-target"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                disabled={isProcessing}
              >
                Choose File
              </Button>
            )}
          </div>

        {/* File Requirements */}
          {!validationError && !isValidated && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mt-2">
                Supports: PDF, DOCX, TXT files • Max size: 10MB
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Upload your resume in PDF, Word, or text format
              </p>
            </div>
          )}

          {/* Hidden instructions for screen readers */}
          <div id="file-upload-instructions" className="sr-only">
            Upload your resume in PDF, DOCX, or TXT format. Maximum file size is 10MB.
            You can drag and drop a file or click to browse for files.
          </div>
        </div>
      </form>

      {/* Real-time Validation Error Message */}
      {validationError && (
        <div
          id="file-upload-error"
          className="bg-red-50 border border-red-200 rounded-lg p-4 error-label"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700">{validationError.message}</p>
              <p className="text-xs text-red-600 mt-1">
                Please select a valid file to continue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Error Message Support */}
      {error && !validationError && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step Navigation (if applicable) */}
      {enableSteps && currentStep > 1 && !isUploading && !isProcessing && (
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStepNavigation(currentStep - 1)}
            className="touch-target"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep < totalSteps && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStepNavigation(currentStep + 1)}
              disabled={!isValidated}
              className="touch-target"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}

      {/* Success State Hint */}
      {!selectedFile && !validationError && !error && !isUploading && !isProcessing && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {enableSteps
              ? "Follow the steps above to upload and validate your resume"
              : "Upload your resume to get started with AI-powered optimization"
            }
          </p>
        </div>
      )}
    </div>
  );
}