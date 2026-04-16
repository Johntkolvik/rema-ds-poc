import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRY Design System — POC",
  description: "REMA responsive variable POC with Tailwind 4 + Code Connect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
