import { useState } from 'react'

export function useAuthDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState({
    title: "Sign in to continue",
    description: "Access pro features and unlimited generations"
  })

  const openAuthDialog = (config?: { title?: string; description?: string }) => {
    if (config) {
      setDialogConfig({
        title: config.title || "Sign in to continue",
        description: config.description || "Access pro features and unlimited generations"
      })
    }
    setIsOpen(true)
  }

  const closeAuthDialog = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    openAuthDialog,
    closeAuthDialog,
    dialogConfig
  }
}