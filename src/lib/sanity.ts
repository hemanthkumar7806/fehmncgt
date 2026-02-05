import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// Only log environment variables once in development
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('🔧 Environment variables check:', {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    hasToken: !!process.env.SANITY_TOKEN
  })
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false, // Set to false for development to avoid caching issues
  token: process.env.SANITY_TOKEN, // Optional: for private content
})

// Only log client config once in development
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('🔧 Sanity client created with config:', {
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    useCdn: client.config().useCdn
  })
}

// Test function to check if Sanity connection works
export async function testSanityConnection() {
  try {
    console.log('🧪 Testing Sanity connection...')
    // Try the most basic query possible - just get any document
    const result = await client.fetch('*[0]')
    console.log('✅ Sanity connection test result:', result)
    return true
  } catch (error) {
    console.error('❌ Sanity connection test failed:', error)
    console.error('❌ Connection error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      statusCode: (error as any)?.statusCode
    })
    
    // Check if it's a CORS issue
    if (error instanceof Error && error.message.includes('CORS')) {
      console.error('🚨 CORS issue detected! You need to add localhost to your Sanity CORS origins.')
    }
    
    return false
  }
}

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Function to check what document types exist
export async function getDocumentTypes() {
  try {
    console.log('🔍 Checking available document types...')
    const result = await client.fetch('*[_type in ["homePage", "service", "testimonial"]] | order(_type)')
    console.log('📋 Available documents:', result)
    return result
  } catch (error) {
    console.error('❌ Error checking document types:', error)
    return []
  }
}

// Query to fetch navbar data
export const navbarQuery = `
  *[_type == "navbar"][0] {
    logoAlt,
    logo {
      asset->
    },
    mobileLogo {
      asset->
    },
    tagline,
    contactInfo {
      phone,
      emergencyText,
      showContactInfo
    },
    ctaButton {
      text,
      mobileText,
      showButton
    }
  }
`

// Query to fetch sidebar data (Navigation / top bar menu — menuItems only)
export const sidebarQuery = `
  *[_type == "sidebar"][0] {
    logo {
      asset->
    },
    menuItems[] {
      icon,
      label,
      linkType,
      internalSection,
      externalUrl,
      openInNewTab
    }
  }
`

// Query to fetch footer data
export const footerQuery = `
  *[_type == "footer"][0] {
    logo {
      asset->
    },
    description,
    socialLinks[] {
      platform,
      url,
      showLink
    },
    footerLinks[] {
      title,
      url,
      openInNewTab,
      showLink
    },
    contactInfo {
      phone,
      email,
      address,
      showContactInfo
    },
    copyright
  }
`

// Home page query — matches current homePage schema (Hero, Symptoms, Why choose, Doctor, Insurance, Testimonials, Newsletter)
export const homepageQuery = `
  *[_type == "homePage"][0] {
    hero {
      showSection,
      badgeText,
      badgeTextMobile,
      headline,
      highlightedTexts,
      subheadline,
      primaryCtaText,
      secondaryCtaText,
      secondaryCtaUrl,
      image {
        asset-> { _id, url },
        alt
      },
      stats[] { value, label }
    },
    symptoms {
      showSection,
      sectionTitle,
      symptomsList,
      symptomsInfo,
      ctaText
    },
    whyChoose {
      showSection,
      sectionTitle,
      features[] { icon, title, description },
      approachInfo,
      ctaText
    },
    doctorsSpeciality {
      showSection,
      title,
      highlightedTexts,
      subtitle,
      specialityCode
    },
    insurance {
      showSection,
      sectionTitle,
      insuranceProviders,
      careCompassPortal {
        title,
        description,
        registrationUrl,
        buttonText
      },
      visitInfo {
        title,
        addressLine1,
        city,
        state,
        zipCode,
        phone,
        directionsUrl,
        directionsText
      }
    },
    testimonials {
      showSection,
      title,
      testimonialsList[] { text, author, date }
    },
    newsletter {
      showSection,
      title,
      description,
      emailPlaceholder,
      buttonText
    },
    seo {
      title,
      description,
      keywords,
      ogImage {
        asset-> { _id, url }
      },
      ogTitle,
      ogDescription,
      twitterTitle,
      twitterDescription,
      twitterImage {
        asset-> { _id, url }
      },
      canonicalUrl,
      noIndex,
      noFollow,
      structuredData[] {
        _key,
        name,
        jsonld
      }
    }
  }
`

// Simple cache to prevent multiple identical calls (disabled in development for fresh Sanity edits)
let homepageDataCache: any = null
let navbarDataCache: any = null
let sidebarDataCache: any = null
let footerDataCache: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 0 : 5 * 60 * 1000 // 0 in dev, 5 min in prod

// Function to fetch navbar data
export async function getNavbarData() {
  const now = Date.now()
  if (CACHE_DURATION > 0 && navbarDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return navbarDataCache
  }

  try {    
    const data = await client.fetch(navbarQuery)
    
    // Cache the result
    navbarDataCache = data
    cacheTimestamp = now
    
    return data
  } catch (error) {
    console.error('❌ Error fetching navbar data:', error)
    return null
  }
}

// Function to fetch sidebar data
export async function getSidebarData() {
  const now = Date.now()
  if (CACHE_DURATION > 0 && sidebarDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return sidebarDataCache
  }

  try {
    const data = await client.fetch(sidebarQuery)
    sidebarDataCache = data
    cacheTimestamp = now
    return data
  } catch (error) {
    console.error('❌ Error fetching sidebar data:', error)
    return null
  }
}

// Function to fetch footer data
export async function getFooterData() {
  const now = Date.now()
  if (CACHE_DURATION > 0 && footerDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return footerDataCache
  }

  try {    
    const data = await client.fetch(footerQuery)
    footerDataCache = data
    cacheTimestamp = now
    return data
  } catch (error) {
    console.error('❌ Error fetching footer data:', error)
    return null
  }
}

// Function to fetch homepage data
export async function getHomePageData() {
  const now = Date.now()
  if (CACHE_DURATION > 0 && homepageDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return homepageDataCache
  }

  try {
    const data = await client.fetch(homepageQuery)
    
    // Cache the result
    homepageDataCache = data
    cacheTimestamp = now
    
    return data
  } catch (error) {
    console.error('❌ Error fetching homepage data:', error)
    // Fallback: Try using our server-side API route
    try {
      console.log('🔄 Trying server-side API route as fallback...')
      const response = await fetch('/api/sanity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: homepageQuery }),
      })
      
      if (response.ok) {
        const result = await response.json()
        return result.data
      }
    } catch (fallbackError) {
      console.error('❌ Server-side API route also failed:', fallbackError)
    }
    
    return null;
  }
}

// Server-side SEO data fetching function
export async function getSeoData() {
  try {
    const query = `
      *[_type == "seo"][0] {
        title,
        description,
        keywords,
        ogImage {
          asset-> {
            _id,
            url
          }
        },
        ogTitle,
        ogDescription,
        canonicalUrl,
        noIndex,
        noFollow,
        structuredData
      }
    `;
    
    // Disable caching to ensure fresh data on every request
    const seoData = await client.fetch(query, {}, {
      next: { revalidate: 0 }
    });
    return seoData;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
}

// Function to fetch data by document ID (for your specific URL)
export async function getHomePageById(id: string) {
  try {
    const query = `*[_id == $id][0] {
      hero {
        headline,
        highlightedTexts,
        subheadline,
        badge {
          text,
          showBadge
        },
        ctaButton {
          text,
          link
        },
        secondaryButton {
          text,
          link,
          showButton
        },
        stats[] {
          number,
          label
        },
        rightContent {
          title,
          description,
          achievements[] {
            text
          }
        },
        floatingCards[] {
          title,
          subtitle,
          position,
          showCard
        },
        backgroundImage {
          asset-> {
            _id,
            url
          }
        },
        showImage,
        heroLayout,
        showSection
      },
      doctorsSpeciality {
        title,
        highlightedTexts,
        subtitle,
        specialityCode,
        showSection
      },
      topic {
        title,
        subtitle,
        mainContent,
        detailsHeading,
        detailsList,
        payBillButton {
          showButton,
          text,
          link
        },
        callToAction {
          heading,
          link,
          description,
          buttonText
        },
        infoCards[] {
          title,
          description,
          icon,
          showCard
        },
        showSection
      },
      insurance {
        title,
        subtitle,
        mainContent,
        detailsHeading,
        detailsList,
        payBillButton {
          showButton,
          text,
          link
        },
        callToAction {
          heading,
          link,
          description,
          buttonText
        },
        infoCards[] {
          title,
          description,
          icon,
          showCard
        },
        showSection
      },
      about {
        title,
        subtitle,
        description,
        mediaType,
        image {
          asset-> {
            _id,
            url
          }
        },
        video {
          asset-> {
            _id,
            url
          }
        },
        stats[] {
          number,
          label,
          icon
        },
        showSection
      },
      services {
        title,
        subtitle,
        servicesList[] {
          title,
          description,
          icon,
          link
        },
        ctaButton {
          text,
          link,
          showButton
        },
        showSection
      },
      resources {
        title,
        subtitle,
        resourcesList[] {
          title,
          icon,
          description,
          link,
          showCard
        },
        showSection
      },
      testimonials {
        title,
        testimonialsList[] {
          quote,
          author,
          authorTitle,
          profilePhoto {
            asset-> {
              _id,
              url
            }
          },
          rating
        },
        showSection
      },
      cta {
        title,
        description,
        button {
          text,
          link
        },
        showSection
      }
    }`
    const data = await client.fetch(query, { id })
    return data
  } catch (error) {
    console.error('❌ Error fetching homepage data by ID:', error)
    return null
  }
}
