import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import UserAvatar from "@/components/profile/UserAvatar";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Navbar() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <header className="min-h-16 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        {user.role === "admin" && (
          <Link
            href="/dashboard/admin/users"
            className="text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg"
          >
            Admin Users
          </Link>
        )}

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2"
        >
          <UserAvatar
            name={user.name}
            avatarVersion={user.avatarVersion}
          />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {user.name}
            </p>

            <p className="text-xs text-gray-500">
              {user.role === "admin" ? "Admin" : "My Profile"}
            </p>
          </div>
        </Link>

        <LogoutButton />
      </div>
    </header>
  );
}