"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type GameStatus =
  | "Playing"
  | "Beaten"
  | "Completed"
  | "Suspended"
  | "Abandoned";

export interface GameCompletion {
  id: string;
  user_id: string;
  game_id: number;
  status: GameStatus;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: number;
  name: string;
  cover?: { url: string };
}

// Add a game to the user's collection
export async function addGameToCollection(
  gameId: number,
  status: GameStatus
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

  // Check if the game is already in the user's collection
  const { data: existingGame } = await supabase
    .from("game_completion")
    .select("id")
    .eq("user_id", user?.id)
    .eq("game_id", gameId)
    .single();

  if (existingGame) {
    // Update existing entry
    const { error } = await supabase
      .from("game_completion")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", existingGame.id);
    if (error) {
      return {
        success: false,
        error: "Failed to update game status. Please try again.",
      };
    }
  } else {
    const { error } = await supabase.from("game_completion").insert({
      user_id: user?.id,
      game_id: gameId,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return {
        success: false,
        error: "Failed to add game to collection. Please try again.",
      };
    }
  }

  revalidatePath("/collection");
  revalidatePath("/profile");
  return { success: true };
}

// Update a game's status in the collection
export async function updateGameStatus(
  gameCompletionId: string,
  status: GameStatus
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

  // Update the game status
  const { error } = await supabase
    .from("game_completion")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", gameCompletionId)
    .eq("user_id", user.id); // Ensure the user owns this entry

  if (error) {
    console.error("Error updating game status:", error);
    return {
      success: false,
      error: "Failed to update game status. Please try again.",
    };
  }

  revalidatePath("/collection");
  revalidatePath("/profile");
  return { success: true };
}

// Remove a game from the collection
export async function removeGameFromCollection(
  gameCompletionId: string
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

  // Delete the game from the collection
  const { error } = await supabase
    .from("game_completion")
    .delete()
    .eq("id", gameCompletionId)
    .eq("user_id", user.id); // Ensure the user owns this entry

  if (error) {
    console.error("Error removing game from collection:", error);
    return {
      success: false,
      error: "Failed to remove game from collection. Please try again.",
    };
  }

  revalidatePath("/collection");
  revalidatePath("/profile");
  return { success: true };
}

// Get all games in the user's collection
export async function getUserGameCollection(userId: string): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("game_completion")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching user game collection:", error);
    return [];
  }

  return data || [];
}

// Get games by status
export async function getUserGamesByStatus(
  userId: string,
  status: GameStatus
): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("game_completion")
    .select("*")
    .eq("user_id", userId)
    .eq("status", status)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error(`Error fetching ${status} games:`, error);
    return [];
  }

  return data || [];
}

// Get game details from IGDB
export async function getGameDetails(gameId: number): Promise<Game | null> {
  try {
    const token = await getTwitchAccessToken();

    const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields name,cover.url; where id = ${gameId};`,
    });

    if (!igdbResponse.ok) {
      const errorData = await igdbResponse.json();
      console.error("IGDB API error:", errorData);
      throw new Error(`IGDB API error: ${igdbResponse.statusText}`);
    }

    const games = await igdbResponse.json();

    if (Array.isArray(games) && games.length > 0) {
      return games[0];
    } else {
      console.error("Game not found:", gameId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
}

// Helper function to get Twitch access token
let accessToken: string | null = null;
let tokenExpiration = 0;

async function getTwitchAccessToken() {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get Twitch access token: ${response.statusText}`
    );
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiration = Date.now() + data.expires_in * 1000;

  return accessToken;
}

// Get multiple game details from IGDB
export async function getMultipleGameDetails(
  gameIds: number[]
): Promise<Record<number, Game>> {
  if (gameIds.length === 0) return {};

  try {
    const token = await getTwitchAccessToken();

    const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: `fields name,cover.url; where id = (${gameIds.join(",")});`,
    });

    if (!igdbResponse.ok) {
      const errorData = await igdbResponse.json();
      console.error("IGDB API error:", errorData);
      throw new Error(`IGDB API error: ${igdbResponse.statusText}`);
    }

    const games = await igdbResponse.json();

    if (Array.isArray(games)) {
      // Create a map of game ID to game details
      const gameMap: Record<number, Game> = {};
      games.forEach((game) => {
        gameMap[game.id] = game;
      });
      return gameMap;
    } else {
      console.error("Unexpected response format from IGDB:", games);
      return {};
    }
  } catch (error) {
    console.error("Error fetching multiple game details:", error);
    return {};
  }
}

// Check if a game is already in the user's collection
export async function isGameInUserCollection(gameId: number): Promise<boolean> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return false;
  }

  const { data: existingGame, error } = await supabase
    .from("game_completion")
    .select("id")
    .eq("user_id", user.id)
    .eq("game_id", gameId)
    .single();

  return !!existingGame;
}
