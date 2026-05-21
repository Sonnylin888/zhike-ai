import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 教学助手 MVP",
  description: "面向未来课堂演示的 AI 教学方案生成工具"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
