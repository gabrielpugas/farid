import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Appointment, Service, BusinessHours, TimeSlot, AppointmentStatus } from '../types';
import { BusinessHoursResponse } from '../types';
const API_URL = import.meta.env.VITE_API_URL;


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

  useEffect(() => {
  fetch(`${API_URL}/business-hours`)
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
  fetch(`${API_URL}/services`)
    .then(res => res.json())
    .then(data => setServices(data))
    .catch(err => {
      console.error('Erro ao carregar serviços da API:', err);
      setServices([]);
    });

  // Agendamentos vindos da API
  fetch(`${API_URL}/appointments`)
    .then(res => res.json())
    .then(data => setAppointments(data))
    .catch(err => {
      console.error('Erro ao carregar agendamentos da API:', err);
      setAppointments([]);
    });
}, []);

  // Calculate available time slots whenever selectedDate or selectedService changes
  const refreshAvailableTimeSlots = useCallback(() => {
  if (!selectedDate || !selectedService) return;

  const dateStr = selectedDate.toISOString().split('T')[0];
  const serviceId = selectedService.id;

  fetch(`${API_URL}/available-times?date=${dateStr}&service_id=${serviceId}`)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar horários disponíveis');
      return res.json();
    })
    .then((data: { startTime: string; endTime: string }[]) => {
      const formattedSlots = data.map((slot, index) => ({
        id: `${slot.startTime}_${index}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: true
      }));
      setAvailableTimeSlots(formattedSlots);
    })
    .catch(err => {
      console.error('Erro ao carregar horários disponíveis:', err);
      setAvailableTimeSlots([]);
    });
  }, [selectedDate, selectedService]);
  
  useEffect(() => {
    refreshAvailableTimeSlots();
  }, [selectedDate, selectedService]);

  // Appointment operations
  const addAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await fetch(`${API_URL}/appointments`, {
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

  const updateAppointment = useCallback(async (appointment: Appointment) => {
  try {
    const response = await fetch(`${API_URL}/appointments/${appointment.id}`, {
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

  const getAppointmentsByDate = useCallback((date: Date) => {
  const dateStr = date.toISOString().split('T')[0];

  const filtered = appointments.filter(a => a.date.split('T')[0] === dateStr);

  return filtered;
}, [appointments]);

  // Service operations
  const addService = useCallback(async (serviceData: Omit<Service, 'id'>) => {
  try {
    const response = await fetch(`${API_URL}/services`, {
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

  const updateService = useCallback(async (service: Service) => {
  try {
    const response = await fetch(`${API_URL}/services/${service.id}`, {
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

  const removeService = useCallback(async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/services/${id}`, {
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
  const updateBusinessHours = useCallback(async (hours: BusinessHours[]) => {
  try {
    const response = await fetch(`${API_URL}/business-hours`, {
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