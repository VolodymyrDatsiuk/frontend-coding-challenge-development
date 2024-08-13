'use client';

import { Toast } from '@/components/Toast';
import { useEffect, useState } from 'react';
import { Toast as ToastElement } from './types';
import { TOAST_EVENT_NAME } from './toast';

let toastId = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastElement[]>([]);

  useEffect(() => {
    const eventCallback: EventListener = event => {
      const customEvent = event as CustomEvent<ToastElement>;

      // Increment the toastId for a unique key for each toast
      toastId += 1;
      const newToast = { id: toastId, type: customEvent.detail.type, message: customEvent.detail.message };

      setToasts(prevToasts => [...prevToasts, newToast]);

      setTimeout(() => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id));
      }, 3000);
    };

    document.addEventListener(TOAST_EVENT_NAME, eventCallback);

    return () => {
      document.removeEventListener(TOAST_EVENT_NAME, eventCallback);
    };
  }, [toasts]);

  return (
    !!toasts.length && (
      <div className='fixed flex flex-col items-center justify-start w-screen gap-4 p-6 pointer-events-none h-dvh'>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type}>
            {toast.message}
          </Toast>
        ))}
      </div>
    )
  );
}
