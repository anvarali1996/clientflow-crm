import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/customers";
import EditCustomerForm from "@/components/customers/EditCustomerForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Edit Customer
      </h1>

      <EditCustomerForm customer={customer} />
    </div>
  );
}