'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Calendar, RefreshCw } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
  type: 'consultation' | 'follow-up'
  startTime?: string
  endTime?: string
}

interface TimeSelectorProps {
  selectedDate: string
  availableSlots: TimeSlot[]
  loadingSlots: boolean
  onSlotSelect: (slot: TimeSlot) => void
  onBack: () => void
}

export default function TimeSelector({ 
  selectedDate, 
  availableSlots, 
  loadingSlots, 
  onSlotSelect, 
  onBack 
}: TimeSelectorProps) {
  // Filter out past slots if the selected date is today
  const filteredSlots = useMemo(() => {
    const now = new Date()
    // Get today's date in local timezone (YYYY-MM-DD format)
    const todayYear = now.getFullYear()
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0')
    const todayDay = String(now.getDate()).padStart(2, '0')
    const todayDateString = `${todayYear}-${todayMonth}-${todayDay}`
    
    // If selected date is not today, return all slots
    if (selectedDate !== todayDateString) {
      return availableSlots
    }
    
    // If selected date is today, filter out past slots
    return availableSlots.filter(slot => {
      // If slot has startTime, compare with current time
      if (slot.startTime) {
        const slotTime = new Date(slot.startTime)
        return slotTime > now
      }
      // If no startTime, keep the slot (fallback for backward compatibility)
      return true
    })
  }, [availableSlots, selectedDate])
  return (
    <motion.div
      key="select-time"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-3 p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Select Time</h4>
          <p className="text-sm text-gray-600">
            {(() => {
              const [year, month, day] = selectedDate.split('-').map(Number)
              const localDate = new Date(year, month - 1, day)
              return localDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric'
              })
            })()}
          </p>
        </div>
      </div>
      
      {loadingSlots ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-secondary" />
          <span className="ml-2 text-gray-600">Loading available slots...</span>
        </div>
      ) : filteredSlots.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {filteredSlots.map(slot => (
            <button
              key={slot.time}
              onClick={() => slot.available && onSlotSelect(slot)}
              disabled={!slot.available}
              className={`p-3 border rounded-lg text-center transition-all ${
                slot.available
                  ? 'border-gray-200 hover:border-secondary hover:bg-secondary hover:text-white'
                  : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="font-semibold text-sm">{slot.time}</div>
              <div className="text-xs opacity-75 capitalize">{slot.type}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Slots Available</h4>
          <p className="text-gray-600 text-sm mb-4">
            There are no available appointment slots for this date.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Choose Different Date
          </button>
        </div>
      )}
    </motion.div>
  )
}
