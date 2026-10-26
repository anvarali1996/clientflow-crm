import pool from "@/lib/db";
import { requireUserId } from "@/lib/require-user";

type DashboardStats = {
  total_customers: string;
  new_customers: string;
  total_companies: string;
};

type RecentCustomer = {
  id: number;
  name: string;
  email: string;
  company: string;
};

export async function getDashboardData() {
  // Login qilgan foydalanuvchining ID'si
  const userId = await requireUserId();

  // 1. Dashboard statistikasi
  const statsResult = await pool.query<DashboardStats>(
    `
    SELECT
      COUNT(*) AS total_customers,

      COUNT(*) FILTER (
        WHERE created_at >= NOW() - INTERVAL '7 days'
      ) AS new_customers,

      COUNT(DISTINCT company) AS total_companies

    FROM customers
    WHERE user_id = $1
    `,
    [userId]
  );

  // 2. Oxirgi 5 ta customer
  const customersResult = await pool.query<RecentCustomer>(
    `
    SELECT id, name, email, company
    FROM customers
    WHERE user_id = $1
    ORDER BY created_at DESC, id DESC
    LIMIT 5
    `,
    [userId]
  );

  const stats = statsResult.rows[0];

  return {
    totalCustomers: Number(stats.total_customers),
    newCustomers: Number(stats.new_customers),
    totalCompanies: Number(stats.total_companies),
    recentCustomers: customersResult.rows,
  };
}