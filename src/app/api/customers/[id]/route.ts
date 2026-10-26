import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

// ID ni tekshirish
function parseId(id: string): number | null {
  if (!/^[1-9]\d*$/.test(id)) return null;

  const number = Number(id);

  return Number.isSafeInteger(number) ? number : null;
}

// ===================================
// PUT - CUSTOMER UPDATE
// ===================================

export async function PUT(
  request: Request,
  { params }: Context
) {
  const { id } = await params;
  const customerId = parseId(id);

  if (customerId === null) {
    return NextResponse.json(
      { message: "Invalid customer ID" },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;

  try {
    const parsed: unknown = await request.json();

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      throw new Error("Invalid body");
    }

    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON data" },
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

  const values = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    company: company.trim(),
  };

  if (
    !values.name ||
    !values.phone ||
    !values.company ||
    values.name.length > 100 ||
    values.email.length > 150 ||
    values.phone.length > 30 ||
    values.company.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    return NextResponse.json(
      { message: "Invalid customer data" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `UPDATE customers
       SET
         name = $1,
         email = $2,
         phone = $3,
         company = $4
       WHERE id = $5
       RETURNING *`,
      [
        values.name,
        values.email,
        values.phone,
        values.company,
        customerId,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Customer updated successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    console.error("UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// ===================================
// DELETE - CUSTOMER DELETE
// ===================================

export async function DELETE(
  _request: Request,
  { params }: Context
) {
  const { id } = await params;
  const customerId = parseId(id);

  if (customerId === null) {
    return NextResponse.json(
      { message: "Invalid customer ID" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `DELETE FROM customers
       WHERE id = $1
       RETURNING id`,
      [customerId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Customer deleted successfully",
        deletedId: customerId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete customer" },
      { status: 500 }
    );
  }
}