"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(
          error.message || "Logout failed"
        );
      }

      toast.success("Accountdan muvaffaqiyatli chiqdingiz!");

      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Logout qilishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 disabled:opacity-50"
    >
      {loading ? "Chiqilmoqda..." : "Logout"}
    </button>
  );
}