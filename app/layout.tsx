import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Football Nexus — The Operating System for Football Fans",
  description:
    "Live scores, fan sentiment, AI commentary, predictions, analytics, and football intelligence in one platform. Join the waitlist for the 2026 World Cup.",
  keywords: [
    "football",
    "soccer",
    "live scores",
    "AI commentary",
    "fan sentiment",
    "World Cup 2026",
    "football analytics",
    "football intelligence",
  ],
  openGraph: {
    title: "Football Nexus — The Operating System for Football Fans",
    description:
      "Live scores, fan sentiment, AI commentary, predictions, analytics, and football intelligence in one platform.",
    type: "website",
    siteName: "Football Nexus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Football Nexus — The Operating System for Football Fans",
    description:
      "Live scores, fan sentiment, AI commentary, predictions, analytics, and football intelligence in one platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050a0f] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
