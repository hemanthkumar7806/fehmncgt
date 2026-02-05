import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#004C97',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hnmchealthcare.com'),
  title: {
    default: "Fibroid Center - Holy Name Medical Center | Expert Fibroid Treatment in NJ",
    template: "%s | Holy Name Fibroid Center"
  },
  description: "New Jersey's first designated Hysteroscopic Center of Excellence. Expert fibroid treatment by Dr. Eric Liberman at Holy Name Medical Center in Bergen County. Minimally invasive procedures, fertility preservation, same-day consultations available.",
  keywords: [
    "fibroid treatment NJ",
    "hysteroscopic fibroid surgery",
    "minimally invasive fibroid removal",
    "Holy Name Medical Center",
    "Dr. Eric Liberman",
    "Bergen County fibroid specialist",
    "uterine fibroids",
    "fibroid center",
    "fertility preservation",
    "hysteroscopy",
    "MIGS specialist",
    "New Jersey gynecologist"
  ],
  authors: [{ name: "Holy Name Medical Center" }],
  creator: "Holy Name Medical Center",
  publisher: "Holy Name Medical Center",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Holy Name Fibroid Center",
    title: "Fibroid Center - Expert Fibroid Care in Bergen County",
    description: "New Jersey's first designated Hysteroscopic Center of Excellence. Expert minimally invasive fibroid treatment with fertility preservation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Holy Name Medical Center Fibroid Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fibroid Center - Holy Name Medical Center",
    description: "NJ's first designated Hysteroscopic Center of Excellence for minimally invasive fibroid treatment.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter for body text (similar to Proxima Nova) */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Oswald for headings (condensed like Gotham Condensed) */}
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
