import GameSearch from "@/components/game-search";
import { getPopularGamesAction } from "@/lib/igdb/actions";

export default async function Games() {
  let popularGames = [];

  try {
    popularGames = await getPopularGamesAction();
  } catch (gamesError) {
    console.error("Error fetching popular games:", gamesError);
  }

  return (
    <div className="max-w-7xl space-y-4 p-6 px-4 sm:px-6 lg:px-8">
      <GameSearch />
      <h2 className="text-xl font-bold">Popular games</h2>
      <div className="grid grid-cols-4 gap-4">
        {popularGames.map((game) => (
          <a
            key={game.id}
            href={`/games/${game.id}`}
            className="group flex flex-col items-center p-2 border rounded shadow hover:scale-105 transition-transform h-92">
            {game.cover?.url ? (
              <img
                src={game.cover.url.replace("t_thumb", "t_720p")}
                alt={game.name}
                className="w-full min-h-80 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded">
                <span className="text-sm text-gray-500">No Image</span>
              </div>
            )}
            <p className="mt-2 text-center text-sm font-medium truncate w-full">
              {game.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
