import pool from "@/lib/db";
import { requireUserId } from "@/lib/require-user";

export type ChartPoint = {
  day: string;
  customers: number;
};

export async function getWeeklyCustomers(): Promise<ChartPoint[]> {
  // Hozir login qilgan user ID
  const userId = await requireUserId();

  const result = await pool.query<ChartPoint>(
    `
    SELECT
      TO_CHAR(days.day, 'DD Mon') AS day,
      COUNT(c.id)::int AS customers

    FROM generate_series(
      (CURRENT_DATE - INTERVAL '6 days')::timestamp,
      CURRENT_DATE::timestamp,
      INTERVAL '1 day'
    ) AS days(day)

    LEFT JOIN customers AS c
      ON c.user_id = $1
      AND c.created_at >= days.day
      AND c.created_at < days.day + INTERVAL '1 day'

    GROUP BY days.day
    ORDER BY days.day ASC
    `,
    [userId]
  );

  return result.rows;
}