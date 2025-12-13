import React, { useState } from 'react'
import type { ReactNode } from 'react'
import PromptDialog from './PromptDialog'
import { PromptDialogContext, type PromptOptions } from './PromptDialogContext'

/**
 * Context provider for imperative prompt dialog API with Promise-based async/await support.
 * Wraps application with dialog state management and provides `showPrompt` and `showAlert` methods via context.
 *
 * @param props - Provider props
 * @param props.children - Child components that can access dialog context
 * @returns A context provider with dialog state management
 *
 * @example
 * // Basic setup: Wrap app with provider
 * import { PromptDialogProvider } from '@transftw/lilith-ui';
 *
 * function App() {
 *   return (
 *     <PromptDialogProvider>
 *       <YourApp />
 *     </PromptDialogProvider>
 *   );
 * }
 *
 * @example
 * // Use showPrompt for confirmation dialogs with async/await
 * import { usePromptDialog } from '@transftw/lilith-ui';
 *
 * function DeleteButton() {
 *   const { showPrompt } = usePromptDialog();
 *
 *   const handleDelete = async () => {
 *     const confirmed = await showPrompt({
 *       title: 'Confirm Delete',
 *       message: 'Are you sure?',
 *       confirmText: 'Delete',
 *       variant: 'danger'
 *     });
 *
 *     if (confirmed) {
 *       await deleteItem();
 *     }
 *   };
 *
 *   return <Button onClick={handleDelete}>Delete</Button>;
 * }
 */
export const PromptDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    options: PromptOptions
    resolve: ((value: boolean) => void) | null
  }>({
    isOpen: false,
    options: { title: '', message: '' },
    resolve: null
  })

  const showPrompt = (options: PromptOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve
      })
    })
  }

  const showAlert = (title: string, message: string, variant: 'default' | 'danger' | 'warning' | 'success' = 'default'): Promise<void> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        options: {
          title,
          message,
          confirmText: 'OK',
          cancelText: undefined,
          variant
        },
        resolve: () => resolve()
      })
    })
  }

  const handleClose = () => {
    if (dialogState.resolve) {
      dialogState.resolve(false)
    }
    setDialogState({
      isOpen: false,
      options: { title: '', message: '' },
      resolve: null
    })
  }

  const handleConfirm = () => {
    if (dialogState.resolve) {
      dialogState.resolve(true)
    }
    setDialogState({
      isOpen: false,
      options: { title: '', message: '' },
      resolve: null
    })
  }

  const handleCancel = () => {
    if (dialogState.resolve) {
      dialogState.resolve(false)
    }
    setDialogState({
      isOpen: false,
      options: { title: '', message: '' },
      resolve: null
    })
  }

  return (
    <PromptDialogContext.Provider value={{ showPrompt, showAlert }}>
      {children}
      <PromptDialog
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={dialogState.options.cancelText ? handleCancel : undefined}
        title={dialogState.options.title}
        message={dialogState.options.message}
        confirmText={dialogState.options.confirmText}
        cancelText={dialogState.options.cancelText}
        variant={dialogState.options.variant}
      />
    </PromptDialogContext.Provider>
  )
}
