"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Props = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isRegister
        ? await authClient.signUp.email({
            name,
            email,
            password,
          })
        : await authClient.signIn.email({
            email,
            password,
          });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success(
        isRegister
          ? "Account created successfully!"
          : "WELCOME!"
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        {isRegister && (
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full border rounded-lg p-3"
          />
        )}

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isRegister
              ? "Sign Up"
              : "Sign In"}
        </button>
{!isRegister && (
  <div className="text-right">
    <Link
      href="/forgot-password"
      className="text-sm text-blue-600 hover:underline"
    >
      Forgot Password?
    </Link>
  </div>
)}
        <p className="text-center text-sm text-gray-600">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="text-blue-600 font-medium"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </form>
    </div>
  );
}