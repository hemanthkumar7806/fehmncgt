// Mock data for development/testing purposes
import { Doctor, AvailableDate } from '@/services/doctorsApi'

export const mockDoctors: Doctor[] = [
  {
    _id: "mock-1",
    name: "Dr. Sarah Johnson",
    title: "Interventional Radiologist",
    credentials: "MD, FSIR",
    specialties: ["Uterine Fibroid Embolization", "Interventional Radiology", "Women's Health"],
    experience: "15+ years",
    photo: {
      asset: {
        url: "/dr_eric_liberman.webp"
      }
    },
    npi: "1234567890",
    contactInfo: {
      phone: "(555) 123-4567",
      email: "sarah.johnson@hnmc.com",
      addressLine1: "123 Medical Center Dr",
      city: "New York",
      state: "NY"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  },
  {
    _id: "mock-2",
    name: "Dr. Michael Chen",
    title: "Gynecologist",
    credentials: "MD, FACOG",
    specialties: ["Minimally Invasive Surgery", "Fibroid Treatment", "Reproductive Health"],
    experience: "12+ years",
    photo: {
      asset: {
        url: "/dr_eric_liberman.webp"
      }
    },
    npi: "1234567891",
    contactInfo: {
      phone: "(555) 123-4568",
      email: "michael.chen@hnmc.com",
      addressLine1: "123 Medical Center Dr",
      city: "New York",
      state: "NY"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  },
  {
    _id: "mock-3",
    name: "Dr. Emily Rodriguez",
    title: "Reproductive Endocrinologist",
    credentials: "MD, PhD, REI",
    specialties: ["Fertility Treatment", "Fibroid Impact on Fertility", "Hormonal Health"],
    experience: "10+ years",
    photo: {
      asset: {
        url: "/dr_eric_liberman.webp"
      }
    },
    npi: "1234567892",
    contactInfo: {
      phone: "(555) 123-4569",
      email: "emily.rodriguez@hnmc.com",
      addressLine1: "123 Medical Center Dr",
      city: "New York",
      state: "NY"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  },
  {
    _id: "mock-4",
    name: "Dr. David Williams",
    title: "Interventional Radiologist",
    credentials: "MD, FSIR, FACR",
    specialties: ["UFE Procedures", "Image-Guided Therapy", "Pain Management"],
    experience: "18+ years",
    photo: {
      asset: {
        url: "/dr_eric_liberman.webp"
      }
    },
    npi: "1234567893",
    contactInfo: {
      phone: "(555) 123-4570",
      email: "david.williams@hnmc.com",
      addressLine1: "123 Medical Center Dr",
      city: "New York",
      state: "NY"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  },
  {
    _id: "mock-5",
    name: "Dr. Lisa Thompson",
    title: "Gynecologic Surgeon",
    credentials: "MD, FACS",
    specialties: ["Laparoscopic Surgery", "Robotic Surgery", "Complex Fibroid Cases"],
    experience: "14+ years",
    photo: {
      asset: {
        url: "/dr_eric_liberman.webp"
      }
    },
    npi: "1234567894",
    contactInfo: {
      phone: "(555) 123-4571",
      email: "lisa.thompson@hnmc.com",
      addressLine1: "123 Medical Center Dr",
      city: "New York",
      state: "NY"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  },
  {
    _id: "mock-6",
    name: "Dr. Robert Martinez",
    title: "Interventional Radiologist",
    credentials: "MD, FSIR",
    specialties: ["Vascular Interventions", "Fibroid Embolization", "Clinical Research"],
    experience: "20+ years",
    photo: {
      asset: {
        url: "/dr_eric_liberman.webp"
      }
    },
    npi: "1234567895",
    contactInfo: {
      phone: "(555) 123-4572",
      email: "robert.martinez@hnmc.com",
      addressLine1: "123 Medical Center Dr",
      city: "New York",
      state: "NY"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  }
]

// Mock time slots for development
export const mockTimeSlots = [
  { time: "9:00 AM", available: true, type: "consultation" as const, startTime: "09:00", endTime: "09:30", slotTypes: ["consultation"] },
  { time: "9:30 AM", available: true, type: "consultation" as const, startTime: "09:30", endTime: "10:00", slotTypes: ["consultation"] },
  { time: "10:00 AM", available: false, type: "consultation" as const, startTime: "10:00", endTime: "10:30", slotTypes: ["consultation"] },
  { time: "10:30 AM", available: true, type: "follow-up" as const, startTime: "10:30", endTime: "11:00", slotTypes: ["follow-up"] },
  { time: "11:00 AM", available: true, type: "consultation" as const, startTime: "11:00", endTime: "11:30", slotTypes: ["consultation"] },
  { time: "11:30 AM", available: false, type: "consultation" as const, startTime: "11:30", endTime: "12:00", slotTypes: ["consultation"] },
  { time: "2:00 PM", available: true, type: "consultation" as const, startTime: "14:00", endTime: "14:30", slotTypes: ["consultation"] },
  { time: "2:30 PM", available: true, type: "follow-up" as const, startTime: "14:30", endTime: "15:00", slotTypes: ["follow-up"] },
  { time: "3:00 PM", available: true, type: "consultation" as const, startTime: "15:00", endTime: "15:30", slotTypes: ["consultation"] },
  { time: "3:30 PM", available: false, type: "consultation" as const, startTime: "15:30", endTime: "16:00", slotTypes: ["consultation"] },
  { time: "4:00 PM", available: true, type: "consultation" as const, startTime: "16:00", endTime: "16:30", slotTypes: ["consultation"] },
  { time: "4:30 PM", available: true, type: "follow-up" as const, startTime: "16:30", endTime: "17:00", slotTypes: ["follow-up"] }
]

// Mock available dates for development
export const mockAvailableDates: AvailableDate[] = [
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    slotsCount: 8,
    hasSlots: true,
    slots: [
      { time: "9:00 AM", available: true, type: "consultation" as const, startTime: "09:00", endTime: "09:30", slotTypes: ["consultation"] },
      { time: "9:30 AM", available: true, type: "consultation" as const, startTime: "09:30", endTime: "10:00", slotTypes: ["consultation"] },
      { time: "10:30 AM", available: true, type: "follow-up" as const, startTime: "10:30", endTime: "11:00", slotTypes: ["follow-up"] },
      { time: "11:00 AM", available: true, type: "consultation" as const, startTime: "11:00", endTime: "11:30", slotTypes: ["consultation"] },
      { time: "2:00 PM", available: true, type: "consultation" as const, startTime: "14:00", endTime: "14:30", slotTypes: ["consultation"] },
      { time: "2:30 PM", available: true, type: "follow-up" as const, startTime: "14:30", endTime: "15:00", slotTypes: ["follow-up"] },
      { time: "3:00 PM", available: true, type: "consultation" as const, startTime: "15:00", endTime: "15:30", slotTypes: ["consultation"] },
      { time: "4:00 PM", available: true, type: "consultation" as const, startTime: "16:00", endTime: "16:30", slotTypes: ["consultation"] }
    ]
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    slotsCount: 6,
    hasSlots: true,
    slots: [
      { time: "9:00 AM", available: true, type: "consultation" as const, startTime: "09:00", endTime: "09:30", slotTypes: ["consultation"] },
      { time: "10:00 AM", available: true, type: "consultation" as const, startTime: "10:00", endTime: "10:30", slotTypes: ["consultation"] },
      { time: "11:30 AM", available: true, type: "follow-up" as const, startTime: "11:30", endTime: "12:00", slotTypes: ["follow-up"] },
      { time: "2:00 PM", available: true, type: "consultation" as const, startTime: "14:00", endTime: "14:30", slotTypes: ["consultation"] },
      { time: "3:30 PM", available: true, type: "consultation" as const, startTime: "15:30", endTime: "16:00", slotTypes: ["consultation"] },
      { time: "4:30 PM", available: true, type: "follow-up" as const, startTime: "16:30", endTime: "17:00", slotTypes: ["follow-up"] }
    ]
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    slotsCount: 10,
    hasSlots: true,
    slots: [
      { time: "8:30 AM", available: true, type: "consultation" as const, startTime: "08:30", endTime: "09:00", slotTypes: ["consultation"] },
      { time: "9:00 AM", available: true, type: "consultation" as const, startTime: "09:00", endTime: "09:30", slotTypes: ["consultation"] },
      { time: "9:30 AM", available: true, type: "consultation" as const, startTime: "09:30", endTime: "10:00", slotTypes: ["consultation"] },
      { time: "10:00 AM", available: false, type: "consultation" as const, startTime: "10:00", endTime: "10:30", slotTypes: ["consultation"] },
      { time: "10:30 AM", available: true, type: "follow-up" as const, startTime: "10:30", endTime: "11:00", slotTypes: ["follow-up"] },
      { time: "11:00 AM", available: true, type: "consultation" as const, startTime: "11:00", endTime: "11:30", slotTypes: ["consultation"] },
      { time: "2:00 PM", available: true, type: "consultation" as const, startTime: "14:00", endTime: "14:30", slotTypes: ["consultation"] },
      { time: "2:30 PM", available: true, type: "follow-up" as const, startTime: "14:30", endTime: "15:00", slotTypes: ["follow-up"] },
      { time: "3:00 PM", available: true, type: "consultation" as const, startTime: "15:00", endTime: "15:30", slotTypes: ["consultation"] },
      { time: "4:00 PM", available: true, type: "consultation" as const, startTime: "16:00", endTime: "16:30", slotTypes: ["consultation"] }
    ]
  },
  {
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    slotsCount: 4,
    hasSlots: true,
    slots: [
      { time: "9:00 AM", available: true, type: "consultation" as const, startTime: "09:00", endTime: "09:30", slotTypes: ["consultation"] },
      { time: "11:00 AM", available: true, type: "consultation" as const, startTime: "11:00", endTime: "11:30", slotTypes: ["consultation"] },
      { time: "2:00 PM", available: true, type: "follow-up" as const, startTime: "14:00", endTime: "14:30", slotTypes: ["follow-up"] },
      { time: "3:30 PM", available: true, type: "consultation" as const, startTime: "15:30", endTime: "16:00", slotTypes: ["consultation"] }
    ]
  },
  {
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    slotsCount: 7,
    hasSlots: true,
    slots: [
      { time: "9:00 AM", available: true, type: "consultation" as const, startTime: "09:00", endTime: "09:30", slotTypes: ["consultation"] },
      { time: "9:30 AM", available: true, type: "consultation" as const, startTime: "09:30", endTime: "10:00", slotTypes: ["consultation"] },
      { time: "10:30 AM", available: true, type: "follow-up" as const, startTime: "10:30", endTime: "11:00", slotTypes: ["follow-up"] },
      { time: "11:30 AM", available: true, type: "consultation" as const, startTime: "11:30", endTime: "12:00", slotTypes: ["consultation"] },
      { time: "2:30 PM", available: true, type: "follow-up" as const, startTime: "14:30", endTime: "15:00", slotTypes: ["follow-up"] },
      { time: "3:00 PM", available: true, type: "consultation" as const, startTime: "15:00", endTime: "15:30", slotTypes: ["consultation"] },
      { time: "4:30 PM", available: true, type: "follow-up" as const, startTime: "16:30", endTime: "17:00", slotTypes: ["follow-up"] }
    ]
  }
]

