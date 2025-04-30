import { createClient } from "@/utils/supabase/server";
import { getUserGameCollection, getMultipleGameDetails } from "@/lib/game/game";
import GameCollectionList from "@/components/game-collection-list";
import { getUserProfileByUsername } from "@/lib/user/user";
import { redirect } from "next/navigation";

export default async function CollectionPage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  const { username } = await params;
  const profile = await getUserProfileByUsername(username);
  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-retro-primary dark:text-dark-text">
          User Not Found
        </h1>
        <p className="text-retro-secondary dark:text-dark-secondary text-lg mb-4">
          The user "{username}" does not exist.
        </p>
      </div>
    );
  }

  const gameCompletions = await getUserGameCollection(profile.id);
  const gameIds = gameCompletions.map((completion) => completion.game_id);
  const gameDetails = await getMultipleGameDetails(gameIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-retro-primary dark:text-dark-text">
        {profile.username}'s Game Collection
      </h1>

      {gameCompletions.length === 0 ? (
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center">
          <p className="text-retro-secondary dark:text-dark-secondary text-lg mb-4">
            {profile.username}'s collection is empty.
          </p>
        </div>
      ) : (
        <GameCollectionList
          gameCompletions={gameCompletions}
          gameDetails={gameDetails}
          isOwner={false}
        />
      )}
    </div>
  );
}
