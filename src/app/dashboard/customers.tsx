import Link from "next/link";
import { customers } from "@/lib/customers";

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Customers
      </h1>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-gray-200"
              >
                <td className="p-4">{customer.id}</td>
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.status}</td>
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