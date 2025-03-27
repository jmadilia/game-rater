"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Define types for user profile data
export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  discord_handle?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter_handle?: string;
  discord_handle?: string;
}

// Get the current user's profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    return null;
  }

  // Get the user's profile from the profiles table
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
}

// Get a user profile by ID
export async function getUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
}

// Get a user profile by username
export async function getUserProfileByUsername(
  username: string
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
}

// Create or update a user profile
export async function updateUserProfile(
  profile: UserProfileUpdate
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Authentication error. Please sign in.",
    };
  }

  // Check if username is already taken (if updating username)
  if (profile.username) {
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", profile.username)
      .single();

    if (existingUser && existingUser.id !== user.id) {
      return {
        success: false,
        error: "Username is already taken.",
      };
    }
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: "Failed to update profile. Please try again.",
      };
    }
  } else {
    // Create new profile
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating user profile:", error);
      return {
        success: false,
        error: "Failed to create profile. Please try again.",
      };
    }
  }

  revalidatePath("/profile");
  if (profile.username) {
    revalidatePath(`/profile/${profile.username}`);
  }
  return { success: true };
}

// Delete a user profile
export async function deleteUserProfile(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Authentication error. Please sign in.",
    };
  }

  // Delete the user profile
  const { error } = await supabase.from("profiles").delete().eq("id", user.id);

  if (error) {
    console.error("Error deleting user profile:", error);
    return {
      success: false,
      error: "Failed to delete profile. Please try again.",
    };
  }

  // Also sign out the user
  await supabase.auth.signOut();

  revalidatePath("/");
  return { success: true };
}

// Get user's game reviews
export async function getUserReviews(userId: string): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }

  return data || [];
}

// Get user's game completion status
export async function getUserGameCompletion(userId: string): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("game_completion")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user game completion:", error);
    return [];
  }

  return data || [];
}

// Get user's followers
export async function getUserFollowers(userId: string): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_followers")
    .select("follower_id, profiles!user_followers_follower_id_fkey(*)")
    .eq("followed_id", userId);

  if (error) {
    console.error("Error fetching user followers:", error);
    return [];
  }

  return data || [];
}

// Get users that the user is following
export async function getUserFollowing(userId: string): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_followers")
    .select("followed_id, profiles!user_followers_followed_id_fkey(*)")
    .eq("follower_id", userId);

  if (error) {
    console.error("Error fetching user following:", error);
    return [];
  }

  return data || [];
}

// Follow a user
export async function followUser(
  userIdToFollow: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Authentication error. Please sign in.",
    };
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from("user_followers")
    .select("*")
    .eq("follower_id", user.id)
    .eq("followed_id", userIdToFollow)
    .single();

  if (existingFollow) {
    return {
      success: false,
      error: "You are already following this user.",
    };
  }

  // Create the follow relationship
  const { error } = await supabase.from("user_followers").insert({
    follower_id: user.id,
    followed_id: userIdToFollow,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error following user:", error);
    return {
      success: false,
      error: "Failed to follow user. Please try again.",
    };
  }

  revalidatePath("/profile");
  return { success: true };
}

// Unfollow a user
export async function unfollowUser(
  userIdToUnfollow: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Authentication error. Please sign in.",
    };
  }

  // Delete the follow relationship
  const { error } = await supabase
    .from("user_followers")
    .delete()
    .eq("follower_id", user.id)
    .eq("followed_id", userIdToUnfollow);

  if (error) {
    console.error("Error unfollowing user:", error);
    return {
      success: false,
      error: "Failed to unfollow user. Please try again.",
    };
  }

  revalidatePath("/profile");
  return { success: true };
}
