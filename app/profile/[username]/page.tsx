import {
  getUserProfileByUsername,
  getUserReviews,
  getUserGameCompletion,
  getUserFollowers,
  getUserFollowing,
} from "@/lib/user/user";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Twitter,
  MessageSquare,
  Star,
  Users,
  Trophy,
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import FollowButton from "@/components/follow-button";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getUserProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const [reviews, gameCompletions, followers, following] = await Promise.all([
    getUserReviews(profile.id),
    getUserGameCompletion(profile.id),
    getUserFollowers(profile.id),
    getUserFollowing(profile.id),
  ]);

  // Check if current user is viewing their own profile
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  // Check if current user is following this profile
  let isFollowing = false;
  if (user) {
    const followingData = await getUserFollowing(user.id);
    isFollowing = followingData.some((f) => f.followed_id === profile.id);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="bg-retro-primary dark:bg-dark-primary h-32 relative">
          {/* Profile Avatar */}
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="h-24 w-24 rounded-full border-4 border-white dark:border-dark-background overflow-hidden bg-retro-accent dark:bg-dark-accent">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && user && (
            <div className="absolute bottom-0 right-8 transform translate-y-1/2">
              <FollowButton userId={profile.id} isFollowing={isFollowing} />
            </div>
          )}

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <div className="absolute bottom-0 right-8 transform translate-y-1/2">
              <Link
                href="/profile"
                className="bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white px-4 py-2 rounded-md">
                Edit Profile
              </Link>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-8 pb-8">
          <h1 className="text-2xl font-bold text-retro-primary dark:text-dark-text">
            {profile.username}
          </h1>

          {/* User Stats */}
          <div className="flex space-x-6 mt-4 text-retro-secondary-light dark:text-dark-secondary-light">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-1" />
              <span>{reviews.length} Reviews</span>
            </div>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-1" />
              <span>{gameCompletions.length} Games</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-1" />
              <span>{followers.length} Followers</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-1" />
              <span>Following {following.length}</span>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6">
              <p className="text-retro-text dark:text-dark-text whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 space-y-2">
            {profile.location && (
              <div className="flex items-center text-retro-secondary dark:text-dark-secondary">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center text-retro-secondary dark:text-dark-secondary">
                <Globe className="h-5 w-5 mr-2" />
                <a
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-retro-primary dark:text-dark-accent hover:underline">
                  {profile.website}
                </a>
              </div>
            )}

            {profile.twitter_handle && (
              <div className="flex items-center text-retro-secondary dark:text-dark-secondary">
                <Twitter className="h-5 w-5 mr-2" />
                <a
                  href={`https://twitter.com/${profile.twitter_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-retro-primary dark:text-dark-accent hover:underline">
                  @{profile.twitter_handle}
                </a>
              </div>
            )}

            {profile.discord_handle && (
              <div className="flex items-center text-retro-secondary dark:text-dark-secondary">
                <FaDiscord className="h-5 w-5 mr-2" />
                <span>{profile.discord_handle}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Reviews */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-retro-primary dark:text-dark-text">
            Recent Reviews
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="border-b border-retro-accent dark:border-dark-accent pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-retro-primary dark:text-dark-text">
                      Game #{review.game_id}
                    </h3>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-retro-orange dark:text-dark-orange"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                  {review.review_text && (
                    <p className="mt-2 text-retro-text dark:text-dark-text line-clamp-3">
                      {review.review_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-retro-secondary-light dark:text-dark-secondary-light">
              No reviews yet.
            </p>
          )}

          {reviews.length > 5 && (
            <div className="mt-4">
              <Link
                href={`/profile/${username}/reviews`}
                className="text-retro-primary dark:text-dark-accent hover:underline">
                View all reviews
              </Link>
            </div>
          )}
        </div>

        {/* Games Collection */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-retro-primary dark:text-dark-text">
            Games Collection
          </h2>

          {gameCompletions.length > 0 ? (
            <div className="space-y-4">
              {gameCompletions.slice(0, 5).map((completion) => (
                <div
                  key={completion.id}
                  className="border-b border-retro-accent dark:border-dark-accent pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-retro-primary dark:text-dark-text">
                      Game #{completion.game_id}
                    </h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-retro-accent dark:bg-dark-accent text-white">
                      {completion.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-retro-secondary-light dark:text-dark-secondary-light">
              No games in collection yet.
            </p>
          )}

          {gameCompletions.length > 5 && (
            <div className="mt-4">
              <Link
                href={`/profile/${username}/games`}
                className="text-retro-primary dark:text-dark-accent hover:underline">
                View all games
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
