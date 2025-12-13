import { createContext } from 'react'

export interface PromptOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning' | 'success'
}

export interface PromptDialogContextType {
  showPrompt: (options: PromptOptions) => Promise<boolean>
  showAlert: (title: string, message: string, variant?: 'default' | 'danger' | 'warning' | 'success') => Promise<void>
}

export const PromptDialogContext = createContext<PromptDialogContextType | undefined>(undefined)
