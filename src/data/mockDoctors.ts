// Mock data for development/testing purposes
import { Doctor, AvailableDate } from '@/services/doctorsApi'

export const mockDoctors: Doctor[] = [
  {
    _id: "mock-1",
    name: "Dr. Eric Liberman",
    title: "Interventional Radiologist",
    credentials: "DO, FSIR",
    specialties: ["Uterine Fibroid Embolization", "Interventional Radiology", "Women's Health"],
    experience: "15+ years",
    description: "Dr. Eric Liberman is board-certified in Obstetrics and Gynecology and fellowship-trained in Minimally Invasive Gynecologic Surgery (MIGS). He obtained a Focused Practice Designation in MIGS and is the Director of Minimally Invasive Gynecologic Surgery at Holy Name.",
    about: "Dr. Eric Liberman is board-certified in Obstetrics and Gynecology and fellowship-trained in Minimally Invasive Gynecologic Surgery (MIGS). He obtained a Focused Practice Designation in MIGS and is the Director of Minimally Invasive Gynecologic Surgery at Holy Name.\n\nDr. Liberman provides patient-centered care tailored to each person and values a teams-based approach to treatment. He's proud to be at Holy Name, where the commitment to compassionate, comprehensive care reflects his own philosophy of a patient-centered approach. The most rewarding part of his work, he says, is hearing how his patients' quality of life has improved after treatment.\n\nDr. Liberman's special interests include abnormal uterine bleeding, fibroids, endometrial polyps, adenomyosis, ovarian cysts, endometriosis, and pelvic pain. His expertise includes Da Vinci robotic-assisted surgery, laparoscopic surgery, and hysteroscopy.\n\nDr. Liberman attended medical school at the New York College of Osteopathic Medicine and completed his internship and residency at Saint Barnabas Medical Center in Livingston, NJ. He then further subspecialized by completing a fellowship in Minimally Invasive Gynecologic Surgery at Montefiore Medical Center, Albert Einstein College of Medicine in Bronx, NY, where he also held academic appointments. Over the past six years Dr. Liberman has served as the Director of Minimally Invasive Gynecologic Surgery at other institutions in New Jersey, including Morristown Medical Center and Cooperman Barnabas Medical Center.\n\nDr. Liberman has published research on topics such as post-operative pain management and robotic-assisted surgery. His work has been published in esteemed medical journals and presented across North America. Dr. Liberman also serves as faculty at national conferences.",
    education: {
      medicalSchool: "New York College of Osteopathic Medicine",
      internship: "Saint Barnabas Medical Center",
      residency: "Saint Barnabas Medical Center",
      fellowship: "Montefiore Medical Center"
    },
    photo: {
      asset: {
        url: "/Eric Liberman, DO - 2.jpg"
      }
    },
    npi: "1234567890",
    contactInfo: {
      phone: "201-833-7212",
      email: "eric.liberman@hnmc.com",
      addressLine1: "222 Cedar Lane, Suite 303 Teaneck",
      city: "Teaneck",
      state: "NJ"
    },
    organization: {
      organizationId: "org-001",
      organizationName: "Holy Name Medical Center"
    }
  },
  {
    _id: "mock-2",
    name: "Dr. Diana Hearn",
    title: "Gynecologist",
    credentials: "MD, FACOG",
    specialties: ["Minimally Invasive Surgery", "Fibroid Treatment", "Reproductive Health"],
    experience: "12+ years",
    photo: {
      asset: {
        url: "/Diana Hearn, MD - 5.jpg"
      }
    },
    npi: "1234567891",
    contactInfo: {
      phone: "(555) 123-4568",
      email: "diana.hearn@hnmc.com",
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
    name: "Dr. Jason Kanos",
    title: "Reproductive Endocrinologist",
    credentials: "MD, PhD, REI",
    specialties: ["Fertility Treatment", "Fibroid Impact on Fertility", "Hormonal Health"],
    experience: "10+ years",
    photo: {
      asset: {
        url: "/Jason Kanos MD 03.JPG"
      }
    },
    npi: "1234567892",
    contactInfo: {
      phone: "(555) 123-4569",
      email: "jason.kanos@hnmc.com",
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
    name: "Dr. Payal Shah",
    title: "Interventional Radiologist",
    credentials: "MD, FSIR, FACR",
    specialties: ["UFE Procedures", "Image-Guided Therapy", "Pain Management"],
    experience: "18+ years",
    photo: {
      asset: {
        url: "/Payal Shah, MD - 7.jpg"
      }
    },
    npi: "1234567893",
    contactInfo: {
      phone: "(555) 123-4570",
      email: "payal.shah@hnmc.com",
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
        url: "/Eric Liberman, DO - 2.jpg"
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
        url: "/Diana Hearn, MD - 5.jpg"
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

