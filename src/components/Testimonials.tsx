"use client";

import { Star, Quote } from "lucide-react";

export interface TestimonialItem {
  author?: string;
  authorTitle?: string;
  quote?: string;
  rating?: number;
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
    <section className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-lg text-gray-600 mb-12">{subtitle}</p>
        )}

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {testimonialsList.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col justify-between relative"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-indigo-100 absolute top-6 left-6" />

              {/* Rating */}
              {t.rating && (
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (t.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <p className="text-gray-700 italic leading-relaxed mb-6">
                {t.quote}
              </p>

              {/* Author */}
              <div className="mt-auto text-left">
                <p className="font-semibold text-gray-900">{t.author}</p>
                {t.authorTitle && (
                  <p className="text-sm text-gray-500">{t.authorTitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
