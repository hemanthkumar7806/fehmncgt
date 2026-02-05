import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SymptomsSection from '@/components/SymptomsSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import DoctorSection from '@/components/DoctorSection';
import InsuranceAndContactSection from '@/components/InsuranceAndContactSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import { DoctorProvider } from '@/contexts/DoctorContext';

// Only load chat widget when enabled (demo). Omitting on Vercel avoids SDK build error (useEffectEvent).
const FloatingChatWidgetWrapper =
  process.env.NEXT_PUBLIC_ENABLE_CHAT_WIDGET === 'true'
    ? dynamic(() => import('@/app/FloatingChatWidgetWrapper'), { ssr: false })
    : () => null;
import { getHomePageData, getNavbarData, getFooterData, getSidebarData } from '@/lib/sanity';
import { generateMetadataFromSanity, renderStructuredData } from '@/lib/seo';
import type { HomePageData, NavbarData, FooterData, NavLinkItem } from '@/types/cms';
import type { Metadata } from 'next';

// Always server-render so Sanity content updates show on every request
export const dynamic = 'force-dynamic';

// Generate dynamic metadata from Sanity
export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePageData();
  const homeData = home as HomePageData | null | undefined;
  
  return generateMetadataFromSanity(homeData?.seo);
}

export default async function Home() {
  const [home, nav, footer, sidebar] = await Promise.all([
    getHomePageData(),
    getNavbarData(),
    getFooterData(),
    getSidebarData(),
  ]);

  const homeData = home as HomePageData | null | undefined;
  const navData = nav as NavbarData | null | undefined;
  const footerData = footer as FooterData | null | undefined;
  const navLinks = (sidebar as { menuItems?: NavLinkItem[] } | null)?.menuItems ?? undefined;

  // Structured Data (JSON-LD) for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": "https://hnmchealthcare.com/#organization",
    "name": "Holy Name Medical Center Fibroid Center",
    "url": "https://hnmchealthcare.com",
    "logo": "https://hnmchealthcare.com/Holy-Name-100-Anniversary.png",
    "description": "New Jersey's first designated Hysteroscopic Center of Excellence for minimally invasive fibroid treatment",
    "telephone": "+1-201-833-7212",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "718 Teaneck Road",
      "addressLocality": "Teaneck",
      "addressRegion": "NJ",
      "postalCode": "07666",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.8898",
      "longitude": "-74.0084"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "40.8898",
        "longitude": "-74.0084"
      },
      "geoRadius": "50000"
    },
    "medicalSpecialty": [
      "Gynecology",
      "Minimally Invasive Gynecologic Surgery",
      "Reproductive Health"
    ],
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "Hysteroscopic Fibroid Removal",
        "description": "Minimally invasive fibroid treatment with fertility preservation"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Laparoscopic Surgery",
        "description": "Advanced minimally invasive gynecologic procedures"
      },
      {
        "@type": "MedicalProcedure",
        "name": "Da Vinci Robotic Surgery",
        "description": "Robotic-assisted minimally invasive gynecologic surgery"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ]
  };

  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": "https://hnmchealthcare.com/#physician",
    "name": "Dr. Eric Liberman",
    "honorificPrefix": "Dr.",
    "givenName": "Eric",
    "familyName": "Liberman",
    "jobTitle": "Director of Minimally Invasive Gynecologic Surgery",
    "description": "Board-certified in Obstetrics and Gynecology and fellowship-trained in Minimally Invasive Gynecologic Surgery (MIGS)",
    "medicalSpecialty": [
      "Obstetrics and Gynecology",
      "Minimally Invasive Gynecologic Surgery",
      "Hysteroscopy"
    ],
    "knowsAbout": [
      "Abnormal uterine bleeding",
      "Fibroids",
      "Endometrial polyps",
      "Adenomyosis",
      "Ovarian cysts",
      "Endometriosis",
      "Pelvic pain",
      "Da Vinci robotic surgery",
      "Laparoscopic surgery",
      "Hysteroscopy"
    ],
    "worksFor": {
      "@id": "https://hnmchealthcare.com/#organization"
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "New York College of Osteopathic Medicine"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Saint Barnabas Medical Center"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Montefiore Medical Center, Albert Einstein College of Medicine"
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hnmchealthcare.com"
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": "https://hnmchealthcare.com/#webpage",
    "url": "https://hnmchealthcare.com",
    "name": "Fibroid Center - Expert Fibroid Care in Bergen County",
    "description": "New Jersey's first designated Hysteroscopic Center of Excellence for minimally invasive fibroid treatment",
    "specialty": "Gynecology",
    "about": {
      "@type": "MedicalCondition",
      "name": "Uterine Fibroids",
      "alternateName": "Leiomyomas",
      "description": "Non-cancerous growths in the uterus that can cause heavy bleeding, pelvic pain, and other symptoms"
    },
    "mainEntity": {
      "@id": "https://hnmchealthcare.com/#organization"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Holy Name Medical Center",
      "url": "https://www.holyname.org"
    }
  };

  return (
    <DoctorProvider specialityCode={homeData?.doctorsSpeciality?.specialityCode}>
      {/* Render Structured Data from Sanity (if available) or use defaults */}
      {homeData?.seo?.structuredData && homeData.seo.structuredData.length > 0 ? (
        renderStructuredData(homeData.seo.structuredData)
      ) : (
        <>
          {/* Default Structured Data (JSON-LD) for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema)
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(physicianSchema)
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema)
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(webPageSchema)
            }}
          />
        </>
      )}

      <main className="min-h-screen bg-white">
        <Header data={navData ?? undefined} navLinks={navLinks} />
        <div id="home">
          <HeroSection data={homeData?.hero} />
        </div>

        {/* Row 1: Common Symptoms + Why Choose Us */}
        <section id="symptoms" className="py-16 bg-white scroll-mt-20" aria-label="Fibroid Symptoms and Treatment Benefits">
          <div className="px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <SymptomsSection data={homeData?.symptoms} />
              <WhyChooseSection data={homeData?.whyChoose} />
            </div>
          </div>
        </section>

        {/* Row 2: Doctor Section + Insurance/Contact Section */}
        <section id="doctor" className="py-16 bg-hnmc-gray scroll-mt-20" aria-label="Our Specialist and Insurance Information">
          <div className="px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <DoctorSection />
              <div id="insurance">
                <InsuranceAndContactSection data={homeData?.insurance} />
              </div>
            </div>
          </div>
        </section>

        <div id="services">
          <TestimonialsSection data={homeData?.testimonials} />
        </div>
        <NewsletterSection data={homeData?.newsletter} />
        <Footer data={footerData ?? undefined} />
      </main>
      {/* Demo only – not for production */}
      <FloatingChatWidgetWrapper />
    </DoctorProvider>
  );
}
