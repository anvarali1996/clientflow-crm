import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY id DESC"
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}