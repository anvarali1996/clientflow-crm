"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@/lib/customers";
import { toast } from "sonner";
export default function EditCustomerForm({
  customer,
}: {
  customer: Customer;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `/api/customers/${customer.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    // Javobni avval oddiy text sifatida olamiz
    const responseText = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", responseText);

    if (!response.ok) {
      let message = `Update failed: ${response.status}`;

      if (responseText) {
        try {
          const data = JSON.parse(responseText);
          message = data.message || message;
        } catch {
          // Server JSON bo'lmagan javob qaytargan
        }
      }

      throw new Error(message);
    }

    router.push("/dashboard/customers");
    router.refresh();

  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
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
      {(["name", "email", "phone", "company"] as const).map(
        (field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block mb-2 font-medium capitalize"
            >
              {field}
            </label>

            <input
              id={field}
              type={field === "email" ? "email" : "text"}
              required
              value={form[field]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [field]: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
            />
          </div>
        )
      )}

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}