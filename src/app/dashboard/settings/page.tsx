import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

import AccountSettingsForm from "@/components/settings/AccountSettingsForm";
import AvatarUploadForm from "@/components/settings/AvatarUploadForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account settings here.
        </p>
      </div>

      {/* PROFILE PHOTO */}
      <AvatarUploadForm
        name={user.name}
        avatarVersion={user.avatarVersion}
      />

      {/* NAME, EMAIL, PASSWORD */}
      <AccountSettingsForm
        initialName={user.name}
        email={user.email}
        role={user.role}
      />
    </div>
  );
}