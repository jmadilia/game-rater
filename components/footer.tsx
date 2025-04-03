import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full bg-retro-primary dark:bg-dark-primary text-white border-t-4 border-retro-accent dark:border-dark-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-base">
              © {new Date().getFullYear()} Game Rater. All rights reserved.
            </p>
            <p className="text-base text-retro-accent dark:text-dark-accent">
              Game data provided by IGDB.com
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
