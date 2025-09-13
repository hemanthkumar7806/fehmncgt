"use client";

import { Star, Quote, User } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export interface TestimonialItem {
  author?: string;
  authorTitle?: string;
  quote?: string;
  rating?: number;
  profilePhoto?: {
    asset?: {
      _id?: string;
      url?: string;
    };
  };
}

export interface TestimonialsProps {
  title?: string;
  subtitle?: string | null;
  testimonialsList?: TestimonialItem[];
}

export default function Testimonials({
  title,
  subtitle,
  testimonialsList,
}: TestimonialsProps) {
  if (!testimonialsList || testimonialsList.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-20 px-6 md:px-12">
      <div className="w-[90%] mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {title && (
            <div className="flex items-center justify-center gap-3 mb-4"> 
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                {title}
              </h2> 
            </div>
          )}
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsList.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="group bg-white rounded-3xl shadow-lg p-8 transition-all duration-500 border border-gray-100 relative overflow-hidden h-full flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01a69c]/10 to-[#093b60]/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-1 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-[#01a69c] to-[#093b60] rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300">
                  <Quote className="w-8 h-8 text-white" />
                </div>

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 transition-colors duration-300 ${
                          i < (testimonial.rating || 0)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {testimonial.rating}/5
                    </span>
                  </div>
                )}

                {/* Quote */}
                <blockquote className="text-gray-700 leading-relaxed mb-8 text-lg relative flex-1">
                  <span className="text-4xl text-[#01a69c]/30 absolute -top-2 -left-2">&quot;</span>
                  <span className="relative z-10">{testimonial.quote}</span>
                  <span className="text-4xl text-[#01a69c]/30 absolute -bottom-4 -right-2">&quot;</span>
                </blockquote>

                <div className="flex items-center mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    {testimonial.profilePhoto?.asset?.url ? (
                      <Image
                        src={urlFor(testimonial.profilePhoto.asset).url()}
                        alt={testimonial.author || "Profile"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#01a69c] to-[#093b60] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg">
                      {testimonial.author}
                    </p>
                    {testimonial.authorTitle && (
                      <p className="text-sm text-[#01a69c] font-medium">
                        {testimonial.authorTitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#01a69c]/20 transition-colors duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-[#093b60] to-[#01a69c] rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">
              Join Our Community of Satisfied Patients
            </h3>
            <p className="text-white/90 mb-6">
              Experience the same exceptional care that our patients rave about. Your health journey starts here.
            </p>
            <button className="bg-white text-[#093b60] px-8 py-3 rounded-xl font-semibold hover:bg-white/95 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Schedule Your Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
