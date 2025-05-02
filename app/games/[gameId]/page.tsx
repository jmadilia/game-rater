import { createClient } from "@/utils/supabase/server";
import { getTwitchAccessTokenAction } from "@/lib/igdb/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getGameReviews,
  getUserReviewForGame,
  getGameAverageRating,
} from "@/lib/review/review";
import AddToCollectionButton from "@/components/add-to-collection-button";
import WriteReviewButton from "@/components/write-review-button";
import ReviewList from "@/components/review-list";
import GameRating from "@/components/game-rating";

interface GameDetails {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
  genres?: { name: string }[];
  release_dates?: { human: string }[];
}

type paramsType = Promise<{ gameId: string }>;

async function fetchGameDetails(gameId: string): Promise<GameDetails | null> {
  try {
    const token = await getTwitchAccessTokenAction();

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
      },
      body: `fields name,summary,cover.url,genres.name,release_dates.human; where id = ${gameId};`,
    });

    if (!response.ok) {
      console.error("Error fetching game details:", await response.text());
      return null;
    }

    const [game] = await response.json();
    return game || null;
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null;
  }
}

export default async function GamePage({ params }: { params: paramsType }) {
  const resolvedParams = await params;
  const game = await fetchGameDetails(resolvedParams.gameId);
  const gameId = Number.parseInt(resolvedParams.gameId);

  if (!game) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <p className="text-gray-500">
          We couldn't find the game you're looking for.
        </p>
      </div>
    );
  }

  const [reviews, rating] = await Promise.all([
    getGameReviews(gameId),
    getGameAverageRating(gameId),
  ]);

  // Check if the current user has already reviewed this game
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userReview = null;
  if (session?.user) {
    userReview = await getUserReviewForGame(session.user.id, gameId);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center">
        {game.cover && (
          <img
            src={game.cover.url.replace("t_thumb", "t_1080p")}
            alt={game.name}
            className="w-full max-w-xs object-cover rounded-lg mb-4 shadow-xl"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
        <div className="flex flex-col space-y-2 mb-4 justify-center items-center">
          {session ? (
            <>
              {rating && (
                <GameRating
                  average={rating.average}
                  count={rating.count}
                  size="md"
                />
              )}
              <AddToCollectionButton gameId={gameId} />
              <WriteReviewButton
                gameId={gameId}
                gameName={game.name}
                existingReview={userReview}
                variant="secondary"
              />
            </>
          ) : (
            <p className="text-retro-secondary dark:text-dark-secondary text-center text-lg font-semibold bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 px-6 py-4 rounded-lg shadow">
              Please sign in to add to collection and leave a review.
            </p>
          )}
        </div>
        {game.genres && (
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Genres: {game.genres.map((genre) => genre.name).join(", ")}
          </p>
        )}
        {game.release_dates && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Release Date: {game.release_dates[0]?.human || "Unknown"}
          </p>
        )}
        {game.summary && (
          <p className="text-gray-800 dark:text-gray-200 text-justify leading-relaxed">
            {game.summary}
          </p>
        )}

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-retro-primary dark:text-dark-text">
            Reviews
          </h2>

          {userReview && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-retro-secondary dark:text-dark-secondary">
                Your Review
              </h3>
              <ReviewList
                reviews={[
                  {
                    ...userReview,
                    profiles: {
                      username: "You",
                      avatar_url: null,
                    },
                    game_name: game.name,
                    game_cover: game.cover?.url,
                  },
                ]}
                showGameInfo={false}
                showUserInfo={false}
              />
            </div>
          )}

          <h3 className="text-xl font-semibold mb-3 text-retro-secondary dark:text-dark-secondary">
            {reviews && reviews.length > 0
              ? `${reviews.length} Reviews`
              : "No Reviews Yet"}
          </h3>

          <ReviewList
            reviews={reviews.filter(
              (review) => !session?.user || review.user_id !== session.user.id
            )}
            showGameInfo={false}
            emptyMessage={
              userReview
                ? "No other reviews yet. Yours is the first!"
                : "Be the first to review this game!"
            }
          />
        </div>
      </div>
    </div>
  );
}
