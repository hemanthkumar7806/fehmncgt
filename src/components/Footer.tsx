import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";

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

export default function Footer({ footer }: FooterProps) {
  if (!footer) return null;

  return (
    <footer className="bg-hnmc-blue text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Media Links */}
          {footer.socialLinks && footer.socialLinks.length > 0 && (
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
                      className="text-white hover:text-gray-300 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="w-6 h-6" />
                    </Link>
                  );
                })}
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm text-white text-center">
            {footer.copyright || "© 2025 Holy Name Fibroid Center. All rights reserved."}
          </p>

          {/* Address */}
          {footer.contactInfo?.address && (
            <p className="text-sm text-white text-center">
              {footer.contactInfo.address}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}