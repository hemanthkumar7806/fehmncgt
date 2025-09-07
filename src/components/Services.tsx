"use client";

import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, Heart, Brain, Baby, Eye, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';

import "swiper/css";
import "swiper/css/navigation";

interface Service {
  title?: string;
  description?: string;
  icon?: string;
}

interface ServicesProps {
  services?: {
    title?: string;
    subtitle?: string;
    servicesList?: Service[];
  };
}

const defaultServices: Service[] = [
  {
    title: "Primary Care",
    description:
      "Comprehensive health care for individuals and families of all ages. Our experienced physicians provide preventive care, routine checkups, and treatment for acute and chronic conditions.",
    icon: "stethoscope",
  },
  {
    title: "Cardiology",
    description: "Expert cardiovascular care including diagnostic testing, treatment of heart conditions, and preventive cardiology services with state-of-the-art technology.",
    icon: "heart",
  },
  {
    title: "Neurology",
    description: "Specialized treatment for neurological disorders including stroke care, epilepsy management, and comprehensive neurological evaluations.",
    icon: "brain",
  },
  {
    title: "Pediatrics",
    description:
      "Compassionate care for children from birth through adolescence, including well-child visits, immunizations, and treatment of childhood illnesses.",
    icon: "baby",
  },
  {
    title: "Ophthalmology",
    description: "Complete eye care services including comprehensive eye exams, cataract surgery, glaucoma treatment, and retinal care.",
    icon: "eye",
  },
  {
    title: "Orthopedics",
    description: "Advanced treatment for bone, joint, and muscle conditions including sports medicine, joint replacement, and rehabilitation services.",
    icon: "activity",
  },
];

const iconMap = {
  stethoscope: Stethoscope,
  heart: Heart,
  brain: Brain,
  baby: Baby,
  eye: Eye,
  activity: Activity,
};

export default function Services({ services }: ServicesProps) {
  const servicesList = services?.servicesList || defaultServices;
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

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
         
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="relative mb-8">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            onSwiper={setSwiper}
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
              const IconComponent = service.icon
                ? iconMap[service.icon as keyof typeof iconMap]
                : Stethoscope;

              return (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                      {/* Icon */}
                      <div className="mb-4">
                        <div className="w-14 h-14 bg-[#093b60]/10 rounded-xl flex items-center justify-center group-hover:bg-[#093b60] transition-all duration-300">
                          <IconComponent className="w-7 h-7 text-[#093b60] group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#093b60] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-1 text-sm line-clamp-3">
                          {service.description}
                        </p>
                        
                        {/* CTA Button */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button className="inline-flex items-center gap-2 text-[#01a69c] font-medium hover:text-[#01a69c]/80 transition-all duration-300 text-sm">
                            <span>Learn More</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => swiper?.slidePrev()}
              disabled={isBeginning}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isBeginning
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#093b60] text-[#093b60] hover:bg-[#093b60] hover:text-white hover:shadow-lg'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiper?.slideNext()}
              disabled={isEnd}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isEnd
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#093b60] text-[#093b60] hover:bg-[#093b60] hover:text-white hover:shadow-lg'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button className="inline-flex items-center gap-3 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <span>Schedule an Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      <style jsx global>{`
        .services-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}
