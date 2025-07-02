import React, { useState } from 'react';
import { Appointment } from '../../types';
import Calendar from '../common/Calendar';
import { useAppointmentContext } from '../../context/AppointmentContext';
import { formatDate } from '../../utils/dateUtils';

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onDateSelect, selectedDate }) => {
  const { appointments } = useAppointmentContext();
  
  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const dateKey = appointment.date.split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(appointment);
    
    return acc;
  }, {} as Record<string, Appointment[]>);
  
  // Count appointments by date
  const getAppointmentCount = (date: Date) => {
    const dateKey = formatDate(date);
    return appointmentsByDate[dateKey]?.length || 0;
  };
  
  // Count confirmed appointments by date
  const getConfirmedCount = (date: Date) => {
    const dateKey = formatDate(date);
    return appointmentsByDate[dateKey]?.filter(a => a.status === 'confirmed').length || 0;
  };
  
  // Count pending appointments by date
  const getPendingCount = (date: Date) => {
    const dateKey = formatDate(date);
    return appointmentsByDate[dateKey]?.filter(a => a.status === 'pending').length || 0;
  };
  
  // Check if a date has appointments
  const hasAppointments = (date: Date) => {
    return getAppointmentCount(date) > 0;
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Calendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm">Selected Date</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-600 rounded-full mr-2"></div>
            <span className="text-sm">Today</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          <div className="text-sm text-gray-600">
            {getAppointmentCount(selectedDate)} appointments
          </div>
        </div>
        
        {hasAppointments(selectedDate) && (
          <div className="flex gap-2 mt-2">
            {getConfirmedCount(selectedDate) > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {getConfirmedCount(selectedDate)} confirmed
              </span>
            )}
            {getPendingCount(selectedDate) > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                {getPendingCount(selectedDate)} pending
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;