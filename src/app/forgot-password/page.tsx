"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } =
        await authClient.requestPasswordReset({
          email: email.trim().toLowerCase(),
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (error) {
        throw new Error(
          error.message || "Request failed"
        );
      }

      setSent(true);

      toast.success("So'rov qabul qilindi!");
    } catch {
      toast.error(
        "So'rov yuborilmadi. Birozdan keyin qayta urinib ko'ring."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm">
        {sent ? (
          <div className="space-y-5 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Check Your Email
            </h1>

            {/* <p className="text-gray-600">
              Agar bu email bilan account mavjud
              bo'lsa, parolni tiklash havolasi
              yuboriladi.
            </p> */}
            <p className="text-gray-600">
             If there is a account with this email, link will send.x
            </p>
            <Link
              href="/login"
              className="block text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Forgot Password?
            </h1>

            <p className="text-gray-500">
              Email manzilingizni kiriting.
              Parolingizni tiklash uchun havola yuboramiz.
            </p>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

            <Link
              href="/login"
              className="block text-center text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}