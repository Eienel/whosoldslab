import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Who Sold Slab",
  description:
    "Live tracker for SlabDrop winners: the real cards won, their value, and who's holding versus who sold.",
  openGraph: {
    title: "Who Sold Slab",
    description:
      "Live tracker for SlabDrop winners: who's holding the slab they won, who sold it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Sold Slab",
    description:
      "Live tracker for SlabDrop winners: who's holding the slab they won, who sold it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
