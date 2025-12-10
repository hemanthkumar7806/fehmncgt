"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, AlertCircle, Heart } from "lucide-react";
import * as LucideIcons from "lucide-react";
import RichTextRenderer from "@/components/ui/RichTextRenderer";

export interface Topic {
  title?: string;
  subtitle?: string;
  mainContent?: any[];
  detailsHeading?: string;
  detailsList?: any[];
  callToAction?: {
    heading?: string;
    link?: string;
    description?: any[];
    buttonText?: string;
  };
  infoCards?: Array<{
    title?: string;
    description?: any[];
    icon?: string;
    showCard?: boolean;
  }>;
}

export default function UnderstandTopic({ topic }: { topic?: Topic }) {
  if (!topic) return null;

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
    if (!iconName) return Heart;
    const IconComponent = (LucideIcons as any)[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ];
    return IconComponent || Heart;
  };

  return (
    <section className="container mx-auto px-6 lg:px-8 py-20">
      {/* Section Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {topic.title && (
          <h2 className="text-4xl lg:text-5xl font-bold text-hnmc-gray-800 mb-4 tracking-tight">
            {topic.title}
          </h2>
        )}
        {topic.subtitle && (
          <p className="text-xl text-primary font-medium max-w-3xl mx-auto font-body">
            {topic.subtitle}
          </p>
        )}
      </motion.div>

      <div className="container mx-auto">
        <div className="grid gap-10">
          {/* Main Content */}
          {topic.mainContent && (
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-lg border border-hnmc-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="max-w-5xl mx-auto">
                <RichTextRenderer 
                  content={topic.mainContent} 
                  className="text-hnmc-gray-700 leading-relaxed text-md lg:text-xl"
                />
              </div>
            </motion.div>
          )}

          {/* Details and CTA Section in a row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Details List */}
            {topic.detailsList && topic.detailsList.length > 0 && (
              <motion.div
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-hnmc-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mr-4">
                    <CheckCircle className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-hnmc-gray-800">
                    {topic.detailsHeading || "Details"}
                  </h3>
                </div>

                <div className="bg-secondary/5 rounded-2xl p-6">
                  {topic.detailsList && (
                    <RichTextRenderer 
                      content={topic.detailsList}
                      className="text-hnmc-gray-700 text-sm md:text-lg leading-relaxed"
                    />
                  )}
                  
                  {/* Pay Your Bill Button - Show only for Insurance & Billing section */}
                  {(topic.detailsHeading?.toLowerCase().includes("billing") || 
                    topic.title?.toLowerCase().includes("insurance")) && (
                    <div className="mt-6">
                      <a
                        href="https://www.holyname.org/patients-visitors/pay-your-bill"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <span>Pay your bill</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            {topic.callToAction && (
              <motion.div
                className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                      <AlertCircle className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">
                      {topic.callToAction?.heading ||
                        "Experiencing Symptoms"}
                    </h3>
                  </div>

                  <div className="text-white mb-8 leading-relaxed text-sm md:text-lg">
                    {topic.callToAction.description && (
                      <RichTextRenderer 
                        content={topic.callToAction.description} 
                        className="text-white"
                      />
                    )}
                  </div>
                  {topic.callToAction.link && (
                    <a
                      href={topic.callToAction.link}
                      className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-semibold hover:bg-white/95 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      {...(topic.callToAction.link?.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      onClick={(e) =>
                        handleSmoothScroll(
                          topic.callToAction?.link || "",
                          e
                        )
                      }
                    >
                      <span>
                        {topic.callToAction.buttonText ||
                          "Get Expert Help"}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        {topic.infoCards && topic.infoCards.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {topic.infoCards.map((card, index) => {
              if (!card.showCard) return null;

              const IconComponent = getIcon(card.icon);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-hnmc-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${
                        isEven ? "bg-primary/10" : "bg-secondary/10"
                      } rounded-xl flex items-center justify-center mr-4`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          isEven ? "text-primary" : "text-secondary"
                        }`}
                      />
                    </div>
                    <h4 className="text-xl font-bold text-hnmc-gray-800">
                      {card.title}
                    </h4>
                  </div>
                  {card.description && card.description.length > 0 ? (
                    <RichTextRenderer 
                      content={card.description} 
                      className="text-hnmc-gray-600 leading-relaxed [&_p]:mb-0 text-sm md:text-lg"
                    />
                  ) : null}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
