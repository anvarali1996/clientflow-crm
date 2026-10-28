"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isAdmin: boolean;
};

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: "👥",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: "👤",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "⚙️",
  },
];

export default function Sidebar({ isAdmin }: Props) {
  const pathname = usePathname();

  const navigation = isAdmin
    ? [
        ...links,
        {
          label: "Admin Users",
          href: "/dashboard/admin/users",
          icon: "🛡️",
        },
      ]
    : links;

  return (
    <aside className="flex h-full w-64 flex-col overflow-y-auto bg-slate-900 text-white">
      {/* LOGO */}
      <div className="border-b border-slate-800 px-6 py-7">
        <Link
          href="/dashboard"
          className="text-2xl font-bold tracking-tight text-white"
        >
          Client<span className="text-blue-400">Flow</span>
        </Link>

        <p className="mt-1 text-xs text-slate-400">
          Customer Management
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {link.icon}
              </span>

              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-800 px-6 py-5">
        <p className="text-xs text-slate-400">
          ClientFlow CRM
        </p>

        <p className="mt-1 text-xs text-slate-500">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </aside>
  );
}