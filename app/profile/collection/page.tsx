import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserGameCollection, getMultipleGameDetails } from "@/lib/game/game";
import GameCollectionList from "@/components/game-collection-list";

export default async function CollectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  const gameCompletions = await getUserGameCollection(user.id);
  const gameIds = gameCompletions.map((completion) => completion.game_id);
  const gameDetails = await getMultipleGameDetails(gameIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-retro-primary dark:text-dark-text">
        Your Game Collection
      </h1>

      {gameCompletions.length === 0 ? (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center">
          <p className="text-retro-secondary dark:text-dark-text text-lg mb-4">
            Your collection is empty. Start by adding some games!
          </p>
          <a
            href="/games"
            className="inline-block bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-6 py-2 rounded-md transition duration-150 ease-in-out">
            Browse Games
          </a>
        </div>
      ) : (
        <GameCollectionList
          gameCompletions={gameCompletions}
          gameDetails={gameDetails}
          isOwner={true}
        />
      )}
    </div>
  );
}
