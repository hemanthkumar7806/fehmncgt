'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  isLoading: boolean
  onLoadingComplete: () => void
}

export default function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [showLogo, setShowLogo] = useState(true)
  const [isExiting, setIsExiting] = useState(true)

  useEffect(() => {
    if (!isLoading && !isExiting) {
      setIsExiting(true)
    }
  }, [isLoading, isExiting])

  const handleAnimationComplete = () => {
    if (isExiting) {
      setShowLogo(false)
      onLoadingComplete()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {showLogo && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(5px)"
          }}
          transition={{ 
            duration: isExiting ? 0.2 : 0.4,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30" />
          
          {/* Logo container */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ 
              opacity: 0,
              scale: 0.8,
              filter: "blur(10px)"
            }}
            animate={{ 
              opacity: isExiting ? 0.3 : 1,
              scale: isExiting ? 1.1 : 1,
              filter: isExiting ? "blur(3px)" : "blur(0px)"
            }}
            transition={{ 
              duration: isExiting ? 0.2 : 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              delay: isExiting ? 0 : 0.1
            }}
          >
            {/* Logo */}
            <div className="relative w-80 h-24 mb-8">
              <Image
                src="/hnmc_logo.jpg"
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
              animate={{ 
                opacity: isExiting ? 0 : 1, 
                y: isExiting ? 10 : 0 
              }}
              transition={{ 
                duration: isExiting ? 0.2 : 0.4,
                delay: isExiting ? 0 : 0.2
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
  )
}
