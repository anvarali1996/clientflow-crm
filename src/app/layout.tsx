import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3500}
        />
      </body>
    </html>
  );
}