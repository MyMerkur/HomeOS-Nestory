import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Toast, type ToastVariant } from './Toast';

type ToastState = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ShowToastInput = {
  message: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (input: ShowToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 2500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback(({ message, variant = 'info' }: ShowToastInput) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    nextId.current += 1;
    setToast({ id: nextId.current, message, variant });
    timeoutRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? <Toast key={toast.id} message={toast.message} variant={toast.variant} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
