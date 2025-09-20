'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface DateSelectorProps {
  availableDates: string[]
  onDateSelect: (date: string) => void
}

export default function DateSelector({ availableDates, onDateSelect }: DateSelectorProps) {
  return (
    <motion.div
      key="select-date"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Appointment Date</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {availableDates.map(date => (
          <button
            key={date}
            onClick={() => onDateSelect(date)}
            className="w-full p-4 border border-gray-200 rounded-lg hover:border-[#01a69c] hover:bg-[#01a69c]/5 transition-all text-left group"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-[#01a69c]">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  Available slots
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#01a69c]" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
