import { createContext, useContext } from 'react';
import { ToastType } from './types';
import { ToastContainer } from './ToastContainer';

export const TOAST_EVENT_NAME = 'onToast';

interface ToastProps {
  renderToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastProps | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const renderToast = (type: ToastType, message: string) => {
    const event = new CustomEvent(TOAST_EVENT_NAME, { detail: { type, message } });

    document.dispatchEvent(event);
  };

  return (
    <ToastContext.Provider
      value={{
        renderToast,
      }}>
      <ToastContainer />

      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
