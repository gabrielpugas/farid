import { Appointment, Service, BusinessHours } from '../types';

// LocalStorage keys
const APPOINTMENTS_KEY = 'appointments';
const SERVICES_KEY = 'services';
const BUSINESS_HOURS_KEY = 'businessHours';

// Appointments
export const getAppointments = (): Appointment[] => {
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  const existingIndex = appointments.findIndex(a => a.id === appointment.id);
  
  if (existingIndex >= 0) {
    appointments[existingIndex] = {...appointment, updatedAt: new Date().toISOString()};
  } else {
    appointments.push({...appointment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()});
  }
  
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const deleteAppointment = (id: string): void => {
  const appointments = getAppointments();
  const filtered = appointments.filter(a => a.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
};

export const getAppointmentsByDate = (date: string): Appointment[] => {
  const appointments = getAppointments();
  return appointments.filter(a => a.date.split('T')[0] === date);
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  const appointments = getAppointments();
  return appointments.find(a => a.id === id);
};

// Services
export const getServices = (): Service[] => {
  const stored = localStorage.getItem(SERVICES_KEY);
  
  if (!stored) {
    // Initialize with default services if none exist
    const defaultServices: Service[] = [
      {
        id: '1',
        name: 'Standard Consultation',
        description: 'Regular 30-minute consultation',
        duration: 30,
        price: 50
      },
      {
        id: '2',
        name: 'Extended Consultation',
        description: 'In-depth 60-minute consultation',
        duration: 60,
        price: 90
      },
      {
        id: '3',
        name: 'Quick Check-up',
        description: 'Brief 15-minute check-up session',
        duration: 15,
        price: 30
      }
    ];
    localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
    return defaultServices;
  }
  
  return JSON.parse(stored);
};

export const saveService = (service: Service): void => {
  const services = getServices();
  const existingIndex = services.findIndex(s => s.id === service.id);
  
  if (existingIndex >= 0) {
    services[existingIndex] = service;
  } else {
    services.push({
      ...service, 
      id: service.id || Math.random().toString(36).substring(2, 9)
    });
  }
  
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const deleteService = (id: string): void => {
  const services = getServices();
  const filtered = services.filter(s => s.id !== id);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
};

// Business Hours
export const getBusinessHours = (): BusinessHours[] => {
  const stored = localStorage.getItem(BUSINESS_HOURS_KEY);
  
  if (!stored) {
    // Initialize with default business hours if none exist
    const defaultHours: BusinessHours[] = [
      { dayOfWeek: 0, isOpen: false, openTime: "09:00", closeTime: "17:00" }, // Sunday
      { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "17:00" }, // Monday
      { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "17:00" }, // Tuesday
      { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "17:00" }, // Wednesday
      { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "17:00" }, // Thursday
      { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "17:00" }, // Friday
      { dayOfWeek: 6, isOpen: false, openTime: "09:00", closeTime: "17:00" }  // Saturday
    ];
    localStorage.setItem(BUSINESS_HOURS_KEY, JSON.stringify(defaultHours));
    return defaultHours;
  }
  
  return JSON.parse(stored);
};

export const saveBusinessHours = (hours: BusinessHours[]): void => {
  localStorage.setItem(BUSINESS_HOURS_KEY, JSON.stringify(hours));
};

export const isBusinessOpen = (date: Date): boolean => {
  const businessHours = getBusinessHours();
  const dayOfWeek = date.getDay();
  const hourSettings = businessHours.find(h => h.dayOfWeek === dayOfWeek);
  
  if (!hourSettings || !hourSettings.isOpen) {
    return false;
  }
  
  const [openHour, openMinute] = hourSettings.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = hourSettings.closeTime.split(':').map(Number);
  
  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  
  const isAfterOpen = 
    currentHour > openHour || 
    (currentHour === openHour && currentMinute >= openMinute);
    
  const isBeforeClose = 
    currentHour < closeHour || 
    (currentHour === closeHour && currentMinute < closeMinute);
    
  return isAfterOpen && isBeforeClose;
};

export const getBusinessHoursForDay = (dayOfWeek: number): BusinessHours | undefined => {
  const businessHours = getBusinessHours();
  return businessHours.find(h => h.dayOfWeek === dayOfWeek);
};