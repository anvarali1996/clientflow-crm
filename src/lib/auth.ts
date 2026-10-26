import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { after } from "next/server";
import pool from "@/lib/db";

export const auth = betterAuth({
  database: pool,

  emailAndPassword: {
    enabled: true,

    // Reset link 1 soat amal qiladi
    resetPasswordTokenExpiresIn: 3600,

    // Parol o'zgarsa, eski sessiyalar tugaydi
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      after(async () => {
        try {
          const apiKey = process.env.RESEND_API_KEY;

          if (!apiKey) {
            console.error("RESEND_API_KEY topilmadi");
            return;
          }

          const resend = new Resend(apiKey);

          const { error } = await resend.emails.send({
            from:
              process.env.RESEND_FROM_EMAIL ||
              "ClientFlow <onboarding@resend.dev>",

            to: user.email,

            subject: "ClientFlow - Reset your password",

            text: `
Salom!

ClientFlow parolingizni tiklash uchun
quyidagi havolani oching:

${url}

Havola 1 soat amal qiladi.

Agar bu so'rovni siz yubormagan
bo'lsangiz, emailni e'tiborsiz qoldiring.
            `,
          });

          if (error) {
            console.error(
              "Reset email yuborilmadi:",
              error.message
            );
          }
        } catch (error) {
          console.error(
            "Email service error:",
            error instanceof Error
              ? error.message
              : "Unknown error"
          );
        }
      });
    },
  },
});