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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-lg border border-retro-accent dark:border-dark-accent">
              {game.cover && (
                <img
                  src={game.cover.url || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
              )}
              <h3 className="font-semibold text-lg mb-2 text-retro-primary dark:text-dark-text">
                {game.name}
              </h3>
              <button
                onClick={() => addToLibrary(game)}
                className="bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out">
                Add to Library
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <p className="text-retro-secondary dark:text-dark-secondary">
            No games found. Try a different search term.
          </p>
        )
      )}
    </div>
  );
}
