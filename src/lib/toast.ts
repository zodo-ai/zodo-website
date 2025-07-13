import toast, { ToastOptions } from 'react-hot-toast';

export type ShowToastOptionsI = {
  message: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  visibilityTime?: number;
};

export const showToast = ({
  message,
  description = '',
  type = 'info',
  visibilityTime = 2000,
}: ShowToastOptionsI): void => {
  const options: ToastOptions = {
    duration: visibilityTime,
    position: 'bottom-center',
  };

  if (type === 'success') {
    toast.success(description ? `${message}\n${description}` : message, options);
  } else if (type === 'error') {
    toast.error(description ? `${message}\n${description}` : message, options);
  } else {
    toast(description ? `${message}\n${description}` : message, options);
  }
};