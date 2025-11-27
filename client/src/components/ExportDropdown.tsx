import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, File, ChevronDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportDropdownProps {
  content: string;
  filename: string;
  disabled?: boolean;
  variant?: "resume" | "coverLetter";
}

type ExportFormat = "pdf" | "docx" | "txt";

export function ExportDropdown({ content, filename, disabled, variant = "resume" }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);
  const { toast } = useToast();

  const buttonColors = variant === "resume" 
    ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
    : "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50";

  const exportToFormat = async (format: ExportFormat) => {
    if (!content || content.trim() === "") {
      toast({
        title: "Export Error",
        description: "No content available to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(format);

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          filename: `${filename}.${format}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: `Your ${format.toUpperCase()} file has been downloaded.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: `Failed to export as ${format.toUpperCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const formatIcons: Record<ExportFormat, React.ReactNode> = {
    pdf: <File className="w-4 h-4 mr-2 text-red-500" />,
    docx: <FileText className="w-4 h-4 mr-2 text-blue-500" />,
    txt: <FileText className="w-4 h-4 mr-2 text-gray-500" />,
  };

  const formatLabels: Record<ExportFormat, string> = {
    pdf: "PDF Document",
    docx: "Word Document (DOCX)",
    txt: "Plain Text (TXT)",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className={buttonColors}
          disabled={disabled || !content || content.trim() === "" || isExporting !== null}
          data-testid={`export-dropdown-${variant}`}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-1" />
          )}
          Export
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(["pdf", "docx", "txt"] as ExportFormat[]).map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => exportToFormat(format)}
            disabled={isExporting !== null}
            className="cursor-pointer"
            data-testid={`export-${format}-${variant}`}
          >
            {isExporting === format ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              formatIcons[format]
            )}
            {formatLabels[format]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
