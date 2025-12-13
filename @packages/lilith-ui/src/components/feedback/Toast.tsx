import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import styled, { css } from 'styled-components'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type: ToastType, duration?: number) => string
  removeToast: (id: string) => void
  updateToast: (id: string, message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const ToastContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  z-index: ${props => props.theme.zIndex?.toast || 10000};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  pointer-events: none;

  @media (max-width: ${props => props.theme.breakpoints?.sm || '640px'}) {
    left: ${props => props.theme.spacing.sm};
    right: ${props => props.theme.spacing.sm};
  }
`

const ToastItem = styled.div<{ $type: ToastType }>`
  background: ${props => props.theme.colors.surface || props.theme.colors.background};
  border: 1px solid ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success
      case 'error': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      case 'info': return props.theme.colors.primary
      case 'loading': return props.theme.colors.border
      default: return props.theme.colors.border
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success
      case 'error': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      case 'info': return props.theme.colors.primary
      case 'loading': return props.theme.colors.accent || props.theme.colors.secondary
      default: return props.theme.colors.primary
    }
  }};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.md};
  min-width: 300px;
  max-width: 500px;
  pointer-events: auto;
  cursor: pointer;
  animation: slideInRight 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Cyberpunk neon glow based on type */
  ${props => props.theme.extensions?.cyberpunk && css`
    box-shadow: ${() => {
      switch (props.$type) {
        case 'success':
          return props.theme.extensions?.cyberpunk?.neonGlow?.green || `0 0 10px ${props.theme.colors.success}`
        case 'error':
          return `0 0 10px ${props.theme.colors.error}`
        case 'warning':
          return `0 0 10px ${props.theme.colors.warning}`
        case 'info':
          return props.theme.extensions?.cyberpunk?.neonGlow?.cyan || `0 0 10px ${props.theme.colors.primary}`
        case 'loading':
          return props.theme.extensions?.cyberpunk?.neonGlow?.magenta || `0 0 10px ${props.theme.colors.accent || props.theme.colors.secondary}`
        default:
          return props.theme.extensions?.cyberpunk?.neonGlow?.cyan || `0 0 10px ${props.theme.colors.primary}`
      }
    }},
    ${props.theme.shadows.lg};
  `}
`

const ToastIcon = styled.span`
  font-size: ${props => props.theme.typography.fontSize.lg};
  flex-shrink: 0;
`

const ToastMessage = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  flex: 1;
`

/**
 * Toast context provider for app-wide toast notification management.
 * Automatically renders ToastContainer and provides imperative toast API via useToast hook.
 *
 * @param props - ToastProvider props
 * @param props.children - Child components that can access toast context
 * @returns A context provider with toast state management
 *
 * @example
 * // Setup: Wrap app with ToastProvider
 * import { ToastProvider } from '@transftw/lilith-ui';
 *
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 *
 * @example
 * // Show different toast types
 * import { useToast } from '@transftw/lilith-ui';
 *
 * function SaveButton() {
 *   const { showToast } = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showToast('Changes saved successfully', 'success');
 *     } catch (error) {
 *       showToast('Failed to save changes', 'error');
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
    const id = Date.now().toString()
    const toast: Toast = { id, message, type, duration }

    setToasts(prev => [...prev, toast])

    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [removeToast])

  const updateToast = useCallback((id: string, message: string, type: ToastType) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, message, type } : toast
    ))

    // Auto-remove after update if not loading
    if (type !== 'loading') {
      setTimeout(() => {
        removeToast(id)
      }, 3000)
    }
  }, [removeToast])

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      case 'loading': return '⏳'
      default: return 'ℹ️'
    }
  }

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, updateToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            $type={toast.type}
            onClick={() => removeToast(toast.id)}
          >
            <ToastIcon>{getToastIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

/**
 * Hook for accessing toast notification API from any component within ToastProvider.
 * Provides methods to show, update, and remove toast notifications.
 *
 * @returns Toast context with showToast, updateToast, removeToast, and toasts array
 * @throws Error if used outside ToastProvider
 *
 * @example
 * // Basic toast notifications
 * import { useToast } from '@transftw/lilith-ui';
 *
 * function MyComponent() {
 *   const { showToast } = useToast();
 *
 *   return (
 *     <div>
 *       <button onClick={() => showToast('Success!', 'success')}>Success</button>
 *       <button onClick={() => showToast('Error!', 'error')}>Error</button>
 *       <button onClick={() => showToast('Warning!', 'warning')}>Warning</button>
 *       <button onClick={() => showToast('Info', 'info')}>Info</button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Progressive loading indicator
 * import { useToast } from '@transftw/lilith-ui';
 *
 * function DataLoader() {
 *   const { showToast, updateToast } = useToast();
 *
 *   const loadData = async () => {
 *     const id = showToast('Fetching data...', 'loading');
 *
 *     const data = await fetch('/api/data').then(r => r.json());
 *     updateToast(id, `Loaded ${data.length} items`, 'success');
 *   };
 *
 *   return <button onClick={loadData}>Load</button>;
 * }
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
