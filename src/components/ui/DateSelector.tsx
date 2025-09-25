'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface AvailableDate {
  date: string
  slotsCount: number
  hasSlots: boolean
}

interface DateSelectorProps {
  availableDates: AvailableDate[]
  onDateSelect: (date: string) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export default function DateSelector({ availableDates, onDateSelect, loading = false, error = null, onRetry }: DateSelectorProps) {
  if (error) {
    return (
      <motion.div
        key="select-date"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Date</h4>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <motion.div
        key="select-date"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Date</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="w-full p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key="select-date"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Date</h4>
      {availableDates.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No available dates found</div>
          <div className="text-sm text-gray-400">Please try again later or contact us directly</div>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {availableDates.map(dateInfo => (
            <button
              key={dateInfo.date}
              onClick={() => onDateSelect(dateInfo.date)}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#01a69c] hover:bg-[#01a69c]/5 transition-all text-left group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#01a69c]">
                    {new Date(dateInfo.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric',
                      timeZone: 'America/New_York'
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {dateInfo.slotsCount} available slot{dateInfo.slotsCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {dateInfo.slotsCount}
                  </span>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-[#01a69c]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
