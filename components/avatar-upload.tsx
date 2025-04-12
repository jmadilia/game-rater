"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

export default function AvatarUpload({
  url,
  onUpload,
  size = 150,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (url) setAvatarUrl(url);
  }, [url]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();

      // Validate file type
      const allowedTypes = ["jpg", "jpeg", "png", "gif"];
      if (!fileExt || !allowedTypes.includes(fileExt.toLowerCase())) {
        throw new Error(
          "File type not supported. Please upload a JPG, PNG, or GIF image."
        );
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 2MB.");
      }

      // Create a unique file path
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update state and call the callback
      setAvatarUrl(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred during upload.");
      }
      console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative h-[150px] w-[150px] rounded-full overflow-hidden border-4 border-retro-accent dark:border-dark-accent bg-white dark:bg-dark-secondary"
        style={{ height: `${size}px`, width: `${size}px` }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt="Avatar"
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-retro-primary dark:text-dark-text text-4xl font-bold">
            ?
          </div>
        )}
      </div>

      <label className="cursor-pointer flex items-center gap-2 bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white px-4 py-2 rounded-md transition-colors">
        {uploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <span>Upload Avatar</span>
          </>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </label>

      {avatarUrl && (
        <p className="text-xs text-retro-secondary dark:text-dark-secondary mt-1">
          Click the button above to change your avatar
        </p>
      )}
    </div>
  );
}
