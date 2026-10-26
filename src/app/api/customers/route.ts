import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "@/lib/session";

export const runtime = "nodejs";

// ========================================
// GET - faqat login qilgan user mijozlari
// ========================================

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, company
       FROM customers
       WHERE user_id = $1
       ORDER BY id DESC`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET customers error:", error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// ========================================
// POST - yangi customer qo'shish
// ========================================

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  let body: Record<string, unknown>;

  try {
    const data: unknown = await request.json();

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data)
    ) {
      throw new Error("Invalid body");
    }

    body = data as Record<string, unknown>;
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
    typeof company !== "string"
  ) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone.trim();
  const cleanCompany = company.trim();

  if (
    !cleanName ||
    !cleanEmail ||
    !cleanPhone ||
    !cleanCompany ||
    cleanName.length > 100 ||
    cleanEmail.length > 150 ||
    cleanPhone.length > 30 ||
    cleanCompany.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
  ) {
    return NextResponse.json(
      { message: "Invalid customer information" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers
       (name, email, phone, company, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, company`,
      [
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanCompany,
        userId,
      ]
    );

    return NextResponse.json(result.rows[0], {
      status: 201,
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { message: "This email already exists" },
        { status: 409 }
      );
    }

    console.error("POST customers error:", error);

    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    );
  }
}