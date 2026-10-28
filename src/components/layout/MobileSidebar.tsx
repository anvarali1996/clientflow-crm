"use client";

import { useEffect, useState } from "react";
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

export default function MobileSidebar({
  isAdmin,
}: Props) {
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-slate-900"
        >
          Client<span className="text-blue-600">Flow</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* DARK BACKDROP */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          {/* SIDEBAR */}
          <aside
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute inset-y-0 left-0 flex h-dvh w-72 max-w-[85vw] flex-col overflow-y-auto bg-slate-900 text-white shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-6">
              <div>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-2xl font-bold"
                >
                  Client
                  <span className="text-blue-400">
                    Flow
                  </span>
                </Link>

                <p className="mt-1 text-xs text-slate-400">
                  Customer Management
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map((link) => {
                // Dashboard faqat /dashboard bo'lganda aktiv
                const active =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(
                      `${link.href}/`
                    ));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span
                      className="text-lg"
                      aria-hidden="true"
                    >
                      {link.icon}
                    </span>

                    <span>{link.label}</span>

                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* FOOTER */}
            <div className="border-t border-slate-800 px-6 py-5">
              <p className="text-sm font-semibold text-slate-300">
                ClientFlow CRM
              </p>

              <p className="mt-1 text-xs text-slate-500">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}