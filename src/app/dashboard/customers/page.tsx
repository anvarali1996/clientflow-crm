import Link from "next/link";
import { getCustomers } from "@/lib/customers";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="text-gray-500 mt-2">
            Total customers: {customers.length}
          </p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          + Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Company</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-gray-200"
              >
                <td className="p-4 text-gray-900">
                  {customer.name}
                </td>

                <td className="p-4 text-gray-600">
                  {customer.email}
                </td>

                <td className="p-4 text-gray-600">
                  {customer.company.name}
                </td>

                <td className="p-4">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}