import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { after } from "next/server";
import pool from "@/lib/db";

export const auth = betterAuth({
  database: pool,

  baseURL: process.env.BETTER_AUTH_URL,
  rateLimit: {
  enabled: true,
  storage: "database",

  window: 60,
  max: 60,

  customRules: {
    "/sign-in/email": {
      window: 60,
      max: 5,
    },

    "/sign-up/email": {
      window: 600,
      max: 3,
    },

    "/request-password-reset": {
      window: 900,
      max: 3,
    },

    "/reset-password": {
      window: 300,
      max: 5,
    },
  },
},
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
We received a request to reset the password for your
ClientFlow account.

To reset your password, please click the link below:

${url}

This link will expire in 1 hour.

If you did not request a password reset,
you can safely ignore this email.

Best regards,
The ClientFlow Team
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

