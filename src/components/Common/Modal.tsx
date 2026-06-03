import React from 'react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode;
  primaryActionText: string;
  primaryActionOnClick: () => void;
  primaryActionColor?: 'indigo' | 'rose' | 'emerald';
  secondaryActionText?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  primaryActionText,
  primaryActionOnClick,
  primaryActionColor = 'indigo',
  secondaryActionText = 'Cancel'
}: ModalProps) {
  if (!isOpen) return null;

  const colorClasses = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    rose: 'bg-rose-600 hover:bg-rose-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="text-gray-500 font-medium mb-6">
          {description}
        </div>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {secondaryActionText}
          </button>
          <button
            onClick={primaryActionOnClick}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-white transition-colors cursor-pointer",
              colorClasses[primaryActionColor]
            )}
          >
            {primaryActionText}
          </button>
        </div>
      </div>
    </div>
  );
}
