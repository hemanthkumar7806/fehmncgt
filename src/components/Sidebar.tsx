'use client'

import { useState } from 'react'
import { Menu, X, Home, User, Stethoscope, Calendar, CreditCard, UserCheck } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: User, label: 'About Fibroids', href: '#about-fibroids' },
    { icon: Stethoscope, label: 'Meet Dr. Liberman', href: '#dr-liberman' },
    { icon: Stethoscope, label: 'Our Services', href: '#services' },
    { icon: Calendar, label: 'Book Appointment', href: '#appointment' },
    { icon: CreditCard, label: 'Insurance & Billing', href: '#insurance' },
    { icon: UserCheck, label: 'Patient Portal', href: '#register' },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#093b60]">Holy Name</h1>
            <p className="text-sm text-[#01a69c] font-medium">Medical Center</p>
            <p className="text-xs text-gray-600 mt-1">Fibroid Care Specialists</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block p-3 rounded-lg hover:bg-[#093b60] hover:text-white transition-colors duration-200 text-[#093b60] font-medium"
                onClick={onToggle}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </a>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-[#093b60] mb-3">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#01a69c] rounded-full"></div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#01a69c] rounded-full"></div>
                <span>info@holyname.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#01a69c] rounded-full"></div>
                <span>123 Medical Center Dr</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium text-center">
              For emergencies, call 911
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
