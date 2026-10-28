import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import UserAvatar from "@/components/profile/UserAvatar";
export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const initial =
    user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Account information
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 h-28" />

        <div className="px-6 pb-8">
          <div className="-mt-10 mb-5 relative w-fit rounded-full border-4 border-white shadow">
  <UserAvatar
    name={user.name}
    avatarVersion={user.avatarVersion}
    size="lg"
  />
</div>

          <h2 className="text-2xl font-bold text-gray-900">
            {user.name}
          </h2>

          <p className="text-gray-500 mt-1">
            {user.email}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Full Name
              </p>
              <p className="font-semibold text-gray-900 mt-1">
                {user.name}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Email Address
              </p>
              <p className="font-semibold text-gray-900 mt-1 break-all">
                {user.email}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Account Role
              </p>

              <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {user.role === "admin" ? "Administrator" : "User"}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Member Since
              </p>
              <p className="font-semibold text-gray-900 mt-1">
                {new Date(user.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>

            {user.role === "admin" && (
              <Link
                href="/dashboard/admin/users"
                className="border border-gray-300 px-5 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Manage Users
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}