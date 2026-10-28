// import Link from "next/link";
// import { getCustomers } from "@/lib/customers";

// export default async function CustomersPage() {
//   const customers = await getCustomers();

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Customers
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Total customers: {customers.length}
//           </p>
//         </div>

//         <Link
//           href="/dashboard/customers/new"
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
//         >
//           + Add Customer
//         </Link>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-4">Name</th>
//               <th className="p-4">Email</th>
//               <th className="p-4">Company</th>
//               <th className="p-4">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {customers.map((customer) => (
//               <tr
//                 key={customer.id}
//                 className="border-t border-gray-200"
//               >
//                 <td className="p-4 text-gray-900">
//                   {customer.name}
//                 </td>

//                 <td className="p-4 text-gray-600">
//                   {customer.email}
//                 </td>

//                 <td className="p-4 text-gray-600">
//                   {customer.company.name}
//                 </td>

//                 <td className="p-4">
//                   <Link
//                     href={`/dashboard/customers/${customer.id}`}
//                     className="text-blue-600 hover:underline"
//                   >
//                     View Details
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import { getCustomers } from "@/lib/customers";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-center"
        >
          + Add Customer
        </Link>
      </div>

      {/* EMPTY STATE OR CUSTOMERS TABLE */}
      {customers.length === 0 ? (
        <EmptyState
          title="No Customers Yet"
          description="You haven't added any customers yet. Add your first customer to get started."
          actionHref="/dashboard/customers/new"
          actionLabel="+ Add Customer"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-left">
              <thead className="bg-gray-100">
                <tr className="text-gray-700">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {customer.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {customer.email}
                    </td>

                    <td className="p-4 text-gray-600">
                      {customer.phone}
                    </td>

                    <td className="p-4 text-gray-600">
                      {customer.company}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="text-blue-600 hover:underline font-medium"
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
      )}
    </div>
  );
}