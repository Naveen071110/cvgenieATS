import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SignIn } from '@clerk/clerk-react'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

function getRedirectUrl(): string {
  const savedRedirect = localStorage.getItem("auth_redirect");
  return savedRedirect || "/dashboard";
}

export function LoginDialog({ open, onOpenChange, title, description }: LoginDialogProps) {
  const redirectUrl = open ? getRedirectUrl() : "/dashboard";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" aria-describedby="login-dialog-description">
        <DialogHeader>
          <DialogTitle id="login-dialog-title">{title}</DialogTitle>
          <DialogDescription id="login-dialog-description">{description}</DialogDescription>
        </DialogHeader>
        <SignIn
          routing="virtual"
          afterSignInUrl={redirectUrl}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0 w-full",
              headerTitle: "text-center text-xl font-bold",
              headerSubtitle: "text-center text-sm text-gray-600",
              socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              footerActionLink: "text-primary hover:text-primary/80",
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}