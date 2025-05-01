"use client";

import { useState } from "react";
import {
  updateGameStatus,
  removeGameFromCollection,
  type GameStatus,
} from "@/lib/game/game";
import { Loader2, Trash2 } from "lucide-react";

interface GameStatusSelectProps {
  gameCompletionId: string;
  initialStatus: GameStatus;
  onStatusChange?: (newStatus: GameStatus) => void;
  onRemove?: () => void;
}

export default function GameStatusSelect({
  gameCompletionId,
  initialStatus,
  onStatusChange,
  onRemove,
}: GameStatusSelectProps) {
  const [status, setStatus] = useState<GameStatus>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const statusOptions: GameStatus[] = [
    "Playing",
    "Beaten",
    "Completed",
    "Suspended",
    "Abandoned",
  ];

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      const result = await updateGameStatus(gameCompletionId, newStatus);
      if (result.success) {
        setStatus(newStatus);
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } else {
        console.error("Failed to update status:", result.error);
        alert(result.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveGame = async () => {
    if (
      !confirm(
        "Are you sure you want to remove this game from your collection?"
      )
    ) {
      return;
    }

    setIsRemoving(true);
    try {
      const result = await removeGameFromCollection(gameCompletionId);
      if (result.success) {
        if (onRemove) {
          onRemove();
        }
      } else {
        console.error("Failed to remove game:", result.error);
        alert(result.error || "Failed to remove game.");
      }
    } catch (error) {
      console.error("Error removing game:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as GameStatus)}
        disabled={isUpdating || isRemoving}
        className="border-2 border-retro-accent dark:border-dark-accent rounded-md px-2 py-1 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary">
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {isUpdating && (
        <Loader2 className="h-5 w-5 animate-spin text-retro-secondary dark:text-dark-secondary" />
      )}

      <button
        onClick={handleRemoveGame}
        disabled={isRemoving || isUpdating}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
        title="Remove from collection">
        {isRemoving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
