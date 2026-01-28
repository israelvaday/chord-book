import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎸 Free Chord Book - 654K+ Guitar Tabs & Chords",
  description: "Search 654,000+ guitar tabs and chords. Free chord diagrams, transpose, and auto-scroll features. Find any song instantly!",
  keywords: "guitar tabs, chords, guitar chords, song lyrics, chord diagrams, transpose",
  openGraph: {
    title: "🎸 Free Chord Book",
    description: "654K+ Guitar Tabs & Chords - Free!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
