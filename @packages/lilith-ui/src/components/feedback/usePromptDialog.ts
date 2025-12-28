import { useContext } from 'react'
import { PromptDialogContext } from './PromptDialogContext'

/**
 * Hook for accessing the prompt dialog context.
 * Must be used within a PromptDialogProvider.
 *
 * @returns The prompt dialog context with showPrompt and showAlert methods
 * @throws Error if used outside PromptDialogProvider
 *
 * @example
 * const { showPrompt, showAlert } = usePromptDialog()
 * const confirmed = await showPrompt({
 *   title: 'Confirm',
 *   message: 'Are you sure?'
 * })
 */
export const usePromptDialog = () => {
  const context = useContext(PromptDialogContext)
  if (!context) {
    throw new Error('usePromptDialog must be used within a PromptDialogProvider')
  }
  return context
}
