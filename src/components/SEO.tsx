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
  const title = seoData?.title || "HNMC Healthcare Fibroid Center";
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

  const structuredData = seoData?.structuredData 
    ? JSON.parse(seoData.structuredData)
    : defaultStructuredData;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="robots" content={robotsContent} />
      {url && <link rel="canonical" href={url} />}
      
      {/* Essential Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="HNMC Healthcare" />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoData?.ogTitle || title} />
      <meta property="og:description" content={seoData?.ogDescription || description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoData?.ogTitle || title} />
      <meta property="og:site_name" content="HNMC Healthcare" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoData?.twitterCard || "summary_large_image"} />
      <meta name="twitter:title" content={seoData?.ogTitle || title} />
      <meta name="twitter:description" content={seoData?.ogDescription || description} />
      <meta name="twitter:image" content={twitterImageUrl} />
      <meta name="twitter:image:alt" content={seoData?.ogTitle || title} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="HNMC Healthcare" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Healthcare Specific Meta Tags */}
      <meta name="medical-specialty" content="Gynecology" />
      <meta name="treatment-type" content="Fibroid Treatment" />
      <meta name="service-area" content="United States" />
      
      {/* Mobile & Performance Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="HNMC Healthcare" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.sanity.io" />
    </>
  );
}
