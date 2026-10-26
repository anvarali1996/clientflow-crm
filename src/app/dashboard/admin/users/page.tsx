import { notFound, redirect } from "next/navigation";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  customerCount: number;
};

export default async function AdminUsersPage() {
  // 1. Login va rolni serverda tekshiramiz
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    notFound();
  }

  // 2. Barcha foydalanuvchilarni olish
  const result = await pool.query<AdminUserRow>(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u."createdAt",
      COUNT(c.id)::int AS "customerCount"
    FROM "user" AS u
    LEFT JOIN customers AS c
      ON c.user_id = u.id
    GROUP BY
      u.id,
      u.name,
      u.email,
      u.role,
      u."createdAt"
    ORDER BY u."createdAt" DESC
  `);

  const users = result.rows;

  const totalUsers = users.length;

  const totalCustomers = users.reduce(
    (sum, user) => sum + user.customerCount,
    0
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Panel
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and view registered users
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">
            Total Users
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {totalUsers}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">
            Total Customers
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {totalCustomers}
          </h2>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Registered Users
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            All ClientFlow accounts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Customers</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <span className="font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : "User"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {user.customerCount}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No registered users found.
          </p>
        )}
      </div>
    </div>
  );
}