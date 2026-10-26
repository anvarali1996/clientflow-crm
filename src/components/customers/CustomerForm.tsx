"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
};

export default function CustomerForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // const handleSubmit = async (
  //   e: FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();

  //   setLoading(true);
  //   setError("");
  //   setSuccess("");

  //   try {
  //     const response = await fetch(
  //       "https://jsonplaceholder.typicode.com/users",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: form.name,
  //           email: form.email,
  //           phone: form.phone,
  //           company: {
  //             name: form.company,
  //           },
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to add customer");
  //     }

  //     const data = await response.json();

  //     console.log("API Response:", data);

  //     setSuccess("Demo POST request successful!");
  //     setForm(initialForm);
  //   } catch {
  //     setError("Something went wrong. Try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Xatolik yuz berdi");
    }

    toast.success("Mijoz muvaffaqiyatli qo'shildi!");

    router.push("/dashboard/customers");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Mijozni qo'shib bo'lmadi"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm space-y-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Full Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          placeholder="Ali Karimov"
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          placeholder="ali@example.com"
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Phone
        </label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          placeholder="+998 90 123 45 67"
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Company
        </label>
        <input
          type="text"
          required
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
          placeholder="Tech Company"
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-green-600">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Customer"}
      </button>
    </form>
  );
}