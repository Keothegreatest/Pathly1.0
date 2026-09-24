import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathly — Your Path, Made Clear",
  description: "Track your experiences, preserve meaningful moments, and prepare for your next chapter in healthcare.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

