"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, User, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { TestimonialItem } from "./Testimonials";

interface TestimonialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials: TestimonialItem[];
  initialIndex?: number;
}

export default function TestimonialsModal({
  isOpen,
  onClose,
  testimonials,
  initialIndex = 0,
}: TestimonialsModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset to initialIndex whenever modal opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  const selectedTestimonial = testimonials[selectedIndex];

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden m-4 md:m-8 w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] md:w-[calc(100vw-4rem)] md:h-[calc(100vh-4rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              Patient Testimonials
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Left Sidebar - Testimonials List (Desktop only) */}
            <div className="hidden md:block w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Reviews ({testimonials.length})
                </h3>
                <div className="space-y-3">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        index === selectedIndex
                          ? "bg-white shadow-md border-2 border-primary/20"
                          : "bg-white/50 hover:bg-white hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedIndex(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {testimonial.profilePhoto?.asset?.url ? (
                            <Image
                              src={urlFor(testimonial.profilePhoto.asset).url()}
                              alt={testimonial.author || "Profile"}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {testimonial.author}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {testimonial.authorTitle}
                          </p>
                        </div>
                      </div>
                      {testimonial.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (testimonial.rating || 0)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {testimonial.quote && (
                          <PortableText
                            value={testimonial.quote}
                            components={{
                              block: {
                                normal: ({ children }) => <span>{children}</span>,
                              },
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content - Selected Testimonial Details */}
            <div className="flex-1 flex flex-col relative">
              {selectedTestimonial && (
                <>
                  {/* Mobile Navigation Arrows */}
                  <div className="md:hidden absolute top-8 left-2 right-2 z-10 flex justify-between">
                    <button
                      onClick={handlePrevious}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200"
                      disabled={testimonials.length <= 1}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200"
                      disabled={testimonials.length <= 1}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>


                  {/* Navigation */}
                  <div className="flex items-center justify-between p-4 md:p-4 border-b border-gray-200">
                    {/* Profile details with margin to compensate for mobile arrows */}
                    <div className="flex items-center gap-4 ml-12 md:ml-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        {selectedTestimonial.profilePhoto?.asset?.url ? (
                          <Image
                            src={urlFor(selectedTestimonial.profilePhoto.asset).url()}
                            alt={selectedTestimonial.author || "Profile"}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          {selectedTestimonial.author}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                          {selectedTestimonial.authorTitle}
                        </p>
                        {selectedTestimonial.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 md:w-5 md:h-5 ${
                                  i < (selectedTestimonial.rating || 0)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-xs md:text-sm text-gray-600">
                              {selectedTestimonial.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                      <button
                        onClick={handlePrevious}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        disabled={testimonials.length <= 1}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <span className="text-sm text-gray-500 px-2">
                        {selectedIndex + 1} of {testimonials.length}
                      </span>
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        disabled={testimonials.length <= 1}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    {/* Mobile: Add right margin to compensate for right arrow */}
                    <div className="md:hidden w-12"></div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 p-4 md:p-4 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                      <div className="relative">
                        <div className="text-4xl md:text-6xl text-primary/20 absolute -top-2 md:-top-4 -left-1 md:-left-2">
                          &quot;
                        </div>
                        <div className="pl-6 md:pl-8 pr-6 md:pr-8">
                          {selectedTestimonial.quote && (
                            <div className="prose prose-base md:prose-lg max-w-none text-gray-700 leading-relaxed">
                              <PortableText
                                value={selectedTestimonial.quote}
                                components={{
                                  types: {
                                    image: ({ value }) => (
                                      <div className="my-6 md:my-8 w-full mx-auto">
                                        <Image
                                          src={urlFor(value).width(1200).height(800).url()}
                                          alt="Testimonial Image"
                                          width={1200}
                                          height={800}
                                          className="rounded-lg w-full h-auto shadow-lg"
                                        />
                                        {value.caption && (
                                          <p className="text-sm text-gray-600 mt-3 text-center italic">
                                            {value.caption}
                                          </p>
                                        )}
                                      </div>
                                    ),
                                  },
                                  block: {
                                    normal: ({ children }) => (
                                      <p className="mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
                                        {children}
                                      </p>
                                    ),
                                  },
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="text-4xl md:text-6xl text-primary/20 absolute -bottom-2 md:-bottom-4 -right-1 md:-right-2">
                          &quot;
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
