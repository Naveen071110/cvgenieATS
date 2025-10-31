import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ sessionId: string; paymentLink: string }>("/api/subscription/create-checkout", {
        method: "POST",
      });

      if (response && response.paymentLink) {
        // Open checkout in new tab (use window.open with noopener for security)
        const newWindow = window.open(response.paymentLink, '_blank', 'noopener,noreferrer');
        
        if (!newWindow) {
          // Popup was blocked, show fallback
          toast({
            title: "Popup Blocked",
            description: "Please allow popups and try again, or copy the payment link.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        toast({
          title: "Checkout Opened",
          description: "Complete your purchase in the new tab. Your Pro status will activate automatically after payment.",
        });
        
        onClose();
      } else {
        throw new Error("No payment link received");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const proFeatures = [
    "Unlimited resume generations",
    "Unlimited cover letters",
    "Priority AI processing",
    "Advanced ATS optimization",
    "Resume history storage",
    "Download in multiple formats",
    "24/7 priority support",
    "Cancel anytime",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlock unlimited access to all features and take your job search to the next level.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              $9.99
              <span className="text-lg font-normal text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600">Billed monthly, cancel anytime</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What's included:</h3>
            <ul className="space-y-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold py-6 text-lg"
              data-testid="button-upgrade-pro"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Upgrade to Pro Now"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full"
              data-testid="button-cancel-upgrade"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Dodo Payments. Cancel anytime from your account settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
