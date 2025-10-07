import type { Metadata } from "next";
import { getSeoData, urlFor } from "@/lib/sanity";
import ClientHomePage from "./ClientHomePage";

// Force dynamic rendering - this prevents static generation and caching
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching completely

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seoData = await getSeoData();
    
    const title = seoData?.title || "Fibroid Care at Holy Name";;
    const description = seoData?.description || "Leading fibroid treatment center offering expert care and minimally invasive procedures.";;
    const keywords = seoData?.keywords || ["fibroid treatment", "uterine fibroids", "women's health", "gynecology"];
    const canonicalUrl = seoData?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://hnmchealthcare.com';
    
    const ogImageUrl = seoData?.ogImage?.asset?.url 
      ? urlFor(seoData.ogImage.asset).width(1200).height(630).url()
      : "/hnmc_logo.jpg";

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
      title,
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
      
      twitter: {
        title: seoData?.ogTitle || title,
        description: seoData?.ogDescription || description,
        card: "summary_large_image",
        images: [
          {
            url: ogImageUrl,
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
        'pdf-title': title,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
  
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

// Server component that renders the client homepage
export default function Home() {
  return <ClientHomePage />;
}