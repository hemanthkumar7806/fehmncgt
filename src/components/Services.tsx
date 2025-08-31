"use client";

import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, Heart, Brain, Baby, Eye, Activity } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
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
      "Comprehensive health care for individuals and families of all ages.",
    icon: "stethoscope",
  },
  {
    title: "Cardiology",
    description: "Expert care for heart and cardiovascular conditions.",
    icon: "heart",
  },
  {
    title: "Neurology",
    description: "Specialized treatment for neurological disorders and conditions.",
    icon: "brain",
  },
  {
    title: "Pediatrics",
    description:
      "Compassionate care for children from birth through adolescence.",
    icon: "baby",
  },
  {
    title: "Ophthalmology",
    description: "Complete eye care and vision services.",
    icon: "eye",
  },
  {
    title: "Dental Care",
    description: "Comprehensive dental health and hygiene services.",
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
  const title = services?.title || "Our Services";
  const subtitle =
    services?.subtitle ||
    "We offer a comprehensive range of medical services to meet all your healthcare needs";

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Swiper carousel */}
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={32}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
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
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between hover:-translate-y-1">
                    <div>
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <button className="mt-6 flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors self-start">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
