import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { after } from "next/server";
import pool from "@/lib/db";

export const auth = betterAuth({
  database: pool,

  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,

    // Reset havolasi 1 soat amal qiladi
    resetPasswordTokenExpiresIn: 3600,

    // Parol o'zgarsa, eski sessiyalarni tugatadi
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      // HTTP javobdan keyin email yuboramiz
      after(async () => {
        try {
          const apiKey = process.env.RESEND_API_KEY;
          const from = process.env.RESEND_FROM_EMAIL;

          if (!apiKey || !from) {
            console.error(
              "Reset email configuration is missing"
            );
            return;
          }

          const resend = new Resend(apiKey);

          const { error } = await resend.emails.send({
            from,
            to: user.email,

            subject: "ClientFlow - Reset Your Password",

            text: `
                Salom!

                ClientFlow accountingiz uchun parolni
                tiklash so'rovi yuborildi.

                Parolni tiklash havolasi:

                ${url}

                Bu havola 1 soat amal qiladi.

                Agar bu so'rovni siz yubormagan
                bo'lsangiz, emailni e'tiborsiz qoldiring.
            `.trim(),
          });

          if (error) {
            console.error(
              "Resend email failed:",
              error.message
            );
          }
            } catch (error) {
          console.error(
            "Reset email error:",
            error instanceof Error
              ? error.message
              : "Unknown error"
          );
          }
      });
    },
  },
});
