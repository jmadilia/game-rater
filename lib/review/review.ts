"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getGameDetails } from "@/lib/game/game";

export interface Review {
  id: string;
  user_id: string;
  game_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUserAndGame extends Review {
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  game_name?: string;
  game_cover?: string;
}

// Create or update a review
export async function createOrUpdateReview(
  gameId: number,
  rating: number,
  reviewText: string
): Promise<{ success: boolean; error?: string; reviewId?: string }> {
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

  // Check if the user has already reviewed this game
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("game_id", gameId)
    .single();

  if (existingReview) {
    // Update existing review
    const { error } = await supabase
      .from("reviews")
      .update({
        rating,
        review_text: reviewText || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingReview.id);

    if (error) {
      console.error("Error updating review:", error);
      return {
        success: false,
        error: "Failed to update review. Please try again.",
      };
    }

    revalidatePath(`/games/${gameId}`);
    revalidatePath("/reviews");
    revalidatePath("/profile");
    return { success: true, reviewId: existingReview.id };
  } else {
    // Create new review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        game_id: gameId,
        rating,
        review_text: reviewText || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error creating review:", error);
      return {
        success: false,
        error: "Failed to create review. Please try again.",
      };
    }

    revalidatePath(`/games/${gameId}`);
    revalidatePath("/reviews");
    revalidatePath("/profile");
    return { success: true, reviewId: data[0].id };
  }
}

// Delete a review
export async function deleteReview(
  reviewId: string
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

  // Get the review to find the game ID for path revalidation
  const { data: review } = await supabase
    .from("reviews")
    .select("game_id")
    .eq("id", reviewId)
    .single();

  // Delete the review
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: "Failed to delete review. Please try again.",
    };
  }

  if (review) {
    revalidatePath(`/games/${review.game_id}`);
  }
  revalidatePath("/reviews");
  revalidatePath("/profile");
  return { success: true };
}

// Get a review by ID
export async function getReviewById(reviewId: string): Promise<Review | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .single();

  if (error) {
    console.error("Error fetching review:", error);
    return null;
  }

  return data as Review;
}

// Get a user's review for a specific game
export async function getUserReviewForGame(
  userId: string,
  gameId: number
): Promise<Review | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error fetching user review for game:", error);
    }
    return null;
  }

  return data as Review;
}

// Get all reviews for a game
export async function getGameReviews(
  gameId: number
): Promise<ReviewWithUserAndGame[]> {
  const supabase = await createClient();

  // 1. Fetch reviews for the game
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false });

  if (error || !reviews) {
    console.error("Error fetching game reviews:", error);
    return [];
  }

  // 2. Get unique user_ids
  const userIds = Array.from(new Set(reviews.map((r) => r.user_id)));

  // 3. Fetch profiles for those user_ids
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", userIds);

  if (profilesError || !profiles) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  // 4. Map profiles by id for quick lookup
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  // 5. Combine reviews with their user profile
  return reviews.map((review) => ({
    ...review,
    profiles: {
      username: profileMap.get(review.user_id)?.username ?? "",
      avatar_url: profileMap.get(review.user_id)?.avatar_url ?? null,
    },
  })) as ReviewWithUserAndGame[];
}

// Get recent reviews (across all games and users)
export async function getRecentReviews(
  limit = 10
): Promise<ReviewWithUserAndGame[]> {
  const supabase = await createClient();

  // 1. Fetch recent reviews
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !reviews) {
    console.error("Error fetching recent reviews:", error);
    return [];
  }

  // 2. Get unique user_ids
  const userIds = Array.from(new Set(reviews.map((r) => r.user_id)));

  // 3. Fetch profiles for those user_ids
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", userIds);

  if (profilesError || !profiles) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  // 4. Map profiles by id for quick lookup
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  // 5. Get unique game IDs
  const gameIds = Array.from(new Set(reviews.map((review) => review.game_id)));

  // 6. Fetch game details in parallel
  const gameDetailsPromises = gameIds.map((id) => getGameDetails(id));
  const gameDetailsArray = await Promise.all(gameDetailsPromises);

  // 7. Create a map of game ID to game details
  const gameDetailsMap = new Map();
  gameDetailsArray.forEach((game) => {
    if (game) {
      gameDetailsMap.set(game.id, game);
    }
  });

  // 8. Combine reviews with their user profile and game details
  return reviews.map((review) => {
    const game = gameDetailsMap.get(review.game_id);
    return {
      ...review,
      profiles: {
        username: profileMap.get(review.user_id)?.username ?? "",
        avatar_url: profileMap.get(review.user_id)?.avatar_url ?? null,
      },
      game_name: game?.name,
      game_cover: game?.cover?.url,
    };
  }) as ReviewWithUserAndGame[];
}

// Calculate average rating for a game
export async function getGameAverageRating(
  gameId: number
): Promise<{ average: number; count: number } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("game_id", gameId);

  if (error) {
    console.error("Error fetching game ratings:", error);
    return null;
  }

  if (data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / data.length;

  return {
    average: Number.parseFloat(average.toFixed(1)),
    count: data.length,
  };
}
