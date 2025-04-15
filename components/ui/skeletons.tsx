import React from "react";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function AvatarSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`${shimmer} bg-gray-300 dark:bg-dark-accent rounded ${className || ""}`.trim()}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}
