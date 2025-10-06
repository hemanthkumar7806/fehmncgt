import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSeoData } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate dynamic metadata from Sanity
export async function generateMetadata(): Promise<Metadata> {
  try {
    const seoData = await getSeoData();
    
    // Fallback data (from SEO.tsx component)
    const fallbackTitle = "Fibroid Care at Holy Name";
    const fallbackDescription = "Leading fibroid treatment center offering expert care and minimally invasive procedures.";
    const fallbackKeywords = ["fibroid treatment", "uterine fibroids", "women's health", "gynecology"];
    
    // Use Sanity data or fallback
    const title = seoData?.title || fallbackTitle;
    const description = seoData?.description || fallbackDescription;
    const keywords = seoData?.keywords || fallbackKeywords;
    const canonicalUrl = seoData?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://hnmchealthcare.com';
    
    // Generate image URLs
    const ogImageUrl = seoData?.ogImage?.asset?.url 
      ? urlFor(seoData.ogImage.asset).width(1200).height(630).url()
      : "/hnmc_logo.jpg";
      
    const twitterImageUrl = seoData?.twitterImage?.asset?.url
      ? urlFor(seoData.twitterImage.asset).width(1200).height(675).url()
      : ogImageUrl;


    // Default structured data for healthcare organization
    const defaultStructuredData = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": "HNMC - Fibroid Center",
      "alternateName": "Holy Name Medical Center Fibroid Center",
      "description": description,
      "url": canonicalUrl,
      "logo": ogImageUrl,
      "image": ogImageUrl,
      "telephone": "+1-555-0123",
      "email": "info@hnmchealthcare.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Healthcare Drive",
        "addressLocality": "City",
        "addressRegion": "State",
        "postalCode": "12345",
        "addressCountry": "US"
      },
      "medicalSpecialty": "Gynecology",
      "areaServed": {
        "@type": "State",
        "name": "New Jersey"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Fibroid Treatment Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Fibroid Removal Surgery",
              "description": "Surgical removal of uterine fibroids"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Minimally Invasive Fibroid Treatment",
              "description": "Non-surgical treatment options for fibroids"
            }
          }
        ]
      }
    };

    let structuredData = defaultStructuredData;
    if (seoData?.structuredData) {
      try {
        structuredData = JSON.parse(seoData.structuredData);
      } catch (e) {
        console.error("Error parsing structured data:", e);
        structuredData = defaultStructuredData;
      }
    }

    return {
      // Core SEO
      title: {
        default: title,
        template: "%s | HNMC Healthcare"
      },
      description,
      keywords,
      authors: [{ name: "HNMC Healthcare" }],
      creator: "HNMC Healthcare",
      publisher: "HNMC Healthcare",

      // Open Graph
      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "HNMC Healthcare",
        title: seoData?.ogTitle || title,
        description: seoData?.ogDescription || description,
        url: canonicalUrl,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: seoData?.ogTitle || title,
          },
        ],
      },
      
      // Twitter
      twitter: {
        title: seoData?.ogTitle || title,
        description: seoData?.ogDescription || description,
        card: seoData?.twitterCard || "summary_large_image",
        images: [
          {
            url: twitterImageUrl,
            width: 1200,
            height: 630,
            alt: seoData?.ogTitle || title,
          },
        ],
        site: "HNMC Healthcare",
        creator: "HNMC Healthcare",
      },
      
      // Robots
      robots: {
        index: !seoData?.noIndex,
        follow: !seoData?.noFollow,
        googleBot: {
          index: !seoData?.noIndex,
          follow: !seoData?.noFollow,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      
      // Technical metadata
      metadataBase: new URL(canonicalUrl),
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
        'structured-data': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Return fallback metadata if Sanity fails
    return {
      title: {
        default: "Fibroid Care at Holy Name",
        template: "%s | HNMC Healthcare"
      },
      description: "Leading fibroid treatment center offering expert care and minimally invasive procedures.",
      keywords: ["fibroid treatment", "uterine fibroids", "women's health", "gynecology"],
    };
  }
}

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
