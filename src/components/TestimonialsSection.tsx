'use client';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { TestimonialsData } from '@/types/cms';

const DEFAULT_TESTIMONIALS = [
  { text: "The minimally invasive procedure was life-changing. Quick recovery and excellent results. Highly recommend Dr. Liberman!", author: "J.K.", date: "December 2024" },
  { text: "Professional, caring, and expert care throughout. The team made me feel comfortable and informed every step of the way.", author: "M.S.", date: "November 2024" },
  { text: "Dr. Liberman explained everything clearly and the procedure was virtually painless. I'm so grateful for the excellent care I received.", author: "R.T.", date: "October 2024" },
  { text: "After years of suffering, I finally found relief. The staff was amazing and Dr. Liberman's expertise is unmatched. Thank you!", author: "L.H.", date: "September 2024" },
  { text: "Outstanding experience from start to finish. The facility is state-of-the-art and the care is compassionate. Could not be happier!", author: "A.M.", date: "August 2024" },
];

export default function TestimonialsSection({ data }: { data?: TestimonialsData | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (data?.showSection === false) return null;

  const title = data?.title ?? 'What Our Patients Say';
  const list = (data?.testimonialsList?.length) ? data.testimonialsList : DEFAULT_TESTIMONIALS;
  const totalSlides = Math.max(1, Math.ceil(list.length / 2));
  const currentTestimonials = list.slice(currentIndex * 2, currentIndex * 2 + 2);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (i: number) => setCurrentIndex(i);

  return (
    <section className="py-16 bg-white">
      <div className="px-12 sm:px-16 lg:px-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary">{title}</h2>
          <div className="flex gap-2">
            <button onClick={prevSlide} className="p-2 rounded-full border border-gray-300 hover:border-secondary hover:bg-secondary hover:text-white transition" aria-label="Previous testimonials">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="p-2 rounded-full border border-gray-300 hover:border-secondary hover:bg-secondary hover:text-white transition" aria-label="Next testimonials">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {currentTestimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex mb-4">
                {[...Array(5)].map((_, j) => (<Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />))}
              </div>
              <p className="text-gray-700 italic mb-4 leading-relaxed">&ldquo;{t.text ?? ''}&rdquo;</p>
              <div className="text-sm text-gray-600">— {t.author ?? ''}, {t.date ?? ''}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-start items-center gap-2">
          {[...Array(totalSlides)].map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)} className={`w-2 h-2 rounded-full transition ${i === currentIndex ? 'bg-secondary' : 'bg-gray-300'}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
