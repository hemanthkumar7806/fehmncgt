import type { Metadata } from 'next';
import type { SeoData } from '@/types/cms';

// Default SEO values (fallback if Sanity data is not available)
const DEFAULT_SEO = {
  title: "Fibroid Center - Holy Name Medical Center | Expert Fibroid Treatment in NJ",
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
  ogImage: "/og-image.jpg",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://hnmchealthcare.com'
};

/**
 * Generate Next.js Metadata from Sanity SEO data
 * Falls back to default values if Sanity data is not available
 */
export function generateMetadataFromSanity(seoData?: SeoData | null): Metadata {
  const baseUrl = DEFAULT_SEO.siteUrl;
  
  // Use Sanity data or fall back to defaults
  const title = seoData?.title || DEFAULT_SEO.title;
  const description = seoData?.description || DEFAULT_SEO.description;
  const keywords = seoData?.keywords || DEFAULT_SEO.keywords;
  const ogImage = seoData?.ogImage?.asset?.url || DEFAULT_SEO.ogImage;
  const ogTitle = seoData?.ogTitle || title;
  const ogDescription = seoData?.ogDescription || description;
  const twitterTitle = seoData?.twitterTitle || ogTitle;
  const twitterDescription = seoData?.twitterDescription || ogDescription;
  const twitterImage = seoData?.twitterImage?.asset?.url || ogImage;
  const canonicalUrl = seoData?.canonicalUrl || '/';

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Holy Name Fibroid Center"
    },
    description,
    keywords,
    authors: [{ name: "Holy Name Medical Center" }],
    creator: "Holy Name Medical Center",
    publisher: "Holy Name Medical Center",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "Holy Name Fibroid Center",
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Holy Name Medical Center Fibroid Center",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
    },
    robots: {
      index: !seoData?.noIndex,
      follow: !seoData?.noFollow,
      googleBot: {
        index: !seoData?.noIndex,
        follow: !seoData?.noFollow,
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

  return metadata;
}

/**
 * Parse and render structured data (JSON-LD) from Sanity
 */
export function renderStructuredData(structuredData?: Array<{ _key?: string; name?: string; jsonld?: any }>) {
  if (!structuredData || structuredData.length === 0) {
    return null;
  }

  return structuredData
    .filter(item => item.jsonld && Object.keys(item.jsonld).length > 0)
    .map((item, index) => (
      <script
        key={item._key || `structured-data-${index}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(item.jsonld)
        }}
      />
    ));
}
