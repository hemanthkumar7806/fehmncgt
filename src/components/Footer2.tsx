import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { urlFor } from "@/lib/sanity";

interface FooterProps {
  footer?: {
    logo?: {
      asset?: any;
    };
    description?: any[];
    socialLinks?: Array<{
      platform?: string;
      url?: string;
      showLink?: boolean;
    }>;
    footerLinks?: Array<{
      title?: string;
      url?: string;
      openInNewTab?: boolean;
      showLink?: boolean;
    }>;
    contactInfo?: {
      phone?: string;
      email?: string;
      address?: string;
      showContactInfo?: boolean;
    };
    copyright?: string;
  } | null;
}

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function Footer2({ footer }: FooterProps) {
  if (!footer) return null;

  const handleSmoothScroll = (link: string, e: React.MouseEvent) => {
    if (link && !link.startsWith('http')) {
      e.preventDefault()
      const element = document.getElementById(link.replace('#', ''))
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }
    }
  }

  return (
    <footer className="bg-hnmc-blue text-white py-12">
      <div className="container mx-auto px-6 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            {footer.logo?.asset && (
              <div className="relative w-40 h-10 mb-4 mx-auto md:mx-0">
                <Image
                  src={urlFor(footer.logo.asset).url()}
                  alt="HNMC Healthcare Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            
            {footer.description && (
              <div className="max-w-md text-gray-300 mx-auto md:mx-0">
                <PortableText value={footer.description} />
              </div>
            )}
          </div>

          {/* Footer Links */}
          {footer.footerLinks && footer.footerLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footer.footerLinks
                  .filter(link => link.showLink !== false)
                  .map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url || "#"}
                        className="text-gray-300 hover:text-white transition-colors"
                        {...(link.url?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onClick={(e) => handleSmoothScroll(link.url || '', e)}
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {footer.contactInfo?.showContactInfo !== false && footer.contactInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                {footer.contactInfo.phone && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>{footer.contactInfo.phone}</span>
                  </div>
                )}
                {footer.contactInfo.email && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span>{footer.contactInfo.email}</span>
                  </div>
                )}
                {footer.contactInfo.address && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{footer.contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        {footer.socialLinks && footer.socialLinks.length > 0 && (
          <div className="border-t border-gray-600/60 mt-8 pt-4">
            <div className="flex gap-6 justify-center">
              {footer.socialLinks
                .filter(social => social.showLink !== false)
                .map((social, index) => {
                  const IconComponent = socialIconMap[social.platform || ''];
                  if (!IconComponent) return null;

                  return (
                    <Link
                      key={index}
                      href={social.url || "#"}
                      className="text-gray-300 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-6 h-6" />
                    </Link>
                  );
                })}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-600/60 mt-4 pt-6 text-center">
          <p className="text-sm text-gray-300">
            {footer.copyright || "© 2025 HNMC Healthcare. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}