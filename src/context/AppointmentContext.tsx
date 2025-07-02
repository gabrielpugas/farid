import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Appointment, Service, BusinessHours, TimeSlot, AppointmentStatus } from '../types';
// import * as storage from '../utils/storage';
import { generateTimeSlots } from '../utils/dateUtils';
import { BusinessHoursResponse } from '../types';


interface AppointmentContextType {
  appointments: Appointment[];
  services: Service[];
  businessHours: BusinessHours[];
  selectedDate: Date;
  selectedService: Service | null;
  availableTimeSlots: TimeSlot[];
  setSelectedDate: (date: Date) => void;
  setSelectedService: (service: Service | null) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  removeService: (id: string) => void;
  updateBusinessHours: (hours: BusinessHours[]) => void;
  getAppointmentsByDate: (date: Date) => Appointment[];
  refreshAvailableTimeSlots: () => void;
}

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  // Initialize data from localStorage
  // useEffect(() => {
  //   const storedAppointments = storage.getAppointments();
  //   const storedServices = storage.getServices();
  //   const storedBusinessHours = storage.getBusinessHours();
    
  //   setAppointments(storedAppointments);
  //   setServices(storedServices);
  //   setBusinessHours(storedBusinessHours);
  // }, []);
  useEffect(() => {
  fetch('http://localhost:3001/business-hours')
  .then(res => res.json())
  .then(data => {
  const mapped = data.map((item: BusinessHoursResponse) => ({
  dayOfWeek: item.day_of_week,
  isOpen: item.is_open,
  openTime: item.open_time,
  closeTime: item.close_time
}));
  setBusinessHours(mapped);
  })
  .catch(err => {
    console.error('Erro ao carregar business hours da API:', err);
    setBusinessHours([]); // fallback
  });

  // Serviços vindos da API
  fetch('http://localhost:3001/services')
    .then(res => res.json())
    .then(data => setServices(data))
    .catch(err => {
      console.error('Erro ao carregar serviços da API:', err);
      setServices([]);
    });

  // Agendamentos vindos da API
  fetch('http://localhost:3001/appointments')
    .then(res => res.json())
    .then(data => setAppointments(data))
    .catch(err => {
      console.error('Erro ao carregar agendamentos da API:', err);
      setAppointments([]);
    });
}, []);

  // Calculate available time slots whenever selectedDate or selectedService changes
  const refreshAvailableTimeSlots = useCallback(() => {
    if (!selectedDate) return;
    
    const dayOfWeek = selectedDate.getDay();
    const daySettings = businessHours.find(h => h.dayOfWeek === dayOfWeek);
    
    if (!daySettings || !daySettings.isOpen) {
      setAvailableTimeSlots([]);
      return;
    }
    
    // Generate all possible time slots for the day
    const duration = selectedService ? selectedService.duration : 30; // default to 30 minutes if no service selected
    const allTimeSlots = generateTimeSlots(
      selectedDate,
      daySettings.openTime,
      daySettings.closeTime,
      duration
    );
    
    // Filter out slots that overlap with existing appointments
    const dateStr = selectedDate.toISOString().split('T')[0];
    // const appointmentsOnDate = appointments.filter(
    //   a => a.date.split('T')[0] === dateStr && a.status !== AppointmentStatus.CancelledByAdmin
    // );
    const appointmentsOnDate = appointments.filter(
  a =>
    a.date.split('T')[0] === dateStr &&
    ![
      AppointmentStatus.CancelledByAdmin,
      AppointmentStatus.CancelledByClient,
      AppointmentStatus.NoShow
    ].includes(a.status)
    );
    
    const availableSlots = allTimeSlots.filter(slot => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      
      // Check if the slot overlaps with any existing appointment
      const isOverlapping = appointmentsOnDate.some(appointment => {
        const appointmentStart = new Date(appointment.timeSlot.startTime);
        const appointmentEnd = new Date(appointment.timeSlot.endTime);
        
        return (
          (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
          (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
        );
      });
      
      return !isOverlapping;
    });
    
    setAvailableTimeSlots(availableSlots);
  }, [selectedDate, selectedService, appointments, businessHours]);

  useEffect(() => {
    refreshAvailableTimeSlots();
  }, [refreshAvailableTimeSlots]);

  // Appointment operations
  // const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  //   const newAppointment: Appointment = {
  //     ...appointmentData,
  //     id: Math.random().toString(36).substring(2, 9),
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString()
  //   };
    
  //   storage.saveAppointment(newAppointment);
  //   setAppointments(prev => [...prev, newAppointment]);
  //   return newAppointment;
  // }, []);
  const addAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await fetch('http://localhost:3001/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    if (!response.ok) {
      throw new Error('Erro ao criar agendamento');
    }

    const created: Appointment = await response.json();
    setAppointments(prev => [...prev, created]);
    return created;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return null;
  }
}, []);

  // const updateAppointment = useCallback((appointment: Appointment) => {
  //   storage.saveAppointment(appointment);
  //   setAppointments(prev => prev.map(a => a.id === appointment.id ? appointment : a));
  // }, []);
  const updateAppointment = useCallback(async (appointment: Appointment) => {
  try {
    const response = await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar agendamento');
    }

    setAppointments(prev =>
      prev.map(a => (a.id === appointment.id ? appointment : a))
    );
    console.log('✅ Agendamento atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
  }
}, []);

  const getAppointment = useCallback((id: string) => {
    return appointments.find(a => a.id === id);
  }, [appointments]);

  // const deleteAppointment = useCallback((id: string) => {
  //   storage.deleteAppointment(id);
  //   setAppointments(prev => prev.filter(a => a.id !== id));
  // }, []);
  const deleteAppointment = useCallback(async (id: string) => {
  const appointment = getAppointment(id);
  if (appointment) {
    await updateAppointment({
      ...appointment,
      status: AppointmentStatus.CancelledByAdmin,
      updatedAt: new Date().toISOString()
    });

    setAppointments(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, status: AppointmentStatus.CancelledByAdmin, updatedAt: new Date().toISOString() }
          : a
      )
    );
  }
}, [getAppointment, updateAppointment]);

  

  // const getAppointmentsByDate = useCallback((date: Date) => {
  //   const dateStr = date.toISOString().split('T')[0];
  //   return appointments.filter(a => a.date.split('T')[0] === dateStr);
  // }, [appointments]);

  const getAppointmentsByDate = useCallback((date: Date) => {
  const dateStr = date.toISOString().split('T')[0];

  const filtered = appointments.filter(a => a.date.split('T')[0] === dateStr);

  return filtered;
}, [appointments]);

  // Service operations
  // const addService = useCallback((serviceData: Omit<Service, 'id'>) => {
  //   const newService: Service = {
  //     ...serviceData,
  //     id: Math.random().toString(36).substring(2, 9)
  //   };
    
  //   storage.saveService(newService);
  //   setServices(prev => [...prev, newService]);
  // }, []);

  const addService = useCallback(async (serviceData: Omit<Service, 'id'>) => {
  try {
    const response = await fetch('http://localhost:3001/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
      throw new Error('Erro ao cadastrar serviço');
    }

    const created: Service = await response.json();
    setServices(prev => [...prev, created]);
    console.log('✅ Serviço adicionado com sucesso');
  } catch (error) {
    console.error('🛑 Erro ao adicionar serviço:', error);
  }
  }, []);

  // const updateService = useCallback((service: Service) => {
  //   storage.saveService(service);
  //   setServices(prev => prev.map(s => s.id === service.id ? service : s));
  // }, []);
  const updateService = useCallback(async (service: Service) => {
  try {
    const response = await fetch(`http://localhost:3001/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar serviço');
    }

    setServices(prev =>
      prev.map(s => (s.id === service.id ? service : s))
    );
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
  }
  }, []);


  // const removeService = useCallback((id: string) => {
  //   storage.deleteService(id);
  //   setServices(prev => prev.filter(s => s.id !== id));
  // }, []);
  const removeService = useCallback(async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3001/services/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir serviço');
    }

    setServices(prev => prev.filter(s => s.id !== id));
    console.log('🗑️ Serviço marcado como desativado');
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
  }
}, []);

  // Business hours operations
  // const updateBusinessHours = useCallback((hours: BusinessHours[]) => {
  //   storage.saveBusinessHours(hours);
  //   setBusinessHours(hours);
  // }, []);
  const updateBusinessHours = useCallback(async (hours: BusinessHours[]) => {
  try {
    const response = await fetch('http://localhost:3001/business-hours', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hours)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar horários comerciais');
    }

    // Atualiza estado local após sucesso no backend
    setBusinessHours(hours);
    console.log('✅ Business hours salvos com sucesso');
  } catch (error) {
    console.error('🛑 Falha ao salvar business hours:', error);
    // Aqui você pode adicionar um toast ou mensagem de erro no front
  }
  }, []);

  const value = {
    appointments,
    services,
    businessHours,
    selectedDate,
    selectedService,
    availableTimeSlots,
    setSelectedDate,
    setSelectedService,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    addService,
    updateService,
    removeService,
    updateBusinessHours,
    getAppointmentsByDate,
    refreshAvailableTimeSlots
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the appointment context
export const useAppointmentContext = (): AppointmentContextType => {
  const context = React.useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  return context;
};