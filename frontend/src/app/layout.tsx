import type { Metadata } from "next";
import { Fira_Code, Lora, Outfit } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const outfit = Outfit({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-geist-serif",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookShore",
    template: "%s | BookShore",
  },
  description:
    "A modern AI-powered bookstore with curated discovery, role-based operations, and production-focused shopping flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${lora.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="app-shell min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
