
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
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
}

const defaultAcceptedTypes = ['.pdf', '.doc', '.docx', '.txt'];
const defaultMaxSize = 10; // 10MB

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
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type not supported. Please upload: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size too large. Maximum size is ${maxSize}MB`;
    }

    return null;
  };

  const handleFileSelection = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      return;
    }
    onFileSelect(file);
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
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove?.();
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

  if (selectedFile && !isUploading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
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
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className={cn("space-y-6", className)}>
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
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragging 
            ? "border-primary bg-primary/10 scale-105" 
            : "border-gray-300 bg-gray-50",
          error && "border-red-300 bg-red-50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        role="button"
        tabIndex={0}
        aria-label="Upload resume file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />

        <div className="space-y-4">
          <div className={cn(
            "w-16 h-16 mx-auto rounded-lg flex items-center justify-center transition-all duration-300",
            isDragging 
              ? "bg-primary/20 scale-110" 
              : "bg-gray-200",
            error && "bg-red-100"
          )}>
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Upload className={cn(
                "w-8 h-8 transition-colors duration-300",
                isDragging ? "text-primary" : "text-gray-500"
              )} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className={cn(
              "text-lg font-semibold transition-colors duration-300",
              isDragging ? "text-primary" : "text-gray-900",
              error && "text-red-600"
            )}>
              {isDragging 
                ? "Drop your resume here" 
                : error 
                  ? "Upload Error"
                  : "Drag & drop your resume here"
              }
            </h3>
            
            {!error && (
              <p className="text-sm text-gray-600">
                or{' '}
                <span className="font-medium text-primary hover:text-primary/80">
                  browse files
                </span>
              </p>
            )}
          </div>

          {!isDragging && !error && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
            >
              Choose File
            </Button>
          )}
        </div>

        {/* File Requirements */}
        {!error && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Supports: {acceptedTypes.join(', ')} • Max size: {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
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

      {/* Success State Hint */}
      {!selectedFile && !error && !isUploading && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Upload your resume to get started with AI-powered optimization
          </p>
        </div>
      )}
    </div>
  );
}
