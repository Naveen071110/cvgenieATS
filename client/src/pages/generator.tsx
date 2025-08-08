import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, Mail, Download, CheckCircle, ArrowLeft, Edit, Save, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import Lottie from "lottie-react";
import genieLoading from "../assets/lotties/genie-loading.json";

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
}

interface ResumeExtraction {
  filename: string;
  extractedContent: string;
  wordCount: number;
}

interface ResumeExtractionError {
  error: string;
  sampleResume?: string;
  message?: string;
}

export default function Generator() {
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [editedResume, setEditedResume] = useState("");
  const [editedCoverLetter, setEditedCoverLetter] = useState("");
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [isEditingResumeContent, setIsEditingResumeContent] = useState(false);
  const [extractedResume, setExtractedResume] = useState<ResumeExtraction | null>(null);
  const [sampleResumeError, setSampleResumeError] = useState<ResumeExtractionError | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isOpen, openAuthDialog, closeAuthDialog, dialogConfig } = useAuthDialog();

  // Get usage session
  const { data: usageSession } = useQuery<UsageSession>({
    queryKey: ["/api/usage", sessionId],
    enabled: !!sessionId,
  });

  // Extract resume content mutation
  const extractResumeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/extract-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        // Store the full error response for sample resume display
        setSampleResumeError(error);
        throw new Error(error.error || "Failed to extract resume content");
      }

      return response.json() as Promise<ResumeExtraction>;
    },
    onSuccess: (data) => {
      setSampleResumeError(null); // Clear any previous error
      setExtractedResume(data);
      setResumeContent(data.extractedContent);
      toast({
        title: "Resume Content Extracted",
        description: `Extracted ${data.wordCount} words from ${data.filename}. You can review and edit the content below.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("jobDescription", jobDescription);
      formData.append("resumeContent", resumeContent); // Use edited content
      
      // Create a new file from the edited content for compatibility
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const editedFile = new File([blob], extractedResume?.filename || 'resume.txt', { type: 'text/plain' });
      formData.append("resume", editedFile);

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
      setEditedResume(data.optimizedResume);
      setEditedCoverLetter(data.coverLetter);
      queryClient.invalidateQueries({ queryKey: ["/api/usage"] });
      toast({
        title: "Success!",
        description: "Your resume and cover letter have been generated.",
      });
    },
    onError: (error: Error) => {
      // Check if the error is about usage limits
      if (error.message.includes("usage limit exceeded")) {
        openAuthDialog({
          title: "Upgrade to Pro",
          description: "You've used all 3 free generations. Sign in to upgrade to Pro for unlimited generations."
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "text/plain", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      // Check file extension for DOCX files that might be detected as octet-stream
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['pdf', 'txt', 'docx'];
      
      const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension || '');
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOCX (Word), or TXT file.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
      // Reset previous extraction and results
      setExtractedResume(null);
      setResumeContent("");
      setGenerationResult(null);
      setSampleResumeError(null); // Clear any previous errors
      // Extract content from uploaded file
      extractResumeMutation.mutate(file);
    }
  };

  const resetGenerator = () => {
    setResumeFile(null);
    setJobDescription("");
    setGenerationResult(null);
    setEditedResume("");
    setEditedCoverLetter("");
    setIsEditingResume(false);
    setIsEditingCoverLetter(false);
    setResumeContent("");
    setIsEditingResumeContent(false);
    setExtractedResume(null);
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

  const remainingGenerations = usageSession?.isPro 
    ? -1 
    : Math.max(0, 3 - (usageSession?.generationsUsed || 0));

  const canGenerate = resumeFile && resumeContent.trim().length > 0 && jobDescription.trim().length >= 50 && !generateMutation.isPending;

  const handleGenerateClick = () => {
    if (!user && remainingGenerations <= 0) {
      openAuthDialog({
        title: "Sign in to continue",
        description: "You've used all 3 free generations. Sign in to upgrade to Pro for unlimited generations."
      });
      return;
    }
    generateMutation.mutate();
  };

  const handleUpgradeClick = () => {
    openAuthDialog({
      title: "Upgrade to Pro",
      description: "Get unlimited generations, priority support, and advanced features."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold text-slate-900">CVGenie</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Generate Your Perfect Resume
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload your current resume and paste the job description to get an ATS-optimized resume and personalized cover letter
            </p>
          </div>

          {!generationResult ? (
            <Card className="shadow-xl border border-slate-200 floating-card">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">Upload Your Resume</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                      {resumeFile ? (
                        <div>
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <p className="text-lg font-medium text-green-700 mb-2">File uploaded!</p>
                          <p className="text-slate-600 mb-4">{resumeFile.name}</p>
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('resume-upload')?.click()}
                          >
                            Choose Different File
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-slate-700 mb-2">Upload your resume</p>
                          <p className="text-slate-500 mb-4">Supported formats: PDF, DOCX (Word), TXT</p>
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('resume-upload')?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                      <input
                        type="file"
                        id="resume-upload"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>

                  {/* Sample Resume Error Display */}
                  {sampleResumeError && (
                    <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800">Upload Failed</h4>
                            <p className="text-sm text-red-700 mt-1">{sampleResumeError.error}</p>
                            {sampleResumeError.message && (
                              <p className="text-sm text-red-700 mt-2 font-medium">{sampleResumeError.message}</p>
                            )}
                          </div>
                        </div>
                        
                        {sampleResumeError.sampleResume && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-red-800">Sample Resume Format:</h5>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(sampleResumeError.sampleResume || '');
                                  toast({
                                    title: "Copied",
                                    description: "Sample resume copied to clipboard",
                                  });
                                }}
                                className="text-xs h-7 px-2"
                              >
                                Copy Sample
                              </Button>
                            </div>
                            <div className="bg-white rounded border border-red-200 p-3 max-h-60 overflow-y-auto">
                              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                                {sampleResumeError.sampleResume}
                              </pre>
                            </div>
                            <p className="text-xs text-red-600 mt-2">
                              Create a resume similar to this format and save it as a text-based PDF for best results.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Job Description */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">Job Description</h3>
                    <Textarea
                      rows={8}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job description here... Include responsibilities, requirements, and company information for best results."
                      className="resize-none"
                    />
                    <p className="text-sm text-slate-500">
                      {jobDescription.length}/50 characters minimum
                    </p>
                  </div>
                </div>

                {/* Resume Content Preview and Edit */}
                {extractedResume && (
                  <div className="mt-8 border-t pt-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900">
                          Resume Content ({extractedResume.wordCount} words)
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingResumeContent(!isEditingResumeContent)}
                          className="flex items-center gap-2"
                        >
                          {isEditingResumeContent ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                          {isEditingResumeContent ? "Save Changes" : "Edit Content"}
                        </Button>
                      </div>
                      
                      {extractResumeMutation.isPending && (
                        <div className="text-center py-4">
                          <div className="inline-flex items-center gap-2 text-slate-600">
                            <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
                            Extracting resume content...
                          </div>
                        </div>
                      )}

                      {isEditingResumeContent ? (
                        <Textarea
                          value={resumeContent}
                          onChange={(e) => setResumeContent(e.target.value)}
                          rows={15}
                          className="font-mono text-sm"
                          placeholder="Your resume content will appear here. You can edit it before generating the optimized version."
                        />
                      ) : (
                        <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                            {resumeContent}
                          </pre>
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-500">
                        Review and edit your resume content above. The AI will use this information to generate your optimized resume.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center space-y-4">
                  <Button
                    onClick={handleGenerateClick}
                    disabled={!canGenerate}
                    size="lg"
                    className="px-8 py-4"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Generate Resume & Cover Letter"
                    )}
                  </Button>
                  
                  {/* Usage Counter */}
                  <div className="text-sm text-slate-600">
                    {user?.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span>Pro User - Unlimited generations</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-4">
                        <span>
                          {remainingGenerations > 0 
                            ? `${remainingGenerations} free generations remaining`
                            : "No free generations remaining"
                          }
                        </span>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={handleUpgradeClick}
                          className="p-0 h-auto text-blue-600 hover:text-blue-700"
                        >
                          Upgrade to Pro
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lottie Loading Animation */}
                {generateMutation.isPending && (
                  <div className="flex flex-col items-center mt-8 md:mt-12 mb-8 px-4">
                    <div className="relative">
                      {genieLoading ? (
                        <Lottie 
                          animationData={genieLoading} 
                          loop={true} 
                          className="w-32 h-32 md:w-40 md:h-40 drop-shadow-lg"
                          onError={() => console.warn('Lottie animation failed to load')}
                        />
                      ) : (
                        // Fallback spinner if Lottie fails
                        <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                          <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-4 md:mt-6 space-y-2 max-w-sm md:max-w-md">
                      <p className="text-blue-700 font-semibold text-lg md:text-xl animate-pulse">
                        Generating your resume...
                      </p>
                      <p className="text-slate-600 text-xs md:text-sm px-4">
                        Our AI genie is working magic on your resume, optimizing it for ATS systems and crafting a personalized cover letter
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Success Header */}
              <Card className="shadow-xl border border-slate-200 floating-card">
                <CardContent className="p-6">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">Documents Generated Successfully!</h3>
                    <p className="text-slate-600">Review and edit your documents before downloading</p>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Section */}
              <Card className="shadow-xl border border-slate-200 floating-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-2" />
                      Optimized Resume
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingResume(!isEditingResume)}
                      >
                        {isEditingResume ? <Save className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                        {isEditingResume ? 'Save' : 'Edit'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadDocument(editedResume, 'optimized-resume.txt')}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download TXT
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingResume ? (
                    <Textarea
                      value={editedResume}
                      onChange={(e) => setEditedResume(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                      placeholder="Edit your resume here..."
                    />
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 max-h-96 overflow-y-auto leading-relaxed">
                        {editedResume}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cover Letter Section */}
              <Card className="shadow-xl border border-slate-200 floating-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Mail className="w-5 h-5 text-green-500 mr-2" />
                      Cover Letter
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)}
                      >
                        {isEditingCoverLetter ? <Save className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                        {isEditingCoverLetter ? 'Save' : 'Edit'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadDocument(editedCoverLetter, 'cover-letter.txt')}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download TXT
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingCoverLetter ? (
                    <Textarea
                      value={editedCoverLetter}
                      onChange={(e) => setEditedCoverLetter(e.target.value)}
                      rows={15}
                      className="font-mono text-sm"
                      placeholder="Edit your cover letter here..."
                    />
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 max-h-80 overflow-y-auto">
                        {editedCoverLetter}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-xl border border-slate-200 floating-card">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={resetGenerator}
                      variant="outline"
                      size="lg"
                    >
                      Generate Another Resume
                    </Button>
                    <Button
                      onClick={() => {
                        downloadDocument(editedResume, 'optimized-resume.txt');
                        downloadDocument(editedCoverLetter, 'cover-letter.txt');
                      }}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Both Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Usage Counter */}
          <div className="text-center mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              {usageSession?.isPro ? (
                "Unlimited generations with Pro plan"
              ) : (
                <>
                  <span className="font-semibold">{remainingGenerations}</span> free generations remaining this month. 
                  <Link to="/#pricing" className="text-primary hover:text-primary/80 font-medium ml-1">
                    Upgrade to Pro
                  </Link> for unlimited access.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <LoginDialog 
        open={isOpen} 
        onOpenChange={closeAuthDialog}
        title={dialogConfig.title}
        description={dialogConfig.description}
      />
    </div>
  );
}