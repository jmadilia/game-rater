"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { searchGamesAction } from "@/lib/igdb/actions";

interface Game {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
}

export default function GameSearch() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchGamesAction(query);
      setGames(result);
    } catch (err) {
      console.error("Error searching games:", err);
      setError("An error occurred while fetching games. Please try again.");
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToLibrary = async (game: Game) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please sign in to add games to your library");
      return;
    }

    const { error } = await supabase.from("game_completion").insert({
      user_id: user.id,
      game_id: game.id,
      status: "Playing",
    });

    if (error) {
      console.error("Error adding game to library:", error);
      alert("Error adding game to library");
    } else {
      alert("Game added to library");
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="flex space-x-2 w-full max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games"
          className="w-3/4 border-2 border-retro-accent dark:border-dark-accent rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary bg-white dark:bg-dark-background text-retro-text dark:text-dark-text"
        />
        <button
          onClick={handleSearch}
          className="bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-6 py-2 rounded-md transition duration-150 ease-in-out"
          disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && (
        <p className="text-retro-orange dark:text-dark-orange">{error}</p>
      )}
      {games.length > 0 ? (
        <div className="space-y-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:space-y-0 w-full">
          {games.map((game) => (
            <div
              key={game.id}
              className="cursor-pointer flex items-center sm:flex-col sm:items-center gap-4 sm:gap-0 p-4 border rounded shadow bg-white dark:bg-dark-secondary border-retro-accent dark:border-dark-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition max-w-sm mx-auto sm:max-w-none">
              {game.cover?.url ? (
                <img
                  src={game.cover.url.replace("t_thumb", "t_720p")}
                  alt={game.name}
                  className="w-16 h-16 sm:w-full sm:h-auto object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 sm:w-full sm:h-32 flex items-center justify-center bg-gray-200 rounded">
                  <span className="text-sm text-gray-500">No Image</span>
                </div>
              )}
              <span className="text-sm font-medium sm:mt-2 sm:text-center">
                {game.name}
              </span>
              <button
                onClick={() => addToLibrary(game)}
                className="ml-auto sm:ml-0 bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out min-w-[140px] text-center">
                Add to Library
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="items-center text-retro-secondary dark:text-dark-secondary">
            No games found. Try a different search term.
          </p>
        )
      )}
    </div>
  );
}
