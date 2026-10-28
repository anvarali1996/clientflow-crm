"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteCustomerButton({
  id,
}: {
  id: number;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer.");
      }

      dialogRef.current?.close();

      toast.success("Customer deleted successfully!");

      router.push("/dashboard/customers");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg"
      >
        Delete Customer
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-title"
        className="fixed left-1/2 top-1/2 m-0 w-[min(92vw,420px)] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-black/50"
      >
        <h2
          id="delete-title"
          className="text-xl font-bold mb-3"
        >
          Are you sure you want to delete this customer?
        </h2>

        <p className="text-gray-500 mb-6">
         This action cannot be undone. The customer will be permanently deleted from the database.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            disabled={loading}
            onClick={() => dialogRef.current?.close()}
            className="px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Bekor qilish
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}