export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  CancelledByAdmin = 'cancelled_by_admin',
  NoShow = 'no_show',
  CancelledByClient = 'cancelled_by_client'
}

export type TimeSlot = {
  id: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  isAvailable: boolean;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
};

export type Appointment = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  date: string; // ISO string for the date
  timeSlot: TimeSlot;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type BusinessHours = {
  dayOfWeek: number; // 0-6, where 0 is Sunday
  isOpen: boolean;
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
};

export type BusinessHoursResponse = {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
};
