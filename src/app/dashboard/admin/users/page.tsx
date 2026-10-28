import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";

const PAGE_SIZE = 10;

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  customerCount: number;
};

type Totals = {
  totalUsers: number;
  totalCustomers: number;
};

export default async function AdminUsersPage({
  searchParams,
}: Props) {
  // AUTHORIZATION
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    notFound();
  }

  // SEARCH & PAGINATION
  const params = await searchParams;

  const search = (params.search ?? "").trim().slice(0, 100);
  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const searchValue = `%${search}%`;

  // TOTAL STATISTICS
  const totalsResult = await pool.query<Totals>(`
    SELECT
      (SELECT COUNT(*)::int FROM "user") AS "totalUsers",
      (SELECT COUNT(*)::int FROM customers) AS "totalCustomers"
  `);

  const totals = totalsResult.rows[0];

  // SEARCH RESULTS COUNT
  const countResult = await pool.query<{ total: number }>(
    `
    SELECT COUNT(*)::int AS total
    FROM "user"
    WHERE name ILIKE $1
       OR email ILIKE $1
    `,
    [searchValue]
  );

  const totalResults = countResult.rows[0].total;
  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;

  // PAGINATED USERS
  const usersResult = await pool.query<AdminUser>(
    `
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

    WHERE u.name ILIKE $1
       OR u.email ILIKE $1

    GROUP BY
      u.id,
      u.name,
      u.email,
      u.role,
      u."createdAt"

    ORDER BY u."createdAt" DESC, u.id DESC

    LIMIT $2 OFFSET $3
    `,
    [searchValue, PAGE_SIZE, offset]
  );

  const users = usersResult.rows;

  function getPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    query.set("page", String(nextPage));

    return `/dashboard/admin/users?${query.toString()}`;
  }

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
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Total Users</p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900">
            {totals.totalUsers}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-gray-500">Total Customers</p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900">
            {totals.totalCustomers}
          </h2>
        </div>
      </div>

      {/* USERS */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Registered Users
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {totalResults} users found
            </p>
          </div>

          {/* SEARCH */}
          <form
            action="/dashboard/admin/users"
            method="GET"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="search"
              name="search"
              defaultValue={search}
              maxLength={100}
              placeholder="Search by name or email..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Search
            </button>

            <Link
              href="/dashboard/admin/users"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-center hover:bg-gray-50"
            >
              Reset
            </Link>
          </form>
        </div>

        {/* TABLE */}
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
  <Link
    href={`/dashboard/admin/users/${encodeURIComponent(user.id)}`}
    className="flex items-center gap-3 group"
  >
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
      {user.name.charAt(0).toUpperCase()}
    </div>

    <span className="font-medium text-gray-900 group-hover:text-blue-600">
      {user.name}
    </span>
  </Link>
</td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between gap-4 p-6 border-t">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            {currentPage > 1 ? (
              <Link
                href={getPageUrl(currentPage - 1)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Link>
            ) : (
              <span className="px-4 py-2 border rounded-lg text-gray-400">
                Previous
              </span>
            )}

            {currentPage < totalPages ? (
              <Link
                href={getPageUrl(currentPage + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg">
                Next
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}