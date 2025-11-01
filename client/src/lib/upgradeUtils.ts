import { toast } from "@/hooks/use-toast";

export interface UpgradeResponse {
  paymentLink: string;
}

/**
 * Unified upgrade handler - Creates checkout session and opens payment link
 * This should be used by all "Upgrade to Pro" buttons throughout the app
 */
export async function handleUpgradeToPro(): Promise<boolean> {
  try {
    const response = await fetch('/api/subscription/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle specific error cases
      if (response.status === 400 && errorData.error?.includes('email')) {
        toast({
          title: "Email Required",
          description: "Please add an email to your profile to subscribe. You can do this in your account settings.",
          variant: "destructive",
        });
        return false;
      }
      
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const data: UpgradeResponse = await response.json();

    if (data && data.paymentLink) {
      // Open checkout in new tab (use window.open with noopener for security)
      const newWindow = window.open(data.paymentLink, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // Popup was blocked, show fallback
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Checkout Opened",
        description: "Complete your purchase in the new tab. Your Pro status will activate automatically after payment.",
      });
      
      return true;
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
    return false;
  }
}
