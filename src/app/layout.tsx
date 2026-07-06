import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mafia - Social Deduction Game",
  description: "A single-device, offline-capable Mafia party game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-accent-red selection:text-white`}
      >
        <main className="max-w-md mx-auto min-h-screen relative overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
