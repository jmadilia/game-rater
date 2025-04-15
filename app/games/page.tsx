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
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      <GameSearch />
      <h2 className="text-xl font-bold mt-4">Popular games</h2>
      <div className="space-y-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:space-y-0">
        {popularGames.map((game) => (
          <a
            key={game.id}
            href={`/games/${game.id}`}
            className="cursor-pointer flex items-center sm:flex-col sm:items-center gap-4 sm:gap-0 p-4 border rounded shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition">
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
          </a>
        ))}
      </div>
    </div>
  );
}
