import Link from "next/link";
import CustomerForm from "@/components/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/customers"
        className="text-blue-600 hover:underline"
      >
        ← Back to Customers
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-2">
        Add New Customer
      </h1>

      <p className="text-gray-500 mb-8">
        Enter customer information below.
      </p>

      <CustomerForm />
    </div>
  );
}