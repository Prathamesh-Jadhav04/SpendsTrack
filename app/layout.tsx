import type { Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SpendsTracks",
  description: "A clean mobile-first expense tracking app UI."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
