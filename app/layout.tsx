import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For My Valentine Lucia",
  description: "A special question for a special person",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
