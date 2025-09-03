
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { FileText, File, Download } from 'lucide-react';

interface ExportOption {
  format: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ExportOptionsProps {
  onExport: (format: string) => void;
  isGenerating: boolean;
  downloads?: Record<string, string>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport, isGenerating, downloads }) => {
  const exportOptions: ExportOption[] = [
    { 
      format: 'pdf', 
      label: 'PDF Only', 
      icon: <FileText className="w-6 h-6" />, 
      description: 'Professional format for applications' 
    },
    { 
      format: 'docx', 
      label: 'Word Document', 
      icon: <File className="w-6 h-6" />, 
      description: 'Easy to edit and customize' 
    },
    { 
      format: 'both', 
      label: 'Both Formats', 
      icon: <Download className="w-6 h-6" />, 
      description: 'PDF + DOCX versions' 
    }
  ];

  // If downloads are available, show download links
  if (downloads && Object.keys(downloads).length > 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Download Your Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(downloads).map(([key, url]) => {
              const isResume = key.includes('resume');
              const isPDF = key.includes('PDF');
              
              return (
                <a
                  key={key}
                  href={url}
                  download
                  className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isPDF ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
                  <span className="font-medium">
                    {isResume ? 'Resume' : 'Cover Letter'} ({isPDF ? 'PDF' : 'DOCX'})
                  </span>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Choose Export Format</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {exportOptions.map(option => (
            <Button
              key={option.format}
              onClick={() => onExport(option.format)}
              disabled={isGenerating}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5"
            >
              <span className="text-primary">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-gray-500 text-center">{option.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
