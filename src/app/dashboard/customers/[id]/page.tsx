import Link from "next/link";
import { notFound } from "next/navigation";
import { customers } from "@/lib/customers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetails({
  params,
}: Props) {
  const { id } = await params;

  const customer = customers.find(
    (item) => item.id === Number(id)
  );

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customer Details
      </h1>

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">
          {customer.name}
        </h2>

        <p className="mb-3">
          <strong>ID:</strong> {customer.id}
        </p>

        <p className="mb-3">
          <strong>Email:</strong> {customer.email}
        </p>

        <p className="mb-6">
          <strong>Status:</strong> {customer.status}
        </p>

        <Link
          href="/dashboard/customers"
          className="text-blue-600 hover:underline"
        >
          ← Back to Customers
        </Link>
      </div>
    </div>
  );
}