'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useDoctors } from '@/hooks/useDoctors';

interface Doctor {
  _id?: string;
  name?: string;
  npi?: string;
  title?: string;
  description?: string;
  specialties?: string[];
  photo?: any;
  organization?: {
    organizationId?: string;
    organizationName?: string;
  };
}

interface DoctorContextType {
  doctors: Doctor[];
  isApiResolved: boolean;
  error: string | null;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children, specialityCode }: { children: ReactNode; specialityCode?: string }) {
  const { doctors, isApiResolved, error } = useDoctors(specialityCode || process.env.NEXT_PUBLIC_SPECIALITY_CODE || 'HNMPDL');

  return (
    <DoctorContext.Provider value={{ doctors, isApiResolved, error }}>
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctorContext() {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctorContext must be used within a DoctorProvider');
  }
  return context;
}
