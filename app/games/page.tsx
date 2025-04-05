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
    </div>
  );
}
