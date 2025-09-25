// Mock data for development/testing purposes
import { Doctor } from '@/services/doctorsApi'

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

