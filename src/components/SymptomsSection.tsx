'use client';

import { Activity, Check, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import type { SymptomsData } from '@/types/cms';

const DEFAULT_SYMPTOMS = [
  'Heavy menstrual bleeding',
  'Pelvic pain or pressure',
  'Frequent urination',
  'Difficulty emptying bladder',
  'Constipation',
  'Back or leg pains',
];

const DEFAULT_SYMPTOMS_INFO = [
  'Heavy or prolonged menstrual periods lasting more than 7 days',
  'Pelvic pressure or pain during menstruation or intercourse',
  'Frequent urination or difficulty emptying the bladder completely',
  'Constipation or bloating due to pressure on bowel',
  'Lower back pain that may radiate down the legs',
  'Enlarged abdomen that may feel firm or hard',
  'Anemia and fatigue from excessive blood loss',
  'Pain during sexual intercourse',
  'Reproductive challenges or pregnancy complications',
  'If you experience any of these symptoms, schedule a consultation with Dr. Liberman for proper diagnosis and treatment options.',
];

export default function SymptomsSection({ data }: { data?: SymptomsData | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (data?.showSection === false) return null;

  const sectionTitle = data?.sectionTitle ?? 'Common Symptoms';
  const symptoms = (data?.symptomsList?.length) ? data.symptomsList : DEFAULT_SYMPTOMS;
  const symptomsInfo = (data?.symptomsInfo?.length) ? data.symptomsInfo : DEFAULT_SYMPTOMS_INFO;
  const ctaText = data?.ctaText ?? 'Check Your Symptoms';

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition h-full">
        <div className="flex items-center mb-6">
          <div className="bg-secondary bg-opacity-10 p-3 rounded-lg">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
          </div>
          <h2 className="ml-4 text-2xl sm:text-3xl font-heading font-bold text-primary">
            {sectionTitle}
          </h2>
        </div>
        <div className="grid gap-4 mb-8">
          {symptoms.map((symptom, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <span className="ml-3 text-gray-700">{symptom}</span>
            </div>
          ))}
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
              <h3 className="text-2xl font-bold text-primary">Fibroid Symptoms Guide</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {symptomsInfo.map((info, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
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
