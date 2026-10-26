import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export async function requireUserId(): Promise<string> {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session.user.id;
}