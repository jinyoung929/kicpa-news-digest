import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { getDigestDates } from "@/lib/data";
import "./globals.css";

const SIDEBAR_DATE_COUNT = 4; // 최신 1건 + 과거 3일

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPA뉴스 데일리 다이제스트",
  description: "매일 오전 10시, CPA뉴스의 새 기사를 제목과 요약으로 정리해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dates = getDigestDates().slice(0, SIDEBAR_DATE_COUNT);

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-zinc-50 dark:bg-black">
        {dates.length > 0 && <Sidebar dates={dates} />}
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
