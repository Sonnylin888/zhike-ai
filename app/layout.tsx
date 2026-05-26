import type { Metadata, Viewport } from "next";
import { ErrorFallback } from "@/components/ErrorFallback";
import "./globals.css";

export const metadata: Metadata = {
  title: "智课",
  description: "Web First 的 AI 教学课堂演示系统",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#020617"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorFallback>{children}</ErrorFallback>
      </body>
    </html>
  );
}
