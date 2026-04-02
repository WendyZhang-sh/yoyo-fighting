import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Grammar Friends 语法小伙伴",
  description: "帮助小学生快乐学习英语语法",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
