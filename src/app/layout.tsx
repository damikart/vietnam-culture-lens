import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://lat-van-hoa.vercel.app"
  ),
  title: "Lật Văn Hóa — Khám phá chiều sâu văn hóa Việt Nam",
  description:
    "Chọn một câu tục ngữ, từ ngữ, hay tín ngưỡng quen thuộc — rồi xem nó được bóc lớp bởi 4 học giả từ 4 góc nhìn khác nhau.",
  openGraph: {
    title: "Lật Văn Hóa",
    description: "Khám phá chiều sâu ẩn trong văn hóa Việt Nam",
    locale: "vi_VN",
    type: "website",
    siteName: "Lật Văn Hóa",
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
