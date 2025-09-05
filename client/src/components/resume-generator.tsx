import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, Mail, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileUpload } from '@/components/file-upload';
import ExportOptions from './export-options';

interface UsageSession {
  id: string;
  sessionId: string;
  generationsUsed: number;
  isPro: number;
}

interface GenerationResult {
  id: string;
  optimizedResume: string;
  coverLetter: string;
  remainingGenerations: number;
  downloads?: Record<string, string>;
}

export default function ResumeGenerator() {
  const [step, setStep] = useState(1);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [exportFormat, setExportFormat] = useState<string>('docx');
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get usage session
  const { data: usageSession } = useQuery<UsageSession>({
    queryKey: ["/api/usage", sessionId],
    enabled: !!sessionId,
  });

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("jobDescription", jobDescription);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append('exportFormat', exportFormat);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate documents");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setGenerationResult(data);
      setStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
      toast({
        title: "Success!",
        description: "Your resume and cover letter have been generated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.docx')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a DOCX or TXT file.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const resetGenerator = () => {
    setStep(1);
    setResumeFile(null);
    setJobDescription("");
    setGenerationResult(null);
  };

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, type: 'resume' | 'coverLetter') => {
    navigator.clipboard.writeText(text);
    if (type === 'resume') {
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    } else {
      setCopiedCoverLetter(true);
      setTimeout(() => setCopiedCoverLetter(false), 2000);
    }
    toast({
      title: "Copied to Clipboard",
      description: `The ${type} has been successfully copied.`,
    });
  };

  const remainingGenerations = usageSession?.isPro
    ? -1
    : Math.max(0, 3 - (usageSession?.generationsUsed || 0));

  return (
    <main role="main" aria-labelledby="generator-title">
      <section id="generator" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 id="generator-title" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Generate Your Perfect Resume
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow these simple steps to create an ATS-optimized resume tailored to your target job
            </p>
          </div>

        {/* Progress Steps */}
        <nav aria-label="Resume generation progress" className="flex items-center justify-center mb-12">
          <ol className="flex items-center space-x-4" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
            <li className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 1 ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                }`}
                aria-label={`Step 1: Upload Resume${step >= 1 ? ' (completed)' : ''}`}
              >
                1
              </div>
              <span className={`ml-2 font-medium ${
                step >= 1 ? "text-slate-700" : "text-slate-500"
              }`}>
                Upload Resume
              </span>
            </li>
            <div className={`w-16 h-1 rounded ${
              step >= 2 ? "bg-primary" : "bg-slate-200"
            }`}></div>
            <li className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 2 ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                }`}
                aria-label={`Step 2: Job Description${step >= 2 ? ' (completed)' : ''}`}
              >
                2
              </div>
              <span className={`ml-2 font-medium ${
                step >= 2 ? "text-slate-700" : "text-slate-500"
              }`}>
                Job Description
              </span>
            </li>
            <div className={`w-16 h-1 rounded ${
              step >= 3 ? "bg-primary" : "bg-slate-200"
            }`} aria-hidden="true"></div>
            <li className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= 3 ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                }`}
                aria-label={`Step 3: Generate${step >= 3 ? ' (completed)' : ''}`}
              >
                3
              </div>
              <span className={`ml-2 font-medium ${
                step >= 3 ? "text-slate-700" : "text-slate-500"
              }`}>
                Generate
              </span>
            </li>
          </ol>
        </nav>

        {/* Generator Form */}
        <Card className="shadow-xl border border-slate-200">
          <CardContent className="p-8">
            {/* Step 1: Resume Upload */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Step 1: Upload Your Resume</h3>
                  <p className="text-slate-600">Upload your current resume in PDF, DOC, or DOCX format</p>
                </div>

                <FileUpload
                  onFileSelect={(file) => {
                    setResumeFile(file);
                    setStep(2);
                  }}
                  onFileRemove={() => {
                    setResumeFile(null);
                    setStep(1);
                  }}
                  selectedFile={resumeFile}
                  error={""} // Assuming FileUpload handles its own error display
                  enableSteps={true}
                  className="mb-6"
                />

                <div className="text-center">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!resumeFile}
                    size="lg"
                  >
                    Continue to Job Description
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Job Description */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Step 2: Paste the Job Description</h3>
                  <p className="text-slate-600">Copy the job posting you're interested in applying for</p>
                </div>

                <div className="space-y-4">
                  <label htmlFor="job-description" className="block text-sm font-medium text-slate-700">
                    Job Description
                  </label>
                  <Textarea
                    id="job-description"
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here... Include responsibilities, requirements, and company information for best results."
                    className="resize-none"
                    aria-describedby="job-description-help"
                    aria-required="true"
                  />
                  <div id="job-description-help" className="sr-only">
                    Enter a detailed job description including responsibilities, requirements, and company information for best optimization results. Minimum 50 characters required.
                  </div>
                </div>

                {/* Export Options */}
                {resumeFile && jobDescription && !generateMutation.isPending && !generationResult && (
                  <ExportOptions 
                    onExport={(format) => setExportFormat(format)}
                    isGenerating={false}
                  />
                )}

                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={!jobDescription.trim() || jobDescription.length < 50 || generateMutation.isPending}
                    size="lg"
                  >
                    {generateMutation.isPending ? "Generating..." : "Generate Resume & Cover Letter"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Generation & Results */}
            {step === 3 && (
              <div className="space-y-6">
                {generateMutation.isPending ? (
                  <div className="text-center py-8">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Generating Your Documents...</h3>
                      <p className="text-slate-600">Our AI is optimizing your resume and creating a personalized cover letter</p>
                    </div>

                    <div className="mt-8">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <p className="text-slate-600 mt-4">This usually takes 10-15 seconds...</p>
                    </div>
                  </div>
                ) : generationResult && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Documents Generated Successfully!</h3>
                      <p className="text-slate-600">Your ATS-optimized resume and personalized cover letter are ready</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                      <div className="border border-slate-200 rounded-lg p-6 text-center">
                        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h4 className="font-semibold text-slate-900 mb-2">Optimized Resume</h4>
                        <p className="text-sm text-slate-600 mb-4">ATS-friendly format with relevant keywords</p>
                        <div className="bg-white p-4 rounded border mb-4 max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed">
                            {generationResult.optimizedResume}
                          </pre>
                        </div>
                        <Button
                          onClick={() => downloadDocument(generationResult.optimizedResume, 'optimized-resume.txt')}
                          className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-6 text-center">
                        <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h4 className="font-semibold text-slate-900 mb-2">Cover Letter</h4>
                        <p className="text-sm text-slate-600 mb-4">Personalized for the specific job posting</p>
                        <div className="bg-white p-4 rounded border mb-4 max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed">
                            {generationResult.coverLetter}
                          </pre>
                        </div>
                        <Button
                          onClick={() => downloadDocument(generationResult.coverLetter, 'cover-letter.txt')}
                          className="w-full bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Cover Letter
                        </Button>
                      </div>
                    </div>

                    {/* Download Links */}
                    <ExportOptions 
                      onExport={() => {}}
                      isGenerating={false}
                      downloads={generationResult.downloads}
                    />

                    <div className="text-center">
                      <Button
                        onClick={resetGenerator}
                        variant="outline"
                        size="lg"
                      >
                        Generate Another Resume
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Counter */}
        <div className="text-center mt-8 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            {usageSession?.isPro ? (
              "Unlimited generations with Pro plan"
            ) : (
              <>
                <span className="font-semibold">{remainingGenerations}</span> free generations remaining this month.
                <button
                  onClick={() => {
                    const element = document.getElementById("pricing");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-primary hover:text-primary/80 font-medium ml-1"
                >
                  Upgrade to Pro
                </button> for unlimited access.
              </>
            )}
          </p>
        </div>
      </div>
      </section>
    </main>
  );
}