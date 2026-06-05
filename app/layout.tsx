import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Who Sold Slab — Diamond Hands vs Paper Hands",
  description:
    "Track every SlabDrop winner and see who sold the slab they won versus who's still holding.",
  openGraph: {
    title: "Who Sold Slab",
    description:
      "Who flipped the slab they won, and who's still holding? Live winner tracking for SlabDrop.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Sold Slab",
    description:
      "Who flipped the slab they won, and who's still holding? Live winner tracking for SlabDrop.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
