import { Dialog, DialogContent } from '@/components/ui/dialog'
import { SignIn } from '@clerk/clerk-react'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <SignIn 
          routing="virtual"
          afterSignInUrl="/generator"
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
