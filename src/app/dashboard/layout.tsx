// import type { ReactNode } from "react";
// import { redirect } from "next/navigation";

// import { getCurrentUser } from "@/lib/current-user";

// import Sidebar from "@/components/layout/Sidebar";
// import MobileSidebar from "@/components/layout/MobileSidebar";
// import Navbar from "@/components/layout/Navbar";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   const isAdmin = user.role === "admin";

//   return (
//     <div className="min-h-dvh bg-gray-100 md:flex">
//       {/* DESKTOP SIDEBAR */}
//       <div className="sticky top-0 hidden h-dvh w-64 shrink-0 self-start md:block">
//         <Sidebar isAdmin={isAdmin} />
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="min-w-0 flex-1">
//         {/* MOBILE SIDEBAR */}
//         <MobileSidebar isAdmin={isAdmin} />

//         {/* NAVBAR */}
//         <Navbar />

//         {/* PAGE CONTENT */}
//         <main className="min-h-[calc(100dvh-64px)] p-4 sm:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-dvh bg-gray-100 md:flex">
      {/* DESKTOP SIDEBAR */}
      <div className="sticky top-0 hidden h-dvh w-64 shrink-0 self-start md:block">
        <Sidebar isAdmin={isAdmin} />
      </div>

      {/* MAIN */}
      <div className="min-w-0 flex-1">
        <MobileSidebar isAdmin={isAdmin} />

        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}