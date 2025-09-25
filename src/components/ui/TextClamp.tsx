"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { X, ChevronDown } from "lucide-react";

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
}

export default function TextClamp({
  content,
  maxLines = 3,
  className = "",
  readMoreText = "Read more",
  readLessText = "Read less",
  showReadMore = true,
  readMoreClassName = "",
  isPortableText = false,
  title = "Full Content",
}: TextClampProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = () => {
    if (isPortableText) {
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
              list: ({ children }) => <ul className="space-y-2">{children}</ul>,
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

      {/* Modal for PortableText */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                  {isPortableText ? (
                    <PortableText
                      value={content}
                      components={{
                        listItem: ({ children }) => (
                          <li className="flex items-start mb-4">
                            <div className="w-3 h-3 bg-secondary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                            <span className="text-hnmc-gray-700 text-lg leading-relaxed">
                              {children}
                            </span>
                          </li>
                        ),
                        list: ({ children }) => (
                          <ul className="space-y-3">{children}</ul>
                        ),
                        block: {
                          normal: ({ children }) => (
                            <p className="mb-4">{children}</p>
                          ),
                        },
                      }}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
