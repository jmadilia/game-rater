"use client";

import { useState, useEffect } from "react";
import type { GameCompletion, Game, GameStatus } from "@/lib/game/game";
import GameStatusSelect from "@/components/game-status-select";
import WriteReviewButton from "@/components/write-review-button";
import { createClient } from "@/utils/supabase/client";

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
  const [userReviews, setUserReviews] = useState<Record<number, any>>({});
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const supabase = createClient();

  const statusOptions: (GameStatus | "All")[] = [
    "All",
    "Playing",
    "Beaten",
    "Completed",
    "Suspended",
    "Abandoned",
  ];

  // Filter games based on selected status
  const filteredGames = gameCompletions.filter(
    (completion) =>
      !removedIds.has(completion.id) &&
      (filter === "All" || completion.status === filter)
  );

  const handleRemoveGame = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  };

  // Fetch all reviews for games in the collection
  useEffect(() => {
    const fetchAllReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIsLoadingReviews(false);
          return;
        }

        const gameIds = gameCompletions.map((completion) => completion.game_id);

        if (gameIds.length === 0) {
          setIsLoadingReviews(false);
          return;
        }

        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .in("game_id", gameIds);

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        const reviewsMap: Record<number, any> = {};
        data.forEach((review) => {
          reviewsMap[review.game_id] = review;
        });

        setUserReviews(reviewsMap);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchAllReviews();
  }, [gameCompletions, supabase]);

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto space-y-6">
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
              <p className="text-retro-secondary dark:text-dark-text">
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
          <div className="grid grid-cols-1 gap-y-8 gap-x-0 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-x-8 w-full">
            {filteredGames.map((completion) => {
              const game = gameDetails[completion.game_id];
              const review = userReviews[completion.game_id];
              return (
                <div
                  key={completion.id}
                  className="flex flex-row items-center w-full sm:flex-col sm:items-center gap-4 sm:gap-0 p-2 sm:p-4 space-y-0 sm:space-y-2 border rounded shadow bg-white dark:bg-dark-secondary border-retro-accent dark:border-dark-accent hover:bg-gray-100 dark:hover:bg-gray-800 transition max-w-full mx-auto">
                  {game?.cover ? (
                    <img
                      src={game.cover.url.replace("t_thumb", "t_720p")}
                      alt={game.name}
                      className="w-14 h-20 sm:w-full sm:h-48 object-cover rounded"
                    />
                  ) : (
                    <div className="w-14 h-20 sm:w-full sm:h-48 flex items-center justify-center bg-gray-200 rounded">
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <h3 className="text-md mb-2 text-retro-primary dark:text-dark-text text-left sm:mt-2 sm:text-center">
                      {game?.name || `Game #${completion.game_id}`}
                    </h3>
                    <div className="flex flex-col w-full gap-1">
                      <div className="flex items-center space-x-2 w-full">
                        <span className="text-sm text-retro-secondary dark:text-dark-text">
                          Added:{" "}
                          {new Date(completion.created_at).toLocaleDateString()}
                        </span>
                        <span className="bg-retro-primary dark:bg-dark-primary text-white px-2 py-1 rounded-md text-xs">
                          {completion.status}
                        </span>
                      </div>
                      {isOwner && (
                        <div className="w-full mt-4 flex flex-col gap-4">
                          <div>
                            <GameStatusSelect
                              gameCompletionId={completion.id}
                              initialStatus={completion.status}
                              onRemove={() => handleRemoveGame(completion.id)}
                            />
                          </div>
                          <div>
                            {isLoadingReviews ? (
                              <button
                                disabled
                                className="flex items-center gap-2 px-4 py-2 rounded-md transition duration-150 ease-in-out bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 w-full justify-center">
                                <span className="animate-pulse">
                                  Loading review...
                                </span>
                              </button>
                            ) : (
                              <WriteReviewButton
                                gameId={completion.game_id}
                                gameName={
                                  game?.name || `Game #${completion.game_id}`
                                }
                                existingReview={review}
                                variant="secondary"
                              />
                            )}
                          </div>
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
