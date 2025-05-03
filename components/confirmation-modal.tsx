"use client";

import { ReactNode } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  confirmButtonClass?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-dark-secondary rounded-lg shadow-lg max-w-md w-full mx-4 z-10"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-retro-primary dark:text-dark-text">
            {title}
          </h3>
          <div className="mb-6 text-retro-text dark:text-dark-text">
            {children}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md transition-colors ${confirmButtonClass}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
