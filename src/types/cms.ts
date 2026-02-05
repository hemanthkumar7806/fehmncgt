// CMS (Sanity) data shapes — aligned with BE schema and FE components

export interface NavbarData {
  logo?: { asset?: { _id?: string; url?: string } };
  mobileLogo?: { asset?: { _id?: string; url?: string } };
  logoAlt?: string;
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

/** From Sanity "Navigation (Top bar menu)" / sidebar — used for top nav links */
export interface NavLinkItem {
  icon?: string;
  label?: string;
  linkType?: 'internal' | 'external';
  internalSection?: string;
  externalUrl?: string | null;
  openInNewTab?: boolean;
}

export interface FooterData {
  logo?: { asset?: { _id?: string; url?: string } };
  description?: unknown;
  socialLinks?: Array<{ platform?: string; url?: string; showLink?: boolean }>;
  footerLinks?: Array<{
    title?: string;
    url?: string;
    openInNewTab?: boolean;
    showLink?: boolean;
  }>;
  copyright?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    showContactInfo?: boolean;
  };
}

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: { asset?: { _id?: string; url?: string } };
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: { asset?: { _id?: string; url?: string } };
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Array<{
    _key?: string;
    name?: string;
    jsonld?: any;
  }>;
}

export interface HeroData {
  showSection?: boolean;
  badgeText?: string;
  badgeTextMobile?: string;
  headline?: string;
  highlightedTexts?: string[];
  subheadline?: unknown[];
  primaryCtaText?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  image?: { asset?: { _id?: string; url?: string }; alt?: string };
  stats?: Array<{ value?: string; label?: string }>;
}

export interface SymptomsData {
  showSection?: boolean;
  sectionTitle?: string;
  symptomsList?: string[];
  symptomsInfo?: string[];
  ctaText?: string;
}

export interface WhyChooseData {
  showSection?: boolean;
  sectionTitle?: string;
  features?: Array<{ icon?: string; title?: string; description?: string }>;
  approachInfo?: string[];
  ctaText?: string;
}

export interface InsuranceData {
  showSection?: boolean;
  sectionTitle?: string;
  insuranceProviders?: string[];
  careCompassPortal?: {
    title?: string;
    description?: string;
    registrationUrl?: string;
    buttonText?: string;
  };
  visitInfo?: {
    title?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    directionsUrl?: string;
    directionsText?: string;
  };
}

export interface TestimonialsData {
  showSection?: boolean;
  title?: string;
  testimonialsList?: Array<{ text?: string; author?: string; date?: string }>;
}

export interface NewsletterData {
  showSection?: boolean;
  title?: string;
  description?: string;
  emailPlaceholder?: string;
  buttonText?: string;
}

export interface HomePageData {
  hero?: HeroData;
  symptoms?: SymptomsData;
  whyChoose?: WhyChooseData;
  doctorsSpeciality?: {
    showSection?: boolean;
    title?: string;
    highlightedTexts?: string[];
    subtitle?: unknown[];
    specialityCode?: string;
  };
  insurance?: InsuranceData;
  testimonials?: TestimonialsData;
  newsletter?: NewsletterData;
  seo?: SeoData;
}
