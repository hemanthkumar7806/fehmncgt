"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { GlowingEffect } from "@/components/ui/GlowingCards";
import TextClamp from "@/components/ui/TextClamp";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import { renderTextWithHighlights } from "@/lib/textUtils";

interface Resource {
  title?: string;
  highlightedTexts?: string[];
  description?: any[];
  icon?: string;
  link?: string;
  showCard?: boolean;
}

interface ResourcesProps {
  resources?: {
    title?: string;
    highlightedTexts?: string[];
    subtitle?: any[];
    resourcesList?: Resource[];
  };
}

export default function Resources({ resources }: ResourcesProps) {
  const resourcesList = resources?.resourcesList || [];
  const title = resources?.title || "Educational Resources";

  const handleSmoothScroll = (link: string, e: React.MouseEvent) => {
    if (link && !link.startsWith("http")) {
      e.preventDefault();
      const element = document.getElementById(link.replace("#", ""));
      if (element) {
        const headerHeight = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ];
    return IconComponent || null;
  };

  const isOddRow = (index: number) => {
    const rowIndex = Math.floor(index / 2);
    const isOddRow = rowIndex % 2 === 0;
    
    return isOddRow ? true : false;
  };

  const filteredResources = resourcesList.filter(resource => resource.showCard !== false);

  return (
    <section className="py-20 bg-hnmc-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-1">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6 tracking-tight">
            {renderTextWithHighlights(title, resources?.highlightedTexts)}
          </h2>
          {resources?.subtitle && resources.subtitle.length > 0 && (
            <div className="text-xl text-hnmc-gray-600 max-w-3xl mx-auto leading-relaxed font-body">
              <RichTextRenderer
                content={resources.subtitle}
                className="[&_p]:text-xl [&_p]:text-hnmc-gray-600 [&_p]:leading-relaxed [&_p]:mb-0"
              />
            </div>
          )}
        </motion.div>

        {/* Resources Grid */}
        {filteredResources.length > 0 && (
          <motion.ul
            className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {filteredResources.map((resource, index) => {
              const IconComponent = getIcon(resource.icon);
              
              return (
                  <GridItem
                    key={index}
                    area={isOddRow(index) ? "md:col-span-2" : "md:col-span-4"}
                    icon={IconComponent ? <IconComponent className={`h-5 w-5 ${isOddRow(index) ? "text-hnmc-gray-600" : "text-white"}`} /> : null}
                    title={resource.title || "Resource"}
                    highlightedTexts={resource.highlightedTexts}
                    description={resource.description || []}
                    link={resource.link}
                    isOddRow={isOddRow(index)}
                    onSmoothScroll={handleSmoothScroll}
                  />
              );
            })}
          </motion.ul>
        )}
      </div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode | null;
  title: string;
  highlightedTexts?: string[];
  description: any[];
  link?: string;
  onSmoothScroll: (link: string, e: React.MouseEvent) => void;
  isOddRow: boolean;
}

const GridItem = ({ area, icon, title, highlightedTexts, description, link, isOddRow, onSmoothScroll }: GridItemProps) => {
  const content = (
    <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className={`relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl md:rounded-2xl p-6
       border border-hnmc-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 ${isOddRow ? "bg-white" : "bg-secondary"}`}>
        <div className="relative flex flex-1 flex-col justify-between gap-4">
          {icon && (
            <div className={`w-fit rounded-lg border border-hnmc-gray-200 bg-primary/10 p-3`}>
              {icon}
            </div>
          )}
          <div className="space-y-4">
            <h3 className={`font-heading text-xl/[1.375rem] font-semibold text-balance md:text-2xl/[1.875rem] ${isOddRow ? "text-hnmc-gray-800" : "text-white"}`}>
              {renderTextWithHighlights(title, highlightedTexts)}
            </h3>
            <TextClamp
              content={description}
              maxLines={5}
              isPortableText={true}
              className={`font-body text-sm/[1.125rem] md:text-lg/[1.375rem] ${isOddRow ? "text-hnmc-gray-600" : "text-white/90"}`}
              readMoreClassName={`${isOddRow ? "text-hnmc-gray-600" : "text-white/90"}`}
              readMoreText="Learn more"
              title={title}
            />
          </div>
          {link && (
            <div className="mt-auto pt-4">
              <span className={`inline-flex items-center gap-2 font-medium transition-all duration-300 text-sm cursor-pointer ${isOddRow ? "text-secondary hover:text-secondary-light" : "text-white hover:text-white/80"}`}>
                <span>Learn More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      {link ? (
        <a
          href={link}
          className="block h-full"
          {...(link?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={(e) => onSmoothScroll(link, e)}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
};
