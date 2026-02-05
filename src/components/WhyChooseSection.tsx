'use client';

import { Layers, Sparkles, Heart, Shield, ArrowRight, X, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { WhyChooseData } from '@/types/cms';

const ICON_MAP: Record<string, LucideIcon> = { Sparkles, Heart, Shield, Layers };

const DEFAULT_FEATURES = [
  { icon: 'Sparkles', title: 'Minimally Invasive', description: 'Advanced hysteroscopic techniques for faster recovery' },
  { icon: 'Heart', title: 'Fertility Focus', description: 'Preserve your reproductive options with expert care' },
  { icon: 'Shield', title: 'Site of Excellence', description: "NJ's first recognized hysteroscopic center" },
];

const DEFAULT_APPROACH_INFO = [
  'Hysteroscopic myomectomy - minimally invasive removal of fibroids through the cervix',
  'No abdominal incisions required, resulting in faster recovery and less scarring',
  'Fertility-preserving procedures designed for women who wish to have children',
  'State-of-the-art imaging and surgical technology for precision treatment',
  'Same-day procedures with most patients returning to normal activities within days',
  'Personalized treatment plans based on fibroid size, location, and your health goals',
  'Board-certified specialist with extensive experience in complex fibroid cases',
  'Comprehensive pre-operative evaluation and post-operative care',
  'Dedicated patient support team available throughout your treatment journey',
  "New Jersey's first designated Hysteroscopic Center of Excellence",
];

export default function WhyChooseSection({ data }: { data?: WhyChooseData | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (data?.showSection === false) return null;

  const sectionTitle = data?.sectionTitle ?? 'Why Choose Us';
  const features = (data?.features && data.features.length > 0) ? data.features : DEFAULT_FEATURES;
  const approachInfo = (data?.approachInfo && data.approachInfo.length > 0) ? data.approachInfo : DEFAULT_APPROACH_INFO;
  const ctaText = data?.ctaText ?? 'Learn More About Our Approach';

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm h-full">
        <div className="flex items-center mb-8">
          <div className="bg-secondary bg-opacity-10 p-3 rounded-lg">
            <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </div>
          <h2 className="ml-4 text-2xl sm:text-3xl font-heading font-bold text-primary">
            {sectionTitle}
          </h2>
        </div>
        <div className="grid gap-6 mb-8">
          {features.map((f, index) => {
            const Icon = (f.icon && ICON_MAP[f.icon]) ? ICON_MAP[f.icon] : Layers;
            return (
              <div key={index} className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-secondary bg-opacity-10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-heading font-bold text-primary mb-2">{f.title ?? ''}</h3>
                  <p className="text-gray-600">{f.description ?? ''}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center text-secondary font-medium hover:underline"
        >
          {ctaText}
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary">Our Treatment Approach</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {approachInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <Sparkles className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
