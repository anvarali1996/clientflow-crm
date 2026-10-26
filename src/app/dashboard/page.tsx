// import Link from "next/link";
// import { getCustomers } from "@/lib/customers";
// export type Customer = {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
// };
// export default async function DashboardPage() {
//   const customers = await getCustomers();
//   const stats = [
//     {
//       title: "Total Customers",
//       value: customers.length,
//     },
//     {
//       title: "Active Deals",
//       value: "35",
//     },
//     {
//       title: "Revenue",
//       value: "$12,500",
//     },
//   ];

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Dashboard Overview
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Welcome to ClientFlow CRM
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {stats.map((stat) => (
//           <div
//             key={stat.title}
//             className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
//           >
//             <p className="text-gray-500">
//               {stat.title}
//             </p>

//             <h2 className="text-3xl font-bold mt-3 text-gray-900">
//               {stat.value}
//             </h2>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
//         <h2 className="text-xl font-semibold mb-3">
//           Customer Management
//         </h2>

//         <p className="text-gray-500 mb-4">
//           Manage your customers and deals.
//         </p>

//         <Link
//           href="/dashboard/customers"
//           className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
//         >
//           View Customers
//         </Link>
//       </div>
//     </div>
//   );
// }
import Link from "next/link";
import { connection } from "next/server";
import { getDashboardData } from "@/lib/dashboard";
import CustomersChart from "@/components/dashboard/CustomersChart";
import { getWeeklyCustomers } from "@/lib/dashboard-chart";

export default async function DashboardPage() {
  await connection();

  const [dashboardData, chartData] = await Promise.all([
  getDashboardData(),
  getWeeklyCustomers(),
]);

const {
  totalCustomers,
  newCustomers,
  totalCompanies,
  recentCustomers,
} = dashboardData;

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
    },
    {
      title: "New Customers (7d)",
      value: newCustomers,
    },
    {
      title: "Total Companies",
      value: totalCompanies,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to ClientFlow CRM
        </p>
      </div>

      {/* STATS */}
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
          {/* CUSTOMER GROWTH CHART */}
<CustomersChart data={chartData} />
      {/* RECENT CUSTOMERS */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Customers
          </h2>

          <Link
            href="/dashboard/customers"
            className="text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentCustomers.map((customer) => (
            <Link
              key={customer.id}
              href={`/dashboard/customers/${customer.id}`}
              className="flex items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {customer.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {customer.email}
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {customer.company}
              </span>
            </Link>
          ))}

          {recentCustomers.length === 0 && (
            <p className="text-gray-500">
              No customers yet.
            </p>
          )}
        </div>
      </div>

      {/* ADD CUSTOMER */}
      <Link
        href="/dashboard/customers/new"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        + Add New Customer
      </Link>
    </div>
  );
}