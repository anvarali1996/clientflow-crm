// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { getCustomer } from "@/lib/customers";

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export default async function CustomerDetails({
//   params,
// }: Props) {
//   const { id } = await params;

//   const customer = await getCustomer(id);

//   if (!customer) {
//     notFound();
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">
//         Customer Details
//       </h1>

//       <div className="bg-white rounded-xl p-6 shadow-sm max-w-xl space-y-4">
//         <h2 className="text-2xl font-semibold">
//           {customer.name}
//         </h2>

//         <p>
//           <strong>Username:</strong> {customer.username}
//         </p>

//         <p>
//           <strong>Email:</strong> {customer.email}
//         </p>

//         <p>
//           <strong>Phone:</strong> {customer.phone}
//         </p>

//         <p>
//           <strong>Company:</strong> {customer.company.name}
//         </p>

//         <p>
//           <strong>Website:</strong> {customer.website}
//         </p>

//         <Link
//           href="/dashboard/customers"
//           className="inline-block mt-4 text-blue-600 hover:underline"
//         >
//           ← Back to Customers
//         </Link>
//       </div>
//     </div>
//   );
// }


import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/customers";
// import Link from "next/link";
import DeleteCustomerButton from "@/components/customers/DeleteCustomerButton";

export const dynamic = "force-dynamic";

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
    <div className="max-w-xl">
      <Link
        href="/dashboard/customers"
        className="text-blue-600"
      >
        ← Back to Customers
      </Link>

      <div className="bg-white p-6 rounded-xl mt-6">
        <h1 className="text-2xl font-bold mb-5">
          {customer.name}
        </h1>

        <div className="space-y-3 text-gray-700">
          <p>ID: {customer.id}</p>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p>Company: {customer.company}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
  <Link
    href={`/dashboard/customers/${customer.id}/edit`}
    className="bg-blue-600 text-white px-5 py-3 rounded-lg"
  >
    Edit Customer
  </Link>

  <DeleteCustomerButton id={customer.id} />
</div>
    </div>

  );
}