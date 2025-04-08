import { getTwitchAccessTokenAction } from "@/lib/igdb/actions";

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
  const { gameId } = await params;
  const game = await fetchGameDetails(gameId);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center">
        {game.cover && (
          <img
            src={game.cover.url.replace("t_thumb", "t_screenshot_med")}
            alt={game.name}
            className="w-full max-w-[569px] aspect-[569/320] object-cover rounded-lg mb-4 shadow-xl"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
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
      </div>
    </div>
  );
}
