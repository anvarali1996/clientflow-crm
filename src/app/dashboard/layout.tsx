import type { ReactNode } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0 bg-gray-100">
        <Navbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}