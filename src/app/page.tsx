"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import Experts from "@/components/Experts";
import Services from "@/components/Services";
import About from "@/components/About";
import UnderstandTopic from "@/components/UnderstandTopic";
import Testimonials from "@/components/Testimonials";
import {
  getHomePageData,
  getHomePageById,
  getNavbarData,
  getSidebarData,
} from "@/lib/sanity";
import Resources from "@/components/Resources";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import fallbackDataHome from "@/constants/fallbackData.home.json";
import fallbackDataNavbar from "@/constants/fallbackData.navbar.json";
import fallbackDataSidebar from "@/constants/fallbackData.sidebar.json";

interface NavbarData {
  logoAlt?: string;
  logo?: {
    asset?: any;
  };
  mobileLogo?: {
    asset?: any;
  };
  tagline?: string;
  contactInfo?: {
    phone?: string;
    emergencyText?: string;
    showContactInfo?: boolean;
  };
  ctaButton?: {
    text?: string;
    mobileText?: string;
    showButton?: boolean;
  };
}

interface SidebarData {
  logo?: {
    asset?: any;
  };
  menuItems?: Array<{
    icon?: string;
    label?: string;
    linkType?: string;
    internalSection?: string;
    externalUrl?: string | null;
    openInNewTab?: boolean;
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    showContactInfo?: boolean;
  };
}

interface HomePageData {
  seo?: any;
  hero?: {
    headline?: string;
    subheadline?: string;
    badge?: {
      text?: string;
      showBadge?: boolean;
    };
    ctaButton?: {
      text?: string;
      link?: string;
    };
    secondaryButton?: {
      text?: string;
      link?: string;
      showButton?: boolean;
    };
    stats?: Array<{
      number?: string;
      label?: string;
    }>;
    rightContent?: {
      title?: string;
      description?: string;
      achievements?: Array<{
        text?: string;
      }>;
    };
    floatingCards?: Array<{
      title?: string;
      subtitle?: string;
      position?: string;
      showCard?: boolean;
    }>;
    backgroundImage?: {
      asset?: any;
    };
  };
  topic?: {
    title?: string;
    subtitle?: string;
    whatIsTopic?: any;
    commonSymptoms?: any;
    doYouHaveSymptoms?: {
      link?: string;
      symptomsExist?: string;
    };
  };
  about?: {
    title?: string;
    description?: string;
    stats?: Array<{
      number?: string;
      label?: string;
    }>;
    image?: string;
  };
  services?: {
    title?: string;
    subtitle?: string;
    servicesList?: Array<{
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
  resources?: {
    title?: string;
    subtitle?: string;
    resourcesList?: Array<{
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
  doctors?: {
    title?: string;
    subtitle?: string;
    featuredDoctors?: Array<{
      _id?: string;
      name?: string;
      title?: string;
      credentials?: string;
      photo?: any;
      slug?: any;
    }>;
    ctaButton?: {
      text?: string;
      link?: string;
    };
  };
  testimonials?: {
    title?: string;
    subtitle?: string;
    testimonialsList?: Array<{
      name?: string;
      role?: string;
      content?: string;
      rating?: number;
      photo?: any;
    }>;
  };
  contact?: {
    title?: string;
    subtitle?: string;
    phone?: string;
    email?: string;
    address?: string;
    hours?: any;
  };
  footer?: {
    logo?: {
      asset?: {
        _ref?: string;
      };
    };
    description?: any[];
    socialLinks?: Array<{
      _key: string;
      platform: string;
      url?: string;
    }>;
  };
}

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevent setting state if component unmounts

    const fetchHomePageData = async () => {
      try {
        console.log("🔄 Attempting to fetch from Sanity CMS...");
        const [homeData, navData, sideData] = await Promise.all([
          getHomePageData(),
          getNavbarData(),
          getSidebarData(),
        ]);

        let data = homeData;

        // If no data from Sanity, try with the specific document ID from your URL
        if (!data) {
          console.log('⚠️ No data from general query, trying specific document ID...')
          const documentId = '5e8dcfb7-4ff2-44bd-9a84-d0b76b2a4e39'
          data = await getHomePageById(documentId)
        }

        if (isMounted) {
          setHomePageData(data || fallbackDataHome);
          setNavbarData(navData || fallbackDataNavbar);
          setSidebarData(sideData || fallbackDataSidebar);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        if (isMounted) {
          setSidebarData(fallbackDataSidebar);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomePageData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <LoadingScreen
        isLoading={loading}
        onLoadingComplete={() => setLoading(false)}
      />

      {/*TODO: Split them cos: Now Always render the main content, but it will be behind the loading screen when loading */}
      {!loading && <div className="min-h-screen bg-hnmc-gray">
        <Header
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          navbarData={navbarData}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          sidebarData={sidebarData}
        />

        <main className="pt-16">
          <section id="home">
            <Hero hero={homePageData?.hero} />
          </section>

          <section id="about-fibroids">
            <UnderstandTopic topic={homePageData?.topic} />
          </section>

          <section id="dr-liberman">
            <Experts />
          </section>

          <section id="services">
            <Services services={homePageData?.services} />
          </section>

          <section id="resources">
            <Resources resources={homePageData?.resources} />
          </section>

          <section id="about">
            <About
              title={homePageData?.about?.title}
              content={homePageData?.about?.description}
              image={homePageData?.about?.image}
            />
          </section>

          <section id="testimonials">
            <Testimonials
              title={homePageData?.testimonials?.title}
              subtitle={homePageData?.testimonials?.subtitle}
              testimonialsList={homePageData?.testimonials?.testimonialsList}
            />
          </section>

          <section id="appointment">
            {/* Appointment section - can be added later */}
          </section>

          <section id="insurance">
            {/* Insurance section - can be added later */}
          </section>

          <section id="register">
            {/* Patient portal section - can be added later */}
          </section>

          <Footer footer={homePageData?.footer} />
        </main>
      </div>
      }
    </>
  );
}
