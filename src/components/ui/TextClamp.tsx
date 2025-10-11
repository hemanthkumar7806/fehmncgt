"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface TextClampProps {
  content: string | any[];
  maxLines?: number;
  className?: string;
  readMoreText?: string;
  readLessText?: string;
  showReadMore?: boolean;
  readMoreClassName?: string;
  isPortableText?: boolean;
  title?: string;
  onReadMore?: () => void;
}

export default function TextClamp({
  content,
  maxLines = 3,
  className = "",
  readMoreText = "Learn more",
  readLessText = "Read less",
  showReadMore = true,
  readMoreClassName = "",
  isPortableText = false,
  title = "Full Content",
  onReadMore,
}: TextClampProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    } else if (isPortableText) {
      setIsModalOpen(true);
    } else {
      setIsExpanded(true);
    }
  };

  const handleReadLess = () => {
    setIsExpanded(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // For plain text, we can use CSS line clamping
  if (!isPortableText && typeof content === "string") {
    return (
      <div className={className}>
        <div
          className={`transition-all duration-300 ${
            isExpanded ? "" : `line-clamp-${maxLines}`
          }`}
          style={{
            display: isExpanded ? "block" : "-webkit-box",
            WebkitLineClamp: isExpanded ? "unset" : maxLines,
            WebkitBoxOrient: isExpanded ? "unset" : "vertical",
            overflow: isExpanded ? "visible" : "hidden",
          }}
        >
          {content}
        </div>
        {showReadMore && content.length > 100 && (
          <button
            onClick={isExpanded ? handleReadLess : handleReadMore}
            className={`${readMoreClassName} mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200`}
          >
            {isExpanded ? readLessText : readMoreText}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    );
  }

  // For PortableText, we need to use a different approach
  return (
    <div className={className}>
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "" : `line-clamp-${maxLines}`
        }`}
        style={{
          display: isExpanded ? "block" : "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : maxLines,
          WebkitBoxOrient: isExpanded ? "unset" : "vertical",
          overflow: isExpanded ? "visible" : "hidden",
        }}
      >
        {isPortableText ? (
          <PortableText
            value={content}
            components={{
              types: {
                image: ({ value }) => (
                  <div className="my-4">
                    <Image
                      src={urlFor(value).width(800).height(600).url()}
                      alt={'Image'}
                      width={800}
                      height={600}
                      className="rounded-lg w-full h-auto"
                    />
                    {value.caption && (
                      <p className="text-sm text-gray-600 mt-2 text-center italic">
                        {value.caption}
                      </p>
                    )}
                  </div>
                ),
              },
              block: {
                normal: ({ children }) => <p className="mb-2">{children}</p>,
              },
            }}
          />
        ) : (
          content
        )}
      </div>
      {showReadMore && (
        <button
          onClick={handleReadMore}
          className={`${readMoreClassName} mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200`}
        >
          {readMoreText}
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {/* Modal for PortableText - rendered outside component context using portal */}
      {isModalOpen && isMounted && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ 
                width: 'calc(100vw - 4rem)', 
                height: 'calc(100vh - 4rem)',
                margin: '2rem'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 10rem)' }}>
                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                  {isPortableText ? (
                    <PortableText
                      value={content}
                      components={{
                        types: {
                          image: ({ value }) => (
                            <div className="my-6 w-full md:w-[50%] mx-auto">
                              <Image
                                src={urlFor(value).width(1200).height(800).url()}
                                alt={value.alt || 'Image'}
                                width={1200}
                                height={800}
                                className="rounded-lg h-auto"
                              />
                              {value.caption && (
                                <p className="text-sm text-gray-600 mt-2 text-center italic">
                                  {value.caption}
                                </p>
                              )}
                            </div>
                          ),
                        },
                        block: {
                          normal: ({ children }) => <p className="mb-4 text-lg leading-relaxed">{children}</p>,
                        },
                      }}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">{content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
