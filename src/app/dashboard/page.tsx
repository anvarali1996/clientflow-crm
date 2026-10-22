import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Customers",
      value: "120",
    },
    {
      title: "Active Deals",
      value: "35",
    },
    {
      title: "Revenue",
      value: "$12,500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to ClientFlow CRM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <p className="text-gray-500">
              {stat.title}
            </p>

            <h2 className="text-3xl font-bold mt-3 text-gray-900">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-3">
          Customer Management
        </h2>

        <p className="text-gray-500 mb-4">
          Manage your customers and deals.
        </p>

        <Link
          href="/dashboard/customers"
          className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          View Customers
        </Link>
      </div>
    </div>
  );
}