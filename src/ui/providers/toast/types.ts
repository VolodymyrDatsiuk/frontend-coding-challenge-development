export type ToastType = 'success' | 'error';
export type ToastInput = {
  type: ToastType;
  body: React.ReactNode;
};
export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};
