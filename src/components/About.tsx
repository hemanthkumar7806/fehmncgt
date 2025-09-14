"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { Users, Stethoscope, Play, Pause } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { useState, useRef } from "react";
import fallbackData from "@/constants/fallbackData.home.json";

interface AboutProps {
  about?: {
    title?: string;
    subtitle?: string;
    description?: any[];
    mediaType?: string;
    image?: {
      asset?: any;
    };
    video?: {
      asset?: any;
    };
    stats?: Array<{
      number?: string;
      label?: string;
      icon?: string;
    }>;
  };
}

export default function About({ about }: AboutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const aboutData = about || fallbackData.about;

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return Users;
    const IconComponent = (LucideIcons as any)[
      iconName.charAt(0).toUpperCase() + iconName.slice(1)
    ];
    return IconComponent || Users;
  };

  return (
    <section className="py-20 bg-hnmc-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {aboutData?.subtitle && (
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                {aboutData.subtitle}
              </motion.div>
            )}

            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-hnmc-gray-800 mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {aboutData?.title || "About Holy Name Fibroid Center"}
            </motion.h2>

            <motion.div
              className="text-lg text-hnmc-gray-600 leading-relaxed mb-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {aboutData?.description && (
                <PortableText value={aboutData.description} />
              )}
            </motion.div>
          </motion.div>

          {/* Media - Image or Video */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              {aboutData?.mediaType === 'video' && aboutData?.video?.asset ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-auto sm:h-[400px] object-cover"
                    poster={aboutData?.image?.asset ? urlFor(aboutData.image.asset).url() : undefined}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    controls={false}
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src={aboutData.video.asset.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Overlay Controls */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 group">
                    <button
                      onClick={handleVideoToggle}
                      className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-primary" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative h-[400px]">
                  {aboutData?.image?.asset ? (
                    <Image
                      src={urlFor(aboutData.image.asset).url()}
                      alt={aboutData?.title || "About Us"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Stethoscope className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-primary font-semibold text-lg">Fibroid Care Center</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        {aboutData?.stats && aboutData.stats.length > 0 && (
          <motion.div
            className="flex justify-between mt-20 pt-12 border-t border-hnmc-gray-200"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {aboutData.stats.map((stat, index) => {
              const IconComponent = getIcon(stat.icon);
              
              return (
                <motion.div
                  key={index}
                  className="text-center group flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-secondary" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-hnmc-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
