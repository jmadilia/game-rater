"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Gamepad2Icon as GameController } from "lucide-react";
import { signOutAction } from "@/lib/actions";
import { Button } from "./ui/button";
import Avatar from "./avatar";
import AvatarSkeleton from "./ui/skeletons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { searchGamesAction } from "@/lib/igdb/actions";
import { createClient } from "@/utils/supabase/client";
import type { UserProfile } from "@/lib/user/user";

// Define the Game interface
interface Game {
  cover: any;
  id: number;
  name: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile() {
      setProfileLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(data || null);
      setProfileLoading(false);
    }

    fetchProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchGamesAction(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching games:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleGameSelect = (gameId: number) => {
    router.push(`/games/${gameId}`);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <nav className="w-full bg-retro-primary dark:bg-dark-primary text-white border-b-4 border-retro-accent dark:border-dark-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <GameController className="h-8 w-8" />
              <span className="hidden md:block text-2xl font-bold">
                Game Rater
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/games"
                className="text-white hover:text-retro-secondary dark:hover:text-dark-secondary px-3 py-2 text-sm font-medium">
                GAMES
              </Link>
              <Link
                href="/reviews"
                className="text-white hover:text-retro-secondary dark:hover:text-dark-secondary px-3 py-2 text-sm font-medium">
                REVIEWS
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">
                SEARCH
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                </div>
                <input
                  id="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border-2 border-retro-accent dark:border-dark-accent rounded-md leading-5 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary sm:text-sm"
                  placeholder="Search for games"
                  type="search"
                />
              </div>
              {searchResults.length > 0 ? (
                <ul className="absolute z-10 mt-2 w-full bg-white text-black dark:text-white dark:bg-dark-secondary border border-retro-accent dark:border-dark-accent rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((game) => (
                    <li
                      key={game.id}
                      onClick={() => handleGameSelect(game.id)}
                      className="cursor-pointer px-4 py-2 hover:bg-retro-secondary dark:hover:bg-dark-secondary flex items-center gap-4">
                      {game.cover?.url ? (
                        <img
                          src={game.cover.url.replace(
                            "t_thumb",
                            "t_cover_small"
                          )}
                          alt={game.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded">
                          <span className="text-sm text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                      <span>{game.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                !isSearching &&
                searchQuery && (
                  <div className="absolute z-10 mt-2 w-full bg-white dark:bg-dark-secondary border border-retro-accent dark:border-dark-accent rounded-md shadow-lg p-4 text-center italic text-gray-500 dark:text-gray-400">
                    No games found
                  </div>
                )
              )}
              {isSearching && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-dark-secondary border border-retro-accent dark:border-dark-accent rounded-md shadow-lg p-4 text-center">
                  Searching...
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {profileLoading ? (
              <AvatarSkeleton className="w-10 h-10 rounded-full" />
            ) : profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar
                      url={profile.avatar_url || null}
                      username={profile.username}
                      size={40}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Mobile nav links for signed-in users, only visible on small screens */}
                  <div className="md:hidden">
                    <DropdownMenuItem asChild>
                      <Link href="/games">GAMES</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reviews">REVIEWS</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${profile.username}`}>
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/collection">My Collection</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/reviews">My Reviews</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await signOutAction();
                        window.location.href = "/";
                      }}>
                      <button type="submit" className="w-full text-left">
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link
                  href="/sign-in"
                  className="text-white hover:text-retro-secondary dark:hover:text-dark-secondary px-3 py-2 text-sm font-medium">
                  SIGN IN
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white px-4 py-2 text-sm font-medium border-2 border-transparent rounded-md w-auto inline-block">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
          {/* Only show mobile menu button if NOT signed in */}
          {!profile && (
            <div className="flex items-center md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-retro-secondary dark:hover:text-dark-secondary">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-retro-primary dark:bg-dark-primary">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/games"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-white hover:text-retro-secondary dark:hover:text-dark-secondary">
              GAMES
            </Link>
            <Link
              href="/reviews"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-white hover:text-retro-secondary dark:hover:text-dark-secondary">
              REVIEWS
            </Link>
            {profile ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  await signOutAction();
                  window.location.href = "/";
                }}>
                <Button
                  className="block px-3 py-2 text-base font-medium bg-retro-orange dark:bg-dark-orange text-white rounded-md"
                  type="submit"
                  variant={"outline"}>
                  SIGN OUT
                </Button>
              </form>
            ) : (
              <div>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white hover:text-retro-secondary dark:hover:text-dark-secondary">
                  SIGN IN
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="inline-block px-3 py-2 text-base font-medium bg-retro-orange dark:bg-dark-orange text-white rounded-md w-auto">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
