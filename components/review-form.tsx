"use client";

import type React from "react";

import { useState } from "react";
import {
  createOrUpdateReview,
  deleteReview,
  type Review,
} from "@/lib/review/review";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { on } from "events";

interface ReviewFormProps {
  gameId: number;
  gameName: string;
  existingReview?: Review | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  gameId,
  gameName,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(
    existingReview?.review_text || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createOrUpdateReview(gameId, rating, reviewText);

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh(); // Refresh the page to show the updated review
        }
      } else {
        setError(result.error || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !existingReview ||
      !confirm("Are you sure you want to delete this review?")
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteReview(existingReview.id);

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
        }
      } else {
        setError(result.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-retro-primary dark:text-dark-text">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h2>
      <h3 className="text-lg font-medium mb-4 text-retro-secondary dark:text-dark-secondary">
        {gameName}
      </h3>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-retro-text dark:text-dark-text mb-2">
            Your Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none">
                <Star
                  className={`h-8 w-8 ${
                    (hoverRating ? star <= hoverRating : star <= rating)
                      ? "text-retro-orange dark:text-dark-orange fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="reviewText"
            className="block text-sm font-medium text-retro-text dark:text-dark-text mb-2">
            Your Review
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            className="w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            placeholder="Share your thoughts about this game..."
          />
        </div>

        <div className="flex justify-between">
          <div>
            {existingReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 sm:text-base sm:px-4 sm:py-2 rounded-md transition duration-150 ease-in-out mr-4">
                {isDeleting ? "Deleting..." : "Delete Review"}
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting || isDeleting}
                className="text-xs px-2 py-1 sm:text-base sm:px-4 sm:py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-retro-text dark:text-dark-text rounded-md transition duration-150 ease-in-out">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="text-xs px-2 py-1 sm:text-base sm:px-4 sm:py-2 bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white rounded-md transition duration-150 ease-in-out">
              {isSubmitting
                ? "Submitting..."
                : existingReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
