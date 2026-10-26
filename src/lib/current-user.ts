import pool from "@/lib/db";
import { getServerSession } from "@/lib/session";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  avatarVersion: string | null;
};

export async function getCurrentUser(): Promise<AppUser | null> {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  const result = await pool.query<AppUser>(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.image,
       u.role,
       u."createdAt",

       CASE
         WHEN a.user_id IS NOT NULL
         THEN (
           EXTRACT(EPOCH FROM a.updated_at) * 1000
         )::bigint::text
         ELSE NULL
       END AS "avatarVersion"

     FROM "user" AS u

     LEFT JOIN user_avatars AS a
       ON a.user_id = u.id

     WHERE u.id = $1
     LIMIT 1`,
    [session.user.id]
  );

  return result.rows[0] ?? null;
}