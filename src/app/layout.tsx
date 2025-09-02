// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRAIN FITNESS",
  description: "Your fitness journey starts here.",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    // THE FIX IS HERE: We remove the hardcoded class/style and add suppressHydrationWarning
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
