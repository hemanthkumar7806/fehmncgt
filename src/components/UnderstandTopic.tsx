"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";

export interface Topic {
  title?: string;
  subtitle?: string;
  whatIsTopic?: string;
  commonSymptoms?: any[]; // Portable Text array
  doYouHaveSymptoms?: {
    link?: string;
    symptomsExist?: string;
  };
}

export default function UnderstandTopic({ topic }: { topic?: Topic }) {
  if (!topic) return null;

  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        {topic.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            {topic.title}
          </h2>
        )}
        {topic.subtitle && (
          <h3 className="text-lg md:text-xl text-indigo-600 mb-6 text-center">
            {topic.subtitle}
          </h3>
        )}

        {/* Description */}
        {topic.whatIsTopic && (
          <p className="text-gray-700 leading-relaxed mb-8">
            {topic.whatIsTopic}
          </p>
        )}

        {/* Common Symptoms */}
        {topic.commonSymptoms && topic.commonSymptoms.length > 0 && (
          <div className="bg-indigo-50 p-6 rounded-2xl shadow-sm mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Common Symptoms
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <PortableText
                value={topic.commonSymptoms}
                components={{
                  listItem: ({ children }) => <li>{children}</li>,
                }}
              />
            </ul>
          </div>
        )}

        {/* CTA */}
        {topic.doYouHaveSymptoms && (
          <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-md">
            <p className="text-gray-800 mb-4">
              {topic.doYouHaveSymptoms.symptomsExist}
            </p>
            {topic.doYouHaveSymptoms.link && (
              <Link
                href={topic.doYouHaveSymptoms.link}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow transition"
              >
                Learn More
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
