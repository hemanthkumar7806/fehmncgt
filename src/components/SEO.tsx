"use client";

import Head from "next/head";
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
    "description": description,
    "url": url,
    "logo": ogImageUrl,
    "image": ogImageUrl,
    "telephone": "+1-555-0123",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Healthcare Drive",
      "addressLocality": "City",
      "addressRegion": "State",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "medicalSpecialty": "Gynecology",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Fibroid Treatment Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Fibroid Removal Surgery"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Minimally Invasive Fibroid Treatment"
          }
        }
      ]
    }
  };

  const structuredData = seoData?.structuredData 
    ? JSON.parse(seoData.structuredData)
    : defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoData?.ogTitle || title} />
      <meta property="og:description" content={seoData?.ogDescription || description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="HNMC Healthcare" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoData?.twitterCard || "summary_large_image"} />
      <meta name="twitter:title" content={seoData?.ogTitle || title} />
      <meta name="twitter:description" content={seoData?.ogDescription || description} />
      <meta name="twitter:image" content={twitterImageUrl} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="HNMC Healthcare" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Healthcare Specific Meta Tags */}
      <meta name="medical-specialty" content="Gynecology" />
      <meta name="treatment-type" content="Fibroid Treatment" />
      <meta name="service-area" content="United States" />

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
    </Head>
  );
}
