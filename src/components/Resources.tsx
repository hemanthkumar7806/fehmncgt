"use client";

import Link from "next/link";
import { BookOpen, FileText } from "lucide-react"; // example icons

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Resources grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {resourcesList.map((resource, idx) => {
            const IconComponent = resource.icon
              ? iconMap[resource.icon as keyof typeof iconMap]
              : BookOpen;

            return (
              <div
                key={idx}
                className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl p-8 shadow-sm hover:shadow-md flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {resource.title}
                  </h3>
                </div>
                <p className="text-gray-600 flex-grow">{resource.description}</p>

                {resource.link && (
                  <Link
                    href={resource.link}
                    className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Learn More →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
