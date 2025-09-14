import { urlFor } from "@/lib/sanity";
interface SeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: {
    asset?: {
      _id?: string;
      url?: string;
    };
  };
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterImage?: {
    asset?: {
      _id?: string;
      url?: string;
    };
  };
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: string;
  robotsTxt?: {
    allow?: string[];
    disallow?: string[];
  };
}

interface SEOProps {
  seoData?: SeoData | null;
}

export default function SEO({ 
  seoData
}: SEOProps) {
  const title = seoData?.title || "Fibroid Care at Holy Name";
  const description = seoData?.description || "Leading fibroid treatment center offering expert care and minimally invasive procedures.";
  const url = seoData?.canonicalUrl;
  
  // Generate image URLs
  const ogImageUrl = seoData?.ogImage?.asset?.url 
    ? urlFor(seoData.ogImage.asset).width(1200).height(630).url()
    : "/hnmc_logo.jpg";
    
  const twitterImageUrl = seoData?.twitterImage?.asset?.url
    ? urlFor(seoData.twitterImage.asset).width(1200).height(675).url()
    : ogImageUrl;

  // Generate keywords string
  const keywordsString = seoData?.keywords?.join(", ") || "fibroid treatment, uterine fibroids, women's health, gynecology";

  // Generate robots meta
  const robotsContent = [
    seoData?.noIndex ? "noindex" : "index",
    seoData?.noFollow ? "nofollow" : "follow"
  ].join(", ");

  // Default structured data for healthcare organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "HNMC - Fibroid Center",
    "alternateName": "Holy Name Medical Center Fibroid Center",
    "description": description,
    "url": url,
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

  return (
    <>
      {/* Preconnect to external domains for performance - placed first for faster resource loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.sanity.io" />

      {/* Dynamic Title Override (if different from default) */}
      {seoData?.title && seoData.title !== "Fibroid Care at Holy Name" && (
        <title>{title}</title>
      )}
      
      {/* Dynamic Description Override (if different from default) */}
      {seoData?.description && (
        <meta name="description" content={description} />
      )}
      
      {/* Dynamic Keywords Override */}
      {seoData?.keywords && (
        <meta name="keywords" content={keywordsString} />
      )}
      
      {/* Dynamic Robots Override */}
      {seoData?.noIndex || seoData?.noFollow ? (
        <meta name="robots" content={robotsContent} />
      ) : null}
      
      {/* Dynamic Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Dynamic Open Graph Content */}
      {seoData?.ogTitle && (
        <meta property="og:title" content={seoData.ogTitle} />
      )}
      {seoData?.ogDescription && (
        <meta property="og:description" content={seoData.ogDescription} />
      )}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoData?.ogTitle || title} />

      {/* Dynamic Twitter Content */}
      {seoData?.twitterCard && (
        <meta name="twitter:card" content={seoData.twitterCard} />
      )}
      {seoData?.ogTitle && (
        <meta name="twitter:title" content={seoData.ogTitle} />
      )}
      {seoData?.ogDescription && (
        <meta name="twitter:description" content={seoData.ogDescription} />
      )}
      <meta name="twitter:image" content={twitterImageUrl} />
      <meta name="twitter:image:alt" content={seoData?.ogTitle || title} />

      {/* Dynamic Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  );
}
