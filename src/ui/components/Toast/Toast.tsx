import React, { ReactNode } from 'react';
import { ToastType } from '@/providers/toast/types';

interface ToastProps {
  type: ToastType;
  children: ReactNode;
}

const toastTypesClassNames: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
};

export function Toast({ type, children }: ToastProps) {
  return (
    <div className={`animate-toast max-w-xs rounded-lg p-4 text-white ${toastTypesClassNames[type]}`}>
      {/* // TODO add icon for each type to improve accessibility */}
      {children}
    </div>
  );
}
