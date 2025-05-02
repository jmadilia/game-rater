import {
  getUserProfileByUsername,
  getUserReviews,
  getCurrentUserProfile,
} from "@/lib/user/user";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReviewList from "@/components/review-list";

type paramsType = Promise<{ username: string }>;

export default async function UserReviewsPage({
  params,
}: {
  params: paramsType;
}) {
  const username = (await params).username;
  const profile = await getUserProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  // Fetch current user profile
  const currentUser = await getCurrentUserProfile();
  const isOwnProfile = currentUser && currentUser.id === profile.id;

  const reviews = await getUserReviews(profile.id);

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6 flex flex-col items-center">
      <div>
        <Link
          href={`/profile/${username}`}
          className="flex items-center text-retro-primary dark:text-dark-accent hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Profile</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-retro-primary dark:text-dark-text">
        {username === "You" ? "Your Reviews" : `${username}'s Reviews`}
      </h1>
      <p className="text-retro-secondary dark:text-dark-secondary mb-8">
        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
      </p>

      <ReviewList
        reviews={reviews}
        showUserInfo={false}
        emptyMessage={`${username} hasn't written any reviews yet.`}
        canEdit={!!isOwnProfile}
      />
    </div>
  );
}
