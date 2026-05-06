import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className={cn("z-50 w-full max-w-lg rounded-xl bg-card p-6 shadow-lg animate-in fade-in zoom-in-95", className)}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
