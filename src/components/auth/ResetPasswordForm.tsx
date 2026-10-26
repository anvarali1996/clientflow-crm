"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm({
  token,
}: {
  token: string;
}) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Parol kamida 8 ta belgi bo'lsin");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Parollar bir xil emas");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        throw new Error(
          error.message || "Password reset failed"
        );
      }

      toast.success("Parolingiz muvaffaqiyatli o'zgardi!");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Parolni tiklab bo'lmadi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm space-y-5"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Reset Password
        </h1>

        <p className="text-gray-500">
          Account uchun yangi parol yarating.
        </p>

        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border rounded-lg p-3 text-gray-900"
        />

        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Confirm New Password"
          className="w-full border rounded-lg p-3 text-gray-900"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Reset Password"}
        </button>

        <Link
          href="/login"
          className="block text-center text-blue-600"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}