"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import ReviewModal from "@/components/review-modal";
import type { Review } from "@/lib/review/review";

interface WriteReviewButtonProps {
  gameId: number;
  gameName: string;
  existingReview?: Review | null;
  variant?: "primary" | "secondary" | "outline";
}

export default function WriteReviewButton({
  gameId,
  gameName,
  existingReview,
  variant = "primary",
}: WriteReviewButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonClasses = {
    primary:
      "bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white",
    secondary:
      "bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white",
    outline:
      "bg-transparent border-2 border-retro-primary dark:border-dark-primary text-retro-primary dark:text-dark-text hover:bg-retro-primary/10 dark:hover:bg-dark-primary/10",
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${buttonClasses[variant]} transition duration-150 ease-in-out`}>
        <Edit className="h-4 w-4" />
        <span>{existingReview ? "Edit Review" : "Write Review"}</span>
      </button>

      {isModalOpen && (
        <ReviewModal
          gameId={gameId}
          gameName={gameName}
          existingReview={existingReview}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
