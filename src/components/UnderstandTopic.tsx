"use client";

import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, AlertCircle } from "lucide-react";

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
    <section className="py-2 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="w-[90%] mx-auto px-6 lg:px-8">
        <div className="w-full">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            
            {topic.title && (
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                {topic.title}
              </h2>
            )}
            {topic.subtitle && (
              <p className="text-xl text-[#01a69c] font-medium">
                {topic.subtitle}
              </p>
            )}
          </motion.div>

          <div className="grid gap-8 lg:gap-12">
            {/* What is Topic */}
            {topic.whatIsTopic && (
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {topic.whatIsTopic}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Common Symptoms and CTA Section in a row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Common Symptoms */}
              {topic.commonSymptoms && topic.commonSymptoms.length > 0 && (
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#01a69c]/10 rounded-xl flex items-center justify-center mr-4">
                      <CheckCircle className="w-6 h-6 text-[#01a69c]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Common Symptoms
                    </h3>
                  </div>
                  
                  <div className="bg-[#01a69c]/5 rounded-xl p-6">
                    <div className="prose prose-lg max-w-none">
                      <PortableText
                        value={topic.commonSymptoms}
                        components={{
                          listItem: ({ children }) => (
                            <li className="flex items-start mb-3">
                              <div className="w-2 h-2 bg-[#01a69c] rounded-full mt-3 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{children}</span>
                            </li>
                          ),
                          list: ({ children }) => (
                            <ul className="space-y-2">{children}</ul>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA Section */}
              {topic.doYouHaveSymptoms && (
                <motion.div
                  className="bg-gradient-to-r from-[#093b60] to-[#01a69c] rounded-2xl p-8 text-white"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-4">
                        Experiencing Symptoms?
                      </h3>
                      <p className="text-white/90 mb-6 leading-relaxed">
                        {topic.doYouHaveSymptoms.symptomsExist}
                      </p>
                      {topic.doYouHaveSymptoms.link && (
                        <Link
                          href={topic.doYouHaveSymptoms.link}
                          className="inline-flex items-center gap-3 bg-white text-[#093b60] px-6 py-3 rounded-xl font-semibold hover:bg-white/95 transition-all duration-300 hover:shadow-lg"
                        >
                          <span>Get Expert Help</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Additional Info Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Why Choose Our Care?
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our team of specialists provides comprehensive, personalized treatment plans 
                using the latest medical technologies and evidence-based approaches.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Schedule a Consultation
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Take the first step towards better health. Our medical experts are here 
                to provide the care and guidance you need.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
