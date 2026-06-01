import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, FileText, Loader2, Lock, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionModal } from './SubscriptionModal';

interface Resume {
  id: number;
  resume_text: string;
  cover_letter?: string;
  job_description?: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionStatus {
  isPro: boolean;
  subscriptionStatus: string;
}

export default function ResumeHistory() {
  const { getToken, isSignedIn } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();

  // Check subscription status
  const { data: subscriptionStatus, isLoading: isLoadingSubscription } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status"],
    enabled: !!isSignedIn,
    retry: false,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isPro = subscriptionStatus?.isPro && subscriptionStatus?.subscriptionStatus === 'active';

  useEffect(() => {
    if (isSignedIn && isPro) {
      fetchResumes();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, isPro]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('/api/resume-history', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Pro subscription required
          const errorData = await response.json();
          toast({
            title: 'Pro Feature',
            description: errorData.message || 'Resume History requires an active Pro subscription.',
            variant: 'destructive',
          });
          return;
        }
        throw new Error('Failed to fetch resume history');
      }

      const data = await response.json();
      setResumes(data.resumes || []);
    } catch (error: any) {
      console.error('Error fetching resume history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resume history. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = (resume: Resume, type: 'resume' | 'cover_letter') => {
    const content = type === 'resume' ? resume.resume_text : resume.cover_letter;
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'resume' 
      ? `resume_${resume.id}.txt` 
      : `cover_letter_${resume.id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Success',
      description: `${type === 'resume' ? 'Resume' : 'Cover letter'} downloaded successfully!`,
    });
  };

  const deleteResume = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = await getToken();
      const response = await fetch(`/api/resume-history/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      setResumes(resumes.filter(r => r.id !== id));
      toast({
        title: 'Success',
        description: 'Resume deleted successfully!',
      });
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="container-not-signed-in">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Resume History</CardTitle>
            <CardDescription>Sign in to view your saved resumes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please sign in to access your resume history and manage your saved resumes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show Pro upgrade view if user is not Pro
  if (isSignedIn && !isLoadingSubscription && !isPro) {
    return (
      <>
        <div className="container mx-auto px-4 py-16 text-center" data-testid="container-pro-required">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">Resume History</CardTitle>
              <CardDescription className="text-base">
                Unlock unlimited access to all your saved resumes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Pro Feature</h3>
                </div>
                <p className="text-muted-foreground text-center mb-4">
                  Resume History is exclusively available to Pro subscribers. Upgrade now to:
                </p>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Access all your saved resumes anytime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    <span>Download resumes in multiple formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    <span>Unlimited resume generations</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold py-6 text-lg"
                data-testid="button-upgrade-to-pro"
              >
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
        <SubscriptionModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)}
          onNeedLogin={() => {
            setShowUpgradeModal(false);
            // User will need to refresh or navigate after login
          }}
        />
      </>
    );
  }

  if (loading || isLoadingSubscription) {
    return (
      <div className="container mx-auto px-4 py-16 text-center" data-testid="container-loading">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your resume history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16" data-testid="container-resume-history">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-title">My Resume History</h1>
          <p className="text-muted-foreground" data-testid="text-description">
            View and manage all your generated resumes
          </p>
        </div>

        {resumes.length === 0 ? (
          <Card data-testid="card-no-resumes">
            <CardHeader>
              <CardTitle>No Resumes Yet</CardTitle>
              <CardDescription>
                You haven't generated any resumes yet. Create your first optimized resume now!
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow" data-testid={`card-resume-${resume.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-resume-title-${resume.id}`}>
                          Resume #{resume.id}
                        </CardTitle>
                        <CardDescription data-testid={`text-resume-date-${resume.id}`}>
                          Created {new Date(resume.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteResume(resume.id)}
                      disabled={deletingId === resume.id}
                      data-testid={`button-delete-${resume.id}`}
                    >
                      {deletingId === resume.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {resume.job_description && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Job Description:</p>
                      <p className="text-sm line-clamp-2" data-testid={`text-job-description-${resume.id}`}>
                        {resume.job_description}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => downloadResume(resume, 'resume')}
                      size="sm"
                      data-testid={`button-download-resume-${resume.id}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                    {resume.cover_letter && (
                      <Button
                        onClick={() => downloadResume(resume, 'cover_letter')}
                        size="sm"
                        variant="outline"
                        data-testid={`button-download-cover-${resume.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Cover Letter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
