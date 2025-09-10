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
  title: "Fibroid Care at Holy Name",
  description: "Experience personalized, multidisciplinary care with cutting-edge treatments and digital health solutions. Your journey to better health starts here.",
  keywords: ["fibroid treatment", "Holy Name Medical Center", "gynecology", "women's health", "minimally invasive surgery"],
  authors: [{ name: "Holy Name Medical Center" }],
  openGraph: {
    title: "Comprehensive Fibroid Care at Holy Name",
    description: "Experience personalized, multidisciplinary care with cutting-edge treatments and digital health solutions. Your journey to better health starts here.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comprehensive Fibroid Care at Holy Name",
    description: "Experience personalized, multidisciplinary care with cutting-edge treatments and digital health solutions. Your journey to better health starts here.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
