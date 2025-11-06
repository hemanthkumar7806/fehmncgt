"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

interface Service {
  title?: string;
  description?: string;
  icon?: string;
  link?: string;
}

interface ServicesProps {
  services?: {
    title?: string;
    subtitle?: string;
    servicesList?: Service[];
    ctaButton?: {
      text?: string;
      link?: string;
      showButton?: boolean;
    };
  };
}

export default function Services({ services }: ServicesProps) {
  const servicesList = services?.servicesList;
  const title = services?.title || "Our Medical Services";
  const subtitle =
    services?.subtitle ||
    "Comprehensive healthcare solutions delivered by our team of expert medical professionals";

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiper(swiper);
    // Initialize the state based on the actual swiper state
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSmoothScroll = (link: string, e: React.MouseEvent) => {
    if (link && !link.startsWith("http")) {
      e.preventDefault();
      const element = document.getElementById(link.replace("#", ""));
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
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
    <section className="py-10">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-hnmc-gray-800 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-hnmc-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        {servicesList && servicesList.length && (
          <div className="relative mb-4">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              onSwiper={handleSwiperInit}
              onSlideChange={handleSlideChange}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="services-swiper"
            >
              {servicesList.map((service, index) => {
                const IconComponent = getIcon(service.icon);

                return (
                  <SwiperSlide key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="h-full pb-4"
                    >
                      <div
                        className="group shadow-md bg-white rounded-2xl p-6 border border-hnmc-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:-translate-y-1"
                      >
                        {/* Icon */}
                        <div className="mb-4">
                          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                            <IconComponent className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-lg lg:text-xl font-bold text-hnmc-gray-800 mb-3 group-hover:text-primary transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="text-hnmc-gray-600 leading-relaxed flex-1 text-sm lg:text-lg">
                            {service.description}
                          </p>

                          {/* CTA Button */}
                          {service.link && (
                            <div className="mt-4 pt-4 border-t border-hnmc-gray-100">
                              <a
                                href={service.link}
                                className="inline-flex items-center gap-2 text-secondary font-medium hover:text-secondary-light transition-all duration-300 text-sm"
                                {...(service.link?.startsWith("http")
                                  ? {
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                    }
                                  : {})}
                                onClick={(e) =>
                                  handleSmoothScroll(service.link || "", e)
                                }
                              >
                                <span>Learn More</span>
                                <ArrowRight className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        {/* Navigation Controls - Only show if there are multiple services */}
        {servicesList && servicesList.length > 1 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => swiper?.slidePrev()}
                disabled={isBeginning}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isBeginning
                    ? "border-hnmc-gray-200 text-hnmc-gray-300 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => swiper?.slideNext()}
                disabled={isEnd}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isEnd
                    ? "border-hnmc-gray-200 text-hnmc-gray-300 cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {services?.ctaButton?.showButton && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <a
              href={services.ctaButton.link}
              className="inline-flex items-center gap-3 bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              {...(services.ctaButton.link?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={(e) => handleSmoothScroll(services.ctaButton?.link || "#appointment", e)}
            >
              <span>{services.ctaButton.text || "Schedule an Appointment"}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        .services-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}
