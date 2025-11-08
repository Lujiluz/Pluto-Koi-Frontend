"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "react-feather";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Toast Container Component
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// Individual Toast Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const { type, title, message, id } = toast;

  const handleClose = () => {
    if (toast.onClose) toast.onClose();
    onRemove(id);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-500" />;
      case "error":
        return <XCircle size={20} className="text-red-500" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case "info":
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-200";
      case "error":
        return "border-red-200";
      case "warning":
        return "border-yellow-200";
      case "info":
        return "border-blue-200";
      default:
        return "border-gray-200";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-white";
    }
  };

  return (
    <div
      className={`
        pointer-events-auto
        max-w-sm w-full
        ${getBackgroundColor()} ${getBorderColor()}
        border rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            {title && <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>}
            <p className="text-sm text-gray-700">{message}</p>
          </div>

          <button onClick={handleClose} className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for common toast types
export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    const { showToast } = useToast();
    showToast({ type: "success", message, title, duration });
  },

  error: (message: string, title?: string, duration?: number) => {
    const { showToast } = useToast();
    showToast({ type: "error", message, title, duration });
  },

  warning: (message: string, title?: string, duration?: number) => {
    const { showToast } = useToast();
    showToast({ type: "warning", message, title, duration });
  },

  info: (message: string, title?: string, duration?: number) => {
    const { showToast } = useToast();
    showToast({ type: "info", message, title, duration });
  },
};
