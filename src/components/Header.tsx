'use client'

import { useState } from 'react'
import { Menu, X, Phone, Calendar, Clock } from 'lucide-react'

interface HeaderProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Header({ isOpen, onToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Hamburger + Logo */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Button */}
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} className="text-[#093b60]" /> : <Menu size={24} className="text-[#093b60]" />}
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="/holy_name_logo.jpg" alt="Logo" width={200} height={100} />
                 <p className="text-lg text-gray-600 mt-1">Fibroid Care Specialists</p>

            </div>
          </div>

     

          {/* Right Section - Contact Info + CTA */}
          <div className="flex items-center space-x-4">
            {/* Contact Info (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-[#01a69c]" />
                <span className="text-gray-700">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock size={16} className="text-[#01a69c]" />
                <span className="text-gray-700">24/7 Emergency</span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="#appointment"
              className="inline-flex items-center space-x-2 bg-[#01a69c] hover:bg-[#01a69c]/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
            >
              <Calendar size={16} />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
