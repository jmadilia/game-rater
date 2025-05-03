"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmationModal from "./confirmation-modal";
import { deleteUserProfile } from "@/lib/user/user";

export default function DeleteProfileButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteUserProfile();

      if (result.success) {
        // Redirect to home page after successful deletion
        router.push("/");
      } else {
        setError(result.error || "Failed to delete profile. Please try again.");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl py-6 mx-auto">
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="mb-4 text-retro-text dark:text-dark-text">
            Deleting your profile will permanently remove all your data,
            including your reviews, game collection, and followers. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isDeleting}>
            <Trash2 className="h-5 w-5" />
            <span>{isDeleting ? "Deleting..." : "Delete Profile"}</span>
          </button>
          {error && (
            <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Profile"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700">
        <p className="mb-4">
          Are you sure you want to delete your profile? This will permanently
          remove all your data, including:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Your profile information</li>
          <li>All your game reviews</li>
          <li>Your game collection</li>
          <li>Your followers and following relationships</li>
        </ul>
        <p className="font-bold text-red-600 dark:text-red-400">
          This action cannot be undone.
        </p>
      </ConfirmationModal>
    </>
  );
}
