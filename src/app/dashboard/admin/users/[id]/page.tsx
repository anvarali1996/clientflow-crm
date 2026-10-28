import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

type Props = {
  params: Promise<{ id: string }>;
};

type UserDetails = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  customerCount: number;
};

export default async function AdminUserDetailsPage({
  params,
}: Props) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    notFound();
  }

  const { id } = await params;

  const result = await pool.query<UserDetails>(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u."emailVerified",
      u."createdAt",
      (
        SELECT COUNT(*)::int
        FROM customers c
        WHERE c.user_id = u.id
      ) AS "customerCount"
    FROM "user" u
    WHERE u.id = $1
    LIMIT 1
    `,
    [id]
  );

  const user = result.rows[0];

  if (!user) {
    notFound();
  }

  const initial =
    user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/admin/users"
        className="text-blue-600 hover:underline"
      >
        ← Back to Users
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          User Details
        </h1>

        <p className="text-gray-500 mt-2">
          View registered user information
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="p-6 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold flex items-center justify-center">
              {initial}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h2>

              <p className="text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              label="Full Name"
              value={user.name}
            />

            <InfoCard
              label="Email Address"
              value={user.email}
            />

            <InfoCard
              label="Account Role"
              value={
                user.role === "admin"
                  ? "Administrator"
                  : "User"
              }
            />

            <InfoCard
              label="Email Status"
              value={
                user.emailVerified
                  ? "Verified"
                  : "Not Verified"
              }
            />

            <InfoCard
              label="Total Customers"
              value={String(user.customerCount)}
            />

            <InfoCard
              label="Joined Date"
              value={new Date(
                user.createdAt
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold text-gray-900 mt-2 break-words">
        {value}
      </p>
    </div>
  );
}