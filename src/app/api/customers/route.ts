import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCustomers } from "@/lib/customers";

export const runtime = "nodejs";

// GET - barcha mijozlarni olish
export async function GET() {
  try {
    const customers = await getCustomers();

    return NextResponse.json(customers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST - yangi mijoz qo'shish
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Invalid body");
    }
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, email, phone, company } = body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof company !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !company.trim()
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  if (
    name.length > 100 ||
    email.length > 150 ||
    phone.length > 30 ||
    company.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { message: "Invalid customer information" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers (name, email, phone, company)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, company`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        company.trim(),
      ]
    );

    return NextResponse.json(result.rows[0], {
      status: 201,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { message: "This email already exists" },
        { status: 409 }
      );
    }

    console.error("Database error:", error);

    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    );
  }
}