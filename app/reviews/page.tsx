import { getRecentReviews } from "@/lib/review/review";
import ReviewList from "@/components/review-list";
import Link from "next/link";

export default async function ReviewsPage() {
  const reviews = await getRecentReviews(20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2 text-retro-primary dark:text-dark-text">
        Recent Reviews
      </h1>
      <p className="text-retro-secondary dark:text-dark-secondary mb-8">
        See what other gamers are saying about their recent plays.
      </p>

      <ReviewList
        reviews={reviews}
        emptyMessage="No reviews have been written yet. Be the first to review a game!"
      />

      <div className="mt-8 text-center">
        <Link
          href="/games"
          className="inline-block bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-6 py-2 rounded-md transition duration-150 ease-in-out">
          Browse Games to Review
        </Link>
      </div>
    </div>
  );
}
