import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/customers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetails({
  params,
}: Props) {
  const { id } = await params;

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customer Details
      </h1>

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl space-y-4">
        <h2 className="text-2xl font-semibold">
          {customer.name}
        </h2>

        <p>
          <strong>Username:</strong> {customer.username}
        </p>

        <p>
          <strong>Email:</strong> {customer.email}
        </p>

        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>

        <p>
          <strong>Company:</strong> {customer.company.name}
        </p>

        <p>
          <strong>Website:</strong> {customer.website}
        </p>

        <Link
          href="/dashboard/customers"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          ← Back to Customers
        </Link>
      </div>
    </div>
  );
}