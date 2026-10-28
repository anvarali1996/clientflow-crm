"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Props = {
  initialName: string;
  email: string;
  role: string;
};

export default function AccountSettingsForm({
  initialName,
  email,
  role,
}: Props) {
  const router = useRouter();

  // Personal Information
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  // Change Password
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [savingPassword, setSavingPassword] =
    useState(false);

  // =====================================
  // UPDATE PROFILE
  // =====================================
  const handleUpdateProfile = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      toast.error("Ism 2 dan 100 tagacha belgi bo'lsin");
      return;
    }

    setSavingName(true);

    try {
      const { error } = await authClient.updateUser({
        name: cleanName,
      });

      if (error) {
        throw new Error(
          error.message || "Profile update failed"
        );
      }

      setName(cleanName);

      toast.success("Profile updated succesfully");

      // Navbar va Profile ma'lumotlarini yangilaydi
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Profile update failed"
      );
    } finally {
      setSavingName(false);
    }
  };

  // =====================================
  // CHANGE PASSWORD
  // =====================================
  const handleChangePassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Your new password must be at least 8 characters long.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("Your new password must be different from your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords are not the same");
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(
          error.message || "Password change failed"
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Password change failed"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* PERSONAL INFORMATION */}
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Personal Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your personal details
          </p>
        </div>

        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>

          <input
            id="fullName"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
          />

          <p className="text-xs text-gray-400 mt-2">
            Email change is currently disabled.
          </p>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Account Role
          </label>

          <input
            id="role"
            type="text"
            value={role === "admin" ? "Administrator" : "User"}
            readOnly
            className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 text-gray-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingName || !name.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {savingName ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* SECURITY */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Security
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Change your account password
          </p>
        </div>

        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Password
          </label>

          <input
            id="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            placeholder="Enter current password"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>

          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm new password"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {savingPassword
              ? "Updating..."
              : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}