import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Advanced Web Technologies Semester Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <nav className="max-w-4xl mx-auto p-4 flex gap-6 font-medium">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/courses" className="hover:text-blue-600 transition">
              Courses
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/filter" className="hover:text-blue-600 transition">
              Filter
            </Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto p-6 flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}