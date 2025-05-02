import { getCurrentUserProfile, getUserReviews } from "@/lib/user/user";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReviewList from "@/components/review-list";

export default async function UserReviewsPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    // If not signed in, redirect to sign-in page
    redirect("/sign-in");
  }

  const reviews = await getUserReviews(profile.id);

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6 flex flex-col items-center">
      <div>
        <Link
          href="/profile"
          className="flex items-center text-retro-primary dark:text-dark-accent hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-retro-primary dark:text-dark-text">
        Your Reviews
      </h1>
      <p className="text-retro-secondary dark:text-dark-secondary mb-8">
        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
      </p>

      <ReviewList
        reviews={reviews}
        showUserInfo={false}
        emptyMessage="You haven't written any reviews yet."
        canEdit={true}
      />
    </div>
  );
}
