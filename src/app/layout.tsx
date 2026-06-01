import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://vietnam-culture-lens.vercel.app"
  ),
  title: "Vietnam Culture Lens — Lật Văn Hóa",
  description:
    "Explore Vietnamese culture through proverbs, words, beliefs, and customs, interpreted through four scholarly lenses.",
  openGraph: {
    title: "Vietnam Culture Lens — Lật Văn Hóa",
    description: "Explore Vietnamese culture through four scholarly lenses.",
    locale: "vi_VN",
    type: "website",
    siteName: "Vietnam Culture Lens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
