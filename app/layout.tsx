import type { Metadata } from "next";
import "./globals.css";

const title = "KinKeep · Family health companion";
const description = "A calm, multilingual health companion for older adults and the families who coordinate their care.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kinkeep-family-health.leini9591.chatgpt.site"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "KinKeep family care, clearly coordinated" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
