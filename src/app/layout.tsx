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
  // Core SEO - Server-side rendered, non-changing
  title: {
    default: "Fibroid Care at Holy Name",
    template: "%s | HNMC Healthcare"
  },
  description: "Leading fibroid treatment center offering expert care and minimally invasive procedures. Comprehensive women's health services with cutting-edge technology.",
  keywords: ["fibroid treatment", "uterine fibroids", "women's health", "gynecology", "minimally invasive surgery", "Holy Name Medical Center"],
  authors: [{ name: "HNMC Healthcare" }],
  creator: "HNMC Healthcare",
  publisher: "HNMC Healthcare",

  // Core Open Graph - Basic structure
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HNMC Healthcare",
    title: "Fibroid Center - HNMC Healthcare ",
    description: "Leading fibroid treatment center offering expert care and minimally invasive procedures. Comprehensive women's health services with cutting-edge technology.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hnmchealthcare.com',
    images: [
      {
        url: "/hnmc_logo.jpg",
        width: 1200,
        height: 630,
        alt: "Fibroid Care at Holy Name",
      },
    ],
  },
  
  // Core Twitter - Basic structure  
  twitter: {
    title: "Fibroid Center - HNMC Healthcare ",
    description: "Leading fibroid treatment center offering expert care and minimally invasive procedures. Comprehensive women's health services with cutting-edge technology.",
    card: "summary_large_image",
    images: [
      {
        url: "/hnmc_logo.jpg",
        width: 1200,
        height: 630,
        alt: "Fibroid Care at Holy Name",
      },
    ],
    site: "HNMC Healthcare",
    creator: "HNMC Healthcare",
  },
  
  // Core robots and technical
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Core technical metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hnmchealthcare.com'),
  alternates: {
    canonical: '/',
  },
  applicationName: 'HNMC Healthcare',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HNMC Healthcare',
  },
  other: {
    'language': 'English',
    'revisit-after': '7 days',
    'distribution': 'global',
    'rating': 'general',
    'medical-specialty': 'Gynecology',
    'treatment-type': 'Fibroid Treatment',
    'service-area': 'United States',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1e40af',
  },
};

// Separate viewport configuration (Next.js 15+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e40af',
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
