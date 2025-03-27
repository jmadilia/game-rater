"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { signOutAction } from "@/lib/actions";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  return (
    <nav className="w-full bg-retro-primary dark:bg-dark-primary text-white border-b-4 border-retro-accent dark:border-dark-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold">Game Rater</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/games"
                className="text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary px-3 py-2 text-sm font-medium">
                Games
              </Link>
              <Link
                href="/reviews"
                className="text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary px-3 py-2 text-sm font-medium">
                Reviews
              </Link>
              <Link
                href="/community"
                className="text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary px-3 py-2 text-sm font-medium">
                Community
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border-2 border-retro-accent dark:border-dark-accent rounded-md leading-5 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary sm:text-sm"
                  placeholder="Search for games"
                  type="search"
                />
              </div>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <form action={signOutAction}>
                <Button
                  className="hidden md:flex md:items-center md:space-x-4 text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary px-3 py-2 text-sm font-medium"
                  type="submit"
                  variant={"outline"}>
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/sign-in"
                className="text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary px-3 py-2 text-sm font-medium">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="bg-retro-orange hover:bg-retro-orange/90 dark:bg-dark-orange dark:hover:bg-dark-orange/90 text-white px-4 py-2 text-sm font-medium border-2 border-transparent rounded-md">
                Sign up
              </Link>
            </div>
          )}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-retro-primary dark:bg-dark-primary">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/games"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary">
              Games
            </Link>
            <Link
              href="/reviews"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary">
              Reviews
            </Link>
            <Link
              href="/community"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary">
              Community
            </Link>
            {user ? (
              <form action={signOutAction}>
                <Button
                  className="block px-3 py-2 text-base font-medium bg-retro-orange dark:bg-dark-orange text-white rounded-md"
                  type="submit"
                  variant={"outline"}>
                  Sign out
                </Button>
              </form>
            ) : (
              <div>
                <Link
                  href="/sign-in"
                  className="block px-3 py-2 text-base font-medium text-white hover:bg-retro-secondary dark:hover:bg-dark-secondary">
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="block px-3 py-2 text-base font-medium bg-retro-orange dark:bg-dark-orange text-white rounded-md">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
