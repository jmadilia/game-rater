"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { searchGamesAction } from "@/lib/igdb/actions";
import AddToCollectionButton from "@/components/add-to-collection-button";
import { Loader2 } from "lucide-react";

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
    if (!query.trim()) return;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="flex space-x-2 w-full max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for games"
          className="w-3/4 border-2 border-retro-accent dark:border-dark-accent rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary bg-white dark:bg-dark-background text-retro-text dark:text-dark-text"
        />
        <button
          onClick={handleSearch}
          className="bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-6 py-2 rounded-md transition duration-150 ease-in-out"
          disabled={isLoading || !query.trim()}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            "Search"
          )}
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
              className="cursor-pointer flex flex-col items-center h-full sm:flex-col sm:items-center gap-4 sm:gap-0 p-4 border rounded shadow bg-white dark:bg-dark-secondary border-retro-accent dark:border-dark-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition max-w-sm mx-auto sm:max-w-none">
              {game.cover ? (
                <img
                  src={game.cover.url.replace("t_thumb", "t_720p")}
                  alt={game.name}
                  className="w-16 h-24 sm:w-full sm:h-64 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-24 sm:w-full sm:h-64 flex items-center justify-center bg-gray-200 rounded">
                  <span className="text-gray-500 dark:text-gray-400">
                    No image
                  </span>
                </div>
              )}
              <h3 className="text-lg mb-4 text-retro-primary dark:text-dark-text sm:mt-2 sm:text-center">
                {game.name}
              </h3>
              <div className="mt-auto w-full flex justify-center">
                <AddToCollectionButton gameId={game.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading &&
        query.trim() && (
          <p className="items-center text-retro-secondary dark:text-dark-secondary">
            No games found. Try a different search term.
          </p>
        )
      )}
    </div>
  );
}
