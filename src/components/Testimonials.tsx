"use client";

import { useState } from "react";
import { Star, Quote, User } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import TextClamp from "./ui/TextClamp";
import TestimonialsModal from "./TestimonialsModal";

export interface TestimonialItem {
  author?: string;
  authorTitle?: string;
  quote?: any[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonialIndex, setSelectedTestimonialIndex] = useState(0);

  if (!testimonialsList || testimonialsList.length === 0) return null;

  // Show only first 3 testimonials in the main view
  const displayedTestimonials = testimonialsList.slice(0, 3);

  const handleViewMore = (index: number) => {
    setSelectedTestimonialIndex(index);
    setIsModalOpen(true);
  };

  const handleViewAll = () => {
    setSelectedTestimonialIndex(0);
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 px-6 md:px-12">
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
          {displayedTestimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden h-full flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              
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
                  <div className="relative z-10">
                    {testimonial.quote && (
                      <TextClamp
                        content={testimonial.quote}
                        maxLines={3}
                        isPortableText={true}
                        className="text-gray-700 leading-relaxed"
                        readMoreText="Read more"
                        title={`Testimonial from ${testimonial.author}`}
                        onReadMore={() => handleViewMore(idx)}
                      />
                    )}
                  </div>
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

              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {testimonialsList.length > 3 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl"
            >
              View All Testimonials ({testimonialsList.length})
            </button>
          </motion.div>
        )}

        {/* Testimonials Modal */}
        <TestimonialsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          testimonials={testimonialsList}
          initialIndex={selectedTestimonialIndex}
        />

      </div>
    </section>
  );
}
