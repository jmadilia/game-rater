"use client";

import { useState } from "react";
import { followUser, unfollowUser } from "@/lib/user/user";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export default function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleFollow = async () => {
    setIsLoading(true);

    try {
      if (isFollowing) {
        const result = await unfollowUser(userId);
        if (result.success) {
          setIsFollowing(false);
        }
      } else {
        const result = await followUser(userId);
        if (result.success) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md transition duration-150 ease-in-out ${
        isFollowing
          ? "bg-white dark:bg-dark-background text-retro-primary dark:text-dark-text border-2 border-retro-primary dark:border-dark-accent"
          : "bg-retro-primary dark:bg-dark-primary text-white"
      }`}>
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
