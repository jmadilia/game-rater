"use client";

import { useState } from "react";
import {
  addGameToCollection,
  type GameStatus,
  isGameInUserCollection,
} from "@/lib/game/game";
import { PlusCircle, Loader2, Check } from "lucide-react";

interface AddToCollectionButtonProps {
  gameId: number;
  initialStatus?: GameStatus;
  onSuccess?: () => void;
}

export default function AddToCollectionButton({
  gameId,
  initialStatus = "Playing",
  onSuccess,
}: AddToCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [status, setStatus] = useState<GameStatus>(initialStatus);
  const [success, setSuccess] = useState(false);
  const [alreadyInCollection, setAlreadyInCollection] = useState(false);

  const statusOptions: GameStatus[] = [
    "Playing",
    "Beaten",
    "Completed",
    "Suspended",
    "Abandoned",
  ];

  const handleAddToCollection = async () => {
    setIsAdding(true);
    setIsOpen(false);

    try {
      const inCollection = await isGameInUserCollection(gameId);
      if (inCollection) {
        setAlreadyInCollection(true);
        setSuccess(false);
        return;
      }
      const result = await addGameToCollection(gameId, status);
      if (result.success) {
        setSuccess(true);
        setAlreadyInCollection(false);
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Error adding game to collection:", result.error);
      }
    } catch (error) {
      console.error("Error adding game:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative">
      {alreadyInCollection ? (
        <button
          className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
          disabled>
          <Check className="h-5 w-5" />
          <span>Already in Collection</span>
        </button>
      ) : success ? (
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          disabled>
          <Check className="h-5 w-5" />
          <span>Added to Collection</span>
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-4 py-2 rounded-md transition-colors"
            disabled={isAdding}>
            {isAdding ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                <span>Add to Collection</span>
              </>
            )}
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-dark-secondary border border-retro-accent dark:border-dark-accent">
              <div className="p-4 space-y-4">
                <h3 className="font-medium text-retro-primary dark:text-dark-text">
                  Select Status
                </h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GameStatus)}
                  className="w-full border-2 border-retro-accent dark:border-dark-accent rounded-md px-2 py-1 bg-white dark:bg-dark-background text-retro-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-retro-secondary dark:focus:ring-dark-secondary focus:border-retro-secondary dark:focus:border-dark-secondary">
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 text-retro-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddToCollection}
                    className="px-3 py-1 bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white rounded-md">
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
