import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KinKeep · Family health companion",
  description: "A calm, multilingual health companion for older adults and their families.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
