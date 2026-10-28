"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserAvatar from "@/components/profile/UserAvatar";

type Props = {
  name: string;
  avatarVersion: string | null;
};

export default function AvatarUploadForm({
  name,
  avatarVersion,
}: Props) {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const handleUpload = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image first!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Picture must not be avobe 2mb");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WebP images are allowed!");
      return;
    }

    setBusy(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message || "Avatar upload failed"
        );
      }

      toast.success("Profile picture updated successfully!");

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload profile picture."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.message || "Avatar delete failed"
        );
      }

      toast.success("Profile picture deleted successfully!");

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete profile picture."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Profile Picture
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Upload or remove your profile photo
        </p>
      </div>

      <div className="flex items-center gap-4">
        <UserAvatar
          name={name}
          avatarVersion={avatarVersion}
          size="lg"
        />

        <div>
          <p className="font-semibold text-gray-900">
            {name}
          </p>

          <p className="text-sm text-gray-500">
            JPG, PNG or WebP · Max 2 MB
          </p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
          }}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
        />

        {file && (
          <p className="text-sm text-gray-500">
            Selected: {file.name}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy || !file}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg disabled:opacity-50"
          >
            {busy ? "Please wait..." : "Upload Photo"}
          </button>

          {avatarVersion && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-3 rounded-lg disabled:opacity-50"
            >
              Remove Photo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}