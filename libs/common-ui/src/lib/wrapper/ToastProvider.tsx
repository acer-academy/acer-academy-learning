import React, { ReactNode, createContext, useContext } from 'react';
import { toast, ToastOptions, ToastPosition } from 'react-toastify';

const toastConfig: ToastOptions = {
  position: 'top-center' as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
  DEFAULT = 'default',
}

interface ToastContextProps {
  displayToast: (message: ReactNode, type: ToastType) => void;
  ToastType: typeof ToastType; // Adding the ToastType enum to the context
}

const ToastContext = createContext<ToastContextProps | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const displayToast = (message: ReactNode, type: ToastType) => {
    let toastFunction;

    switch (type) {
      case ToastType.SUCCESS:
        toastFunction = toast.success;
        break;
      case ToastType.ERROR:
        toastFunction = toast.error;
        break;
      case ToastType.INFO:
        toastFunction = toast.info;
        break;
      case ToastType.WARN:
        toastFunction = toast.warn;
        break;
      case ToastType.DEFAULT:
        toastFunction = toast;
        break;
    }

    toastFunction(message, toastConfig);
  };

  return (
    <ToastContext.Provider value={{ displayToast, ToastType }}>
      {children}
    </ToastContext.Provider>
  );
};
