import pool from "@/lib/db";

export type ChartPoint = {
  day: string;
  customers: number;
};

export async function getWeeklyCustomers(): Promise<ChartPoint[]> {
  const result = await pool.query<ChartPoint>(`
    SELECT
      TO_CHAR(days.day, 'DD Mon') AS day,
      COUNT(c.id)::int AS customers

    FROM generate_series(
      (CURRENT_DATE - INTERVAL '6 days')::timestamp,
      CURRENT_DATE::timestamp,
      INTERVAL '1 day'
    ) AS days(day)

    LEFT JOIN customers c
      ON c.created_at >= days.day
      AND c.created_at < days.day + INTERVAL '1 day'

    GROUP BY days.day
    ORDER BY days.day ASC
  `);

  return result.rows;
}