import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 p-6 text-white">
      <h1 className="text-2xl font-bold mb-10">
        ClientFlow
      </h1>

      <nav className="flex flex-col gap-5">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/dashboard/customers">
          Customers
        </Link>

        <Link href="/dashboard/deals">
          Deals
        </Link>

        <Link href="/dashboard/settings">
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;