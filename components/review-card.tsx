import Link from "next/link";
import { Star } from "lucide-react";
import type { ReviewWithUserAndGame } from "@/lib/review/review";
import WriteReviewButton from "@/components/write-review-button";
import Avatar from "@/components/avatar";

interface ReviewCardProps {
  review: ReviewWithUserAndGame;
  showGameInfo?: boolean;
  showUserInfo?: boolean;
  canEdit?: boolean;
}

export default function ReviewCard({
  review,
  showGameInfo = true,
  showUserInfo = true,
  canEdit = false,
}: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <div className="w-full max-w-2xl md:max-w-xl sm:max-w-md xs:max-w-[95vw] bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden border border-retro-accent dark:border-dark-accent">
      <div className="p-3 flex flex-col gap-2">
        {showUserInfo && (
          <div className="flex items-center space-x-2">
            <Avatar
              url={review.profiles.avatar_url}
              username={review.profiles.username}
              size={40}
            />
            <Link
              href={`/profile/${review.profiles.username}`}
              className="font-medium text-retro-primary dark:text-dark-text hover:underline">
              {review.profiles.username}
            </Link>
          </div>
        )}
        {/* Top row: Game cover and name */}
        <div className="flex items-center gap-3">
          {showGameInfo && review.game_cover && (
            <img
              src={review.game_cover.replace("t_thumb", "t_cover_small")}
              alt={review.game_name}
              className="w-10 h-14 object-cover rounded"
            />
          )}
          {showGameInfo && review.game_name && (
            <Link
              href={`/games/${review.game_id}`}
              className="font-semibold text-retro-primary dark:text-dark-text hover:underline text-base truncate max-w-[180px]">
              {review.game_name}
            </Link>
          )}
        </div>
        {/* Second row: Rating and date */}
        <div className="flex items-center gap-2 ml-0.5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating
                    ? "text-retro-orange dark:text-dark-orange fill-current"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-retro-secondary dark:text-dark-secondary">
            Added:{" "}
            {new Date(review.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        {/* Review text */}
        {review.review_text && (
          <div className="mt-1">
            <p className="text-retro-text dark:text-dark-text whitespace-pre-line text-sm">
              {review.review_text}
            </p>
          </div>
        )}
        {/* Edit Review button */}
        {canEdit && (
          <div className="mt-2 flex gap-2">
            <WriteReviewButton
              gameId={review.game_id}
              gameName={review.game_name || ""}
              existingReview={review}
              variant="outline"
            />
          </div>
        )}
      </div>
    </div>
  );
}
