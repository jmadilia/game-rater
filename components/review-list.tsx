import type { ReviewWithUserAndGame } from "@/lib/review/review";
import ReviewCard from "@/components/review-card";

interface ReviewListProps {
  reviews: ReviewWithUserAndGame[];
  showGameInfo?: boolean;
  showUserInfo?: boolean;
  emptyMessage?: string;
  canEdit?: boolean;
}

export default function ReviewList({
  reviews,
  showGameInfo = true,
  showUserInfo = true,
  emptyMessage = "No reviews yet.",
  canEdit = false,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 text-center">
        <p className="text-retro-secondary dark:text-dark-secondary">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showGameInfo={showGameInfo}
            showUserInfo={showUserInfo}
            canEdit={canEdit}
          />
        ))}
      </div>
    </div>
  );
}
