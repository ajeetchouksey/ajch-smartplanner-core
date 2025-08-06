import React, { useState, useEffect } from "react";
import './NotificationToasts.css';

export enum ToastType {
  Success = 'success',
  Info = 'info',
  Error = 'error',
  Warning = 'warning',
  Default = 'default'
}

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export const NotificationToasts: React.FC<{ toasts: Toast[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  useEffect(() => {
    const timers = toasts.map(toast =>
      setTimeout(() => removeToast(toast.id), 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="ai-toasts-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`ai-toast ai-toast-${toast.type}`}>
          <span className="ai-toast-icon">{toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : toast.type === "info" ? "💡" : "⚠️"}</span>
          <span className="ai-toast-msg">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

