import pool from "@/lib/db";
import { requireUserId } from "@/lib/require-user";

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export async function getCustomers(): Promise<Customer[]> {
  const userId = await requireUserId();

  const result = await pool.query<Customer>(
    `SELECT id, name, email, phone, company
     FROM customers
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  );

  return result.rows;
}

export async function getCustomer(
  id: string
): Promise<Customer | null> {
  const userId = await requireUserId();
  const customerId = Number(id);

  if (
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(customerId)
  ) {
    return null;
  }

  const result = await pool.query<Customer>(
    `SELECT id, name, email, phone, company
     FROM customers
     WHERE id = $1 AND user_id = $2`,
    [customerId, userId]
  );

  return result.rows[0] ?? null;
}