"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateUserProfile,
  type UserProfile,
  type UserProfileUpdate,
} from "@/lib/user/user";
import AvatarUpload from "@/components/avatar-upload";

interface ProfileFormProps {
  profile: UserProfile | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfileUpdate>({
    username: profile?.username || "",
    avatar_url: profile?.avatar_url || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    website: profile?.website || "",
    twitter_handle: profile?.twitter_handle || "",
    discord_handle: profile?.discord_handle || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateUserProfile(formData);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        router.refresh();
      } else {
        setError(result.error || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-retro-primary dark:text-dark-text">
          Edit Profile
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-100 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <AvatarUpload
            url={formData.avatar_url || null}
            onUpload={handleAvatarUpload}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-retro-text dark:text-dark-text">
              Username*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-retro-text dark:text-dark-text">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-retro-text dark:text-dark-text">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-retro-text dark:text-dark-text">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="twitter_handle"
              className="block text-sm font-medium text-retro-text dark:text-dark-text">
              Twitter Handle
            </label>
            <input
              type="text"
              id="twitter_handle"
              name="twitter_handle"
              value={formData.twitter_handle || ""}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            />
          </div>

          <div>
            <label
              htmlFor="discord_handle"
              className="block text-sm font-medium text-retro-text dark:text-dark-text">
              Discord Handle
            </label>
            <input
              type="text"
              id="discord_handle"
              name="discord_handle"
              value={formData.discord_handle || ""}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-3 py-2 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-4 py-2 rounded-md transition duration-150 ease-in-out">
            {isLoading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}
