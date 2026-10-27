import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-slate-900 text-white p-6">
      <Link href={"/"}>
      <h1 className="text-2xl font-bold mb-8">
        ClientFlow
      </h1>
    </Link>
      <nav className="flex md:flex-col gap-5 overflow-x-auto text-sm md:text-base">
        <Link
          href="/dashboard"
          className="hover:text-blue-400 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/customers"
          className="hover:text-blue-400 transition"
        >
          Customers
        </Link>

        <Link
          href="/dashboard/deals"
          className="hover:text-blue-400 transition"
        >
          Deals
        </Link>

        <Link
          href="/dashboard/settings"
          className="hover:text-blue-400 transition"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}