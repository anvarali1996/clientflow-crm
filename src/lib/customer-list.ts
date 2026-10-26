import pool from "@/lib/db";
import { requireUserId } from "@/lib/require-user";
import type { Customer } from "@/lib/customers";

const PAGE_SIZE = 5;

type CustomerFilters = {
  search?: string;
  company?: string;
  page?: number;
};

export async function getPaginatedCustomers({
  search = "",
  company = "",
  page = 1,
}: CustomerFilters) {
  // 1. Login qilgan user ID
  const userId = await requireUserId();

  // 2. Search va filter qiymatlari
  const searchValue = `%${search.trim()}%`;
  const companyValue = `%${company.trim()}%`;

  // 3. Pagination
  const currentPage =
    Number.isSafeInteger(page) && page > 0 ? page : 1;

  const offset = (currentPage - 1) * PAGE_SIZE;

  // 4. Faqat shu userning customers
  const whereClause = `
    WHERE user_id = $1
      AND (name ILIKE $2 OR email ILIKE $2)
      AND company ILIKE $3
  `;

  // 5. Jami customerlar soni
  const countResult = await pool.query<{ total: string }>(
    `SELECT COUNT(*) AS total
     FROM customers
     ${whereClause}`,
    [userId, searchValue, companyValue]
  );

  const total = Number(countResult.rows[0].total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 6. Customerlar ro'yxati
  const result = await pool.query<Customer>(
    `SELECT id, name, email, phone, company
     FROM customers
     ${whereClause}
     ORDER BY id DESC
     LIMIT $4 OFFSET $5`,
    [
      userId,
      searchValue,
      companyValue,
      PAGE_SIZE,
      offset,
    ]
  );

  return {
    customers: result.rows,
    total,
    totalPages,
    currentPage,
  };
}