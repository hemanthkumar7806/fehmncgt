import Link from "next/link";
import { PortableText } from "@portabletext/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

interface FooterProps {
  footer?: {
    description?: any[]; // Portable Text blocks
    logo?: {
      asset?: {
        _ref?: string;
      };
    };
    socialLinks?: { _key: string; platform: string; url?: string }[];
  };
}

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

export default function Footer({ footer }: FooterProps) {
  if (!footer) return null;

  return (
    <footer className="bg-[#08385E] text-white py-10">
      <div className="container mx-auto px-6 text-center flex flex-col items-center gap-6">
        {/* Logo */}
        {footer.logo?.asset?._ref && (
          <div className="relative w-40 h-12">
            {/* <Image
              src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${footer.logo.asset._ref}`}
              alt="Footer Logo"
              fill
              className="object-contain"
            /> */}
          </div>
        )}

        {/* Social Links */}
        {footer.socialLinks && footer.socialLinks.length > 0 && (
          <div className="flex gap-6 justify-center">
            {footer.socialLinks.map((social, index) => {
              const IconComponent =
                socialIconMap[social.platform.toLowerCase()] || Facebook;
              return (
                <Link
                  key={social._key || `social-${index}`}
                  href={social.url || "#"}
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 transition"
                >
                  <IconComponent className="w-6 h-6" />
                </Link>
              );
            })}
          </div>
        )}

        {/* Description */}
        <div className="text-sm text-gray-200 space-y-1">
          <PortableText value={footer.description} />
        </div>
      </div>
    </footer>
  );
}
