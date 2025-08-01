import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, Mail, Download, CheckCircle, ArrowLeft, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

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

export default function Generator() {
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [editedResume, setEditedResume] = useState("");
  const [editedCoverLetter, setEditedCoverLetter] = useState("");
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
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
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
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

  const canGenerate = resumeFile && jobDescription.trim().length >= 50 && !generateMutation.isPending;

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
                          <p className="text-slate-500 mb-4">PDF format only</p>
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
                        accept=".pdf"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>

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

                <div className="mt-8 text-center">
                  <Button
                    onClick={() => generateMutation.mutate()}
                    disabled={!canGenerate}
                    size="lg"
                    className="px-8 py-4"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Generate Resume & Cover Letter"
                    )}
                  </Button>
                </div>
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
    </div>
  );
}