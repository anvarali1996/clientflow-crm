import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "@/lib/session";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Faylning haqiqiy formatini tekshiramiz
function detectMime(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71 &&
    bytes[4] === 13 &&
    bytes[5] === 10 &&
    bytes[6] === 26 &&
    bytes[7] === 10
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

// CSRF himoyasi: so'rov shu saytimizdan kelishi kerak
function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");

  const siteOrigin = new URL(
    process.env.BETTER_AUTH_URL ?? request.url
  ).origin;

  return origin === siteOrigin;
}

// GET — faqat login qilgan odamning rasmi
export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  }

  try {
    const result = await pool.query<{
      data: Buffer;
      mime_type: string;
    }>(
      `SELECT data, mime_type
       FROM user_avatars
       WHERE user_id = $1`,
      [session.user.id]
    );

    if (result.rows.length === 0) {
      return new Response(null, {
        status: 404,
        headers: { "Cache-Control": "private, no-store" },
      });
    }

    const avatar = result.rows[0];

    return new Response(new Uint8Array(avatar.data), {
      status: 200,
      headers: {
        "Content-Type": avatar.mime_type,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("AVATAR GET ERROR:", error);

    return NextResponse.json(
      { message: "Failed to load avatar" },
      { status: 500 }
    );
  }
}

// POST — avatar yuklash yoki almashtirish
export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { message: "Forbidden origin" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Rasm tanlanmagan" },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Rasm hajmi 2 MB dan oshmasin" },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const actualMime = detectMime(bytes);

    if (
      !actualMime ||
      file.type !== actualMime
    ) {
      return NextResponse.json(
        { message: "Faqat JPG, PNG yoki WebP rasm yuklang" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO user_avatars
       (user_id, data, mime_type, updated_at)
       VALUES ($1, $2, $3, NOW())

       ON CONFLICT (user_id)
       DO UPDATE SET
         data = EXCLUDED.data,
         mime_type = EXCLUDED.mime_type,
         updated_at = NOW()`,
      [
        session.user.id,
        Buffer.from(bytes),
        actualMime,
      ]
    );

    return NextResponse.json({
      message: "Avatar updated successfully",
    });
  } catch (error) {
    console.error("AVATAR POST ERROR:", error);

    return NextResponse.json(
      { message: "Avatar upload failed" },
      { status: 500 }
    );
  }
}

// DELETE — avatarni o'chirish
export async function DELETE(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { message: "Forbidden origin" },
      { status: 403 }
    );
  }

  try {
    await pool.query(
      `DELETE FROM user_avatars
       WHERE user_id = $1`,
      [session.user.id]
    );

    return NextResponse.json({
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    console.error("AVATAR DELETE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}