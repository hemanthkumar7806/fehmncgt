"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(5px)",
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          onAnimationComplete={(definition) => {
            if (definition === "exit" && !isLoading) {
                onLoadingComplete();
            }
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30" />

          {/* Logo container */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{
              opacity: 0,
              scale: 0.8,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              scale: 1.1,
              filter: "blur(3px)",
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {/* Logo */}
            <div className="relative w-80 h-24 mb-8">
              <Image
                src="/Holy-Name-100-Anniversary.png"
                alt="Holy Name Medical Center"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>

            {/* Tagline */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
              }}
            >
              <h2 className="text-lg font-medium text-primary mb-2">
                Fibroid Care Excellence
              </h2>
              <p className="text-sm text-hnmc-gray-600 max-w-md">
                Your journey to better health starts here
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
