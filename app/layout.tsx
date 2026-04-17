import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/shared/components/Header";
import { Logo } from "@/shared/components/Logo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Tasks Management",
  description: "Tasks Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="h-dvh min-h-svh flex flex-col overflow-hidden">
        <main className="flex flex-1 min-h-0 flex-col overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
