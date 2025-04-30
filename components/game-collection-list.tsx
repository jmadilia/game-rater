"use client";

import { useState } from "react";
import type { GameCompletion, Game, GameStatus } from "@/lib/game/game";
import GameStatusSelect from "./game-status-select";

interface GameCollectionListProps {
  gameCompletions: GameCompletion[];
  gameDetails: Record<number, Game>;
  isOwner?: boolean;
}

export default function GameCollectionList({
  gameCompletions,
  gameDetails,
  isOwner = true,
}: GameCollectionListProps) {
  const [filter, setFilter] = useState<GameStatus | "All">("All");
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const statusOptions: (GameStatus | "All")[] = [
    "All",
    "Playing",
    "Beaten",
    "Completed",
    "Suspended",
    "Abandoned",
  ];

  // Filter gams based on selected status
  const filteredGames = gameCompletions.filter(
    (completion) =>
      !removedIds.has(completion.id) &&
      (filter === "All" || completion.status === filter)
  );

  const handleRemoveGame = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-retro-text dark:text-dark-text font-medium">
            Filter by status:
          </span>
          {/* Dropdown for small screens */}
          <select
            className="sm:hidden px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-retro-text dark:text-dark-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-retro-primary"
            value={filter}
            onChange={(e) => setFilter(e.target.value as GameStatus | "All")}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {/* Button group for larger screens */}
          <div className="hidden sm:flex gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-md ${
                  filter === status
                    ? "bg-retro-primary dark:bg-dark-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-retro-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[420px] w-full">
        {filteredGames.length === 0 ? (
          <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 w-full">
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center w-full sm:col-span-3">
              <p className="text-retro-secondary dark:text-dark-secondary">
                {filter === "All"
                  ? isOwner
                    ? "Your collection is empty. Start by adding some games!"
                    : "This collection is empty."
                  : isOwner
                    ? `You don't have any games with status \"${filter}\".`
                    : `No games with status \"${filter}\".`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 w-full">
            {filteredGames.map((completion) => {
              const game = gameDetails[completion.game_id];
              return (
                <div
                  key={completion.id}
                  className="flex flex-row items-center w-full sm:w-64 sm:flex-col sm:items-center gap-4 sm:gap-0 p-2 sm:p-4 space-y-0 sm:space-y-2 border rounded shadow bg-white dark:bg-dark-secondary border-retro-accent dark:border-dark-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition max-w-full sm:max-w-sm mx-auto sm:mx-auto">
                  {game?.cover ? (
                    <img
                      src={game.cover.url.replace("t_thumb", "t_720p")}
                      alt={game.name}
                      className="w-16 h-24 sm:w-full sm:h-64 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-24 sm:w-full sm:h-64 flex items-center justify-center bg-gray-200 rounded">
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <h3 className="text-lg mb-2 text-retro-primary dark:text-dark-text text-left sm:mt-2 sm:text-center">
                      {game?.name || `Game #${completion.game_id}`}
                    </h3>
                    <div className="flex flex-col w-full gap-1">
                      <div className="flex items-center space-x-2 w-full">
                        <span className="text-sm text-retro-secondary dark:text-dark-secondary">
                          Added:{" "}
                          {new Date(completion.created_at).toLocaleDateString()}
                        </span>
                        <span className="bg-retro-primary dark:bg-dark-primary text-white px-2 py-1 rounded-md text-xs">
                          {completion.status}
                        </span>
                      </div>
                      {isOwner && (
                        <div className="space-x-2 w-full mt-2">
                          <GameStatusSelect
                            gameCompletionId={completion.id}
                            initialStatus={completion.status}
                            onRemove={() => handleRemoveGame(completion.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
