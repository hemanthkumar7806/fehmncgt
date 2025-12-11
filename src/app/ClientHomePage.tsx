"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import HeroContentSection from "@/components/HeroContentSection";
import Experts from "@/components/Experts";
import Services from "@/components/Services";
import About from "@/components/About";
import UnderstandTopic from "@/components/UnderstandTopic";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import {
  getHomePageData,
  getHomePageById,
  getNavbarData,
  getSidebarData,
  getFooterData,
} from "@/lib/sanity";
import Resources from "@/components/Resources";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import fallbackDataHome from "@/constants/fallbackData.home.json";
import fallbackDataNavbar from "@/constants/fallbackData.navbar.json";
import fallbackDataSidebar from "@/constants/fallbackData.sidebar.json";
import fallbackDataFooter from "@/constants/fallbackData.footer.json";

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

interface FooterData {
  socialLinks?: Array<{
    platform?: string;
    url?: string;
    showLink?: boolean;
  }>;
  contactInfo?: {
    address?: string;
  };
  copyright?: string;
}

interface HomePageData {
  hero?: {
    headline?: string;
    highlightedTexts?: string[];
    subheadline?: any[];
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
    backgroundImage?: {
      asset?: any;
    };
  };
  topic?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: string;
    mainContent?: any[];
    detailsHeading?: string;
    detailsList?: any[];
    callToAction?: {
      heading?: string;
      highlightedTexts?: string[];
      link?: string;
      description?: any[];
      buttonText?: string;
    };
    infoCards?: Array<{
      title?: string;
      highlightedTexts?: string[];
      description?: any[];
      icon?: string;
      showCard?: boolean;
    }>;
  };
  insurance?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: string;
    mainContent?: any[];
    detailsHeading?: string;
    detailsList?: any[];
    callToAction?: {
      heading?: string;
      highlightedTexts?: string[];
      link?: string;
      description?: any[];
      buttonText?: string;
    };
    infoCards?: Array<{
      title?: string;
      highlightedTexts?: string[];
      description?: any[];
      icon?: string;
      showCard?: boolean;
    }>;
  };
  about?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: string;
    description?: any[];
    mediaType?: string;
    image?: {
      asset?: any;
    };
    video?: {
      asset?: any;
    };
    stats?: Array<{
      number?: string;
      label?: string;
      icon?: string;
    }>;
    storyButton?: {
      text?: string;
      link?: string;
      showButton?: boolean;
    };
  };
  services?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: any[];
    servicesList?: Array<{
      title?: string;
      highlightedTexts?: string[];
      description?: any[];
      icon?: string;
      link?: string;
    }>;
    ctaButton?: {
      text?: string;
      link?: string;
      showButton?: boolean;
    };
  };
  resources?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: any[];
    resourcesList?: Array<{
      title?: string;
      highlightedTexts?: string[];
      description?: any[];
      icon?: string;
      link?: string;
      showCard?: boolean;
    }>;
  };
  doctorsSpeciality?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: any[];
    specialityCode?: string;
  };
  testimonials?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: string;
    testimonialsList?: Array<{
      quote?: any[];
      author?: string;
      authorTitle?: string;
      rating?: number;
      profilePhoto?: any;
    }>;
  };
  cta?: {
    title?: string;
    highlightedTexts?: string[];
    description?: any[];
    button?: {
      text?: string;
      link?: string;
    };
    showSection?: boolean;
  };
}

export default function ClientHomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < 600
        ? false
        : true
      : false
  );
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevent setting state if component unmounts

    const fetchHomePageData = async () => {
      try {
        console.log("🔄 Attempting to fetch from Sanity CMS...");
        const [homeData, navData, sideData, footData] = await Promise.all([
          getHomePageData(),
          getNavbarData(),
          getSidebarData(),
          getFooterData(),
        ]);

        let data = homeData;

        // If no data from Sanity, try with the specific document ID from your URL
        if (!data) {
          console.log(
            "⚠️ No data from general query, trying specific document ID..."
          );
          const documentId = "5e8dcfb7-4ff2-44bd-9a84-d0b76b2a4e39";
          data = await getHomePageById(documentId);
        }

        if (isMounted) {
          setHomePageData(data || fallbackDataHome);
          setNavbarData(navData || fallbackDataNavbar);
          setSidebarData(sideData || fallbackDataSidebar);
          setFooterData(footData || fallbackDataFooter);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setHomePageData(fallbackDataHome as any);
        setNavbarData(fallbackDataNavbar as any);
        setSidebarData(fallbackDataSidebar as any);
        setFooterData(fallbackDataFooter as any);
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

      {!loading && (
        <div className="min-h-screen bg-hnmc-gray">
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

          <main
            className={`pt-16 transition-all duration-300 ${
              isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
            }`}
          >
            <section id="home">
              <Hero hero={homePageData?.hero} />
            </section>

            <section id="hero-content">
              <HeroContentSection hero={homePageData?.hero} />
            </section>

            <section id="dr-liberman">
              <Experts
                title={homePageData?.doctorsSpeciality?.title}
                highlightedTexts={homePageData?.doctorsSpeciality?.highlightedTexts}
                subtitle={homePageData?.doctorsSpeciality?.subtitle}
                specialityCode={homePageData?.doctorsSpeciality?.specialityCode}
              />
            </section>

            <section id="about-fibroids">
              <UnderstandTopic topic={homePageData?.topic} />
            </section>

            <section id="services">
              <Services services={homePageData?.services} />
            </section>

            <section id="resources">
              <Resources resources={homePageData?.resources} />
            </section>

            <section id="about">
              <About about={homePageData?.about} />
            </section>

            <section id="testimonials">
              <Testimonials
                title={homePageData?.testimonials?.title}
                highlightedTexts={homePageData?.testimonials?.highlightedTexts}
                subtitle={homePageData?.testimonials?.subtitle}
                testimonialsList={homePageData?.testimonials?.testimonialsList}
              />
            </section>

            <section id="insurance">
              <UnderstandTopic topic={homePageData?.insurance} />
            </section>

            <section id="cta">
              <CTA cta={homePageData?.cta} />
            </section>

            <section id="appointment">
              {/* Appointment section - can be added later */}
            </section>

            <Footer footer={footerData} />
          </main>
        </div>
      )}
    </>
  );
}
