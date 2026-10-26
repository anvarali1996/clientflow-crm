import pool from "@/lib/db";

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
  // Dashboard statistikalarini olish
  const statsResult = await pool.query<DashboardStats>(`
    SELECT
      COUNT(*) AS total_customers,

      COUNT(*) FILTER (
        WHERE created_at >= NOW() - INTERVAL '7 days'
      ) AS new_customers,

      COUNT(DISTINCT company) AS total_companies

    FROM customers
  `);

  // Oxirgi 5 ta mijozni olish
  const customersResult = await pool.query<RecentCustomer>(`
    SELECT id, name, email, company
    FROM customers
    ORDER BY created_at DESC, id DESC
    LIMIT 5
  `);

  const stats = statsResult.rows[0];

  return {
    totalCustomers: Number(stats.total_customers),
    newCustomers: Number(stats.new_customers),
    totalCompanies: Number(stats.total_companies),
    recentCustomers: customersResult.rows,
  };
}