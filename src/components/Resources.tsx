"use client";

import Link from "next/link";
import { BookOpen, FileText, ArrowRight, Sparkles, Download } from "lucide-react";

interface Resource {
  title?: string;
  description?: string;
  icon?: string | null;
  link?: string | null;
}

interface ResourcesProps {
  resources?: {
    title?: string;
    subtitle?: string;
    resourcesList?: Resource[];
  };
}

const iconMap: Record<string, any> = {
  book: BookOpen,
  file: FileText,
};

export default function Resources({ resources }: ResourcesProps) {
  const resourcesList = resources?.resourcesList || [];
  const title = resources?.title || "Resources";
  const subtitle = resources?.subtitle || "Learn more with our curated resources";

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#093b60]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#01a69c]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Enhanced Section heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#01a69c]/10 text-[#01a69c] rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} className="mr-2" />
            {title}
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Enhanced Resources grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {resourcesList.map((resource, idx) => {
            const IconComponent = resource.icon
              ? iconMap[resource.icon as keyof typeof iconMap]
              : BookOpen;

            return (
              <div
                key={idx}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100/50 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#01a69c]/5 to-[#093b60]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#01a69c] to-[#093b60] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#093b60] transition-colors duration-300">
                      {resource.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 flex-grow text-lg leading-relaxed mb-8">
                    {resource.description}
                  </p>

                  {resource.link && (
                    <Link
                      href={resource.link}
                      className="group/link inline-flex items-center gap-3 text-[#01a69c] font-semibold hover:text-[#093b60] transition-colors text-lg"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#093b60] to-[#01a69c] rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Need More Information?</h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Download our comprehensive patient guide and stay informed about your health journey.
              </p>
              <button className="group inline-flex items-center gap-3 bg-white text-[#093b60] px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Download className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Download Patient Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
