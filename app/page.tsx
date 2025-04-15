import Link from "next/link";
import GameSearch from "@/components/game-search";
import { ArrowRight, Star, Users, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden rounded-lg shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-retro-accent/20 to-retro-highlight/20 dark:from-dark-accent/20 dark:to-dark-highlight/20" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Rate and review your
              <span className="text-retro-primary dark:text-dark-accent">
                {" "}
                gaming journey
              </span>
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our community of gamers to discover, rate, and review your
              favorite games. Keep track of your gaming progress and share your
              experiences.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/sign-up"
                className="bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-8 py-3 text-sm font-bold inline-flex items-center rounded-md justify-center">
                GET STARTED
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/games"
                className="bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white px-8 py-3 text-sm font-bold rounded-md justify-center">
                BROWSE GAMES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-retro-primary dark:bg-dark-primary text-white rounded-lg shadow-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Game Rater?</h2>
            <p className="mt-4 text-xl text-retro-accent dark:text-dark-accent">
              Everything you need to manage your gaming experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-retro-secondary dark:bg-dark-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-retro-orange dark:bg-dark-orange rounded-full flex items-center justify-center mb-4">
                <Trophy className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-retro-accent dark:text-dark-accent">
                Keep track of games you're playing, completed, or want to play
              </p>
            </div>
            <div className="bg-retro-secondary dark:bg-dark-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-retro-orange dark:bg-dark-orange rounded-full flex items-center justify-center mb-4">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-retro-accent dark:text-dark-accent">
                Share your thoughts and read reviews from other gamers
              </p>
            </div>
            <div className="bg-retro-secondary dark:bg-dark-secondary p-6 rounded-lg">
              <div className="w-12 h-12 bg-retro-orange dark:bg-dark-orange rounded-full flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Community</h3>
              <p className="text-retro-accent dark:text-dark-accent">
                Connect with other gamers and share your gaming experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-retro-primary dark:text-dark-accent mb-4">
              Find Your Next Game
            </h2>
            <p className="text-xl text-retro-secondary dark:text-dark-secondary">
              Search through our extensive database of games
            </p>
          </div>
          <GameSearch />
        </div>
      </section>
    </div>
  );
}
