import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type Props = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: Props) {
  const { token, error } = await searchParams;

  if (!token || error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid or Expired Link
          </h1>

          <p className="text-gray-600">
            Parolni tiklash havolasi yaroqsiz
            yoki muddati tugagan.
          </p>

          <Link
            href="/forgot-password"
            className="block text-blue-600 hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}