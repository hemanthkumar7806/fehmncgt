"use client";

import Image from "next/image";
import { CheckCircle, Users, Award, Clock } from "lucide-react";

interface AboutProps {
  title?: string;
  content?: string;
  image?: string;
}

export default function About({ title, content, image }: AboutProps) {
  const stats = [
    { icon: Users, value: "50+", label: "Expert Doctors" },
    { icon: Award, value: "25+", label: "Years Experience" },
    { icon: Clock, value: "24/7", label: "Emergency Care" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {title || "About Our Medical Center"}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content ||
                "We are committed to providing the highest quality healthcare services to our community. Our team of experienced medical professionals is dedicated to your health and well-being, offering personalized care in a comfortable and welcoming environment."}
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Board-certified physicians",
                "State-of-the-art facilities",
                "Compassionate patient care",
                "Comprehensive medical services",
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Learn More About Us
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            {image ? (
              <Image
                src={image}
                alt="Medical Center"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-blue-600 font-semibold">Medical Center</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
