"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ReviewForm from "@/components/review-form";
import type { Review } from "@/lib/review/review";

interface ReviewModalProps {
  gameId: number;
  gameName: string;
  existingReview?: Review | null;
  onClose: () => void;
}

export default function ReviewModal({
  gameId,
  gameName,
  existingReview,
  onClose,
}: ReviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-retro-text dark:text-dark-text hover:text-retro-primary dark:hover:text-dark-accent">
            <X className="h-6 w-6" />
          </button>
          <ReviewForm
            gameId={gameId}
            gameName={gameName}
            existingReview={existingReview}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
