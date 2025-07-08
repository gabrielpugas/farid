import React from 'react';
import { TimeSlot } from '../../types';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot
}) => {
  // Format time from ISO string to readable format
  // const formatTime = (isoTime: string) => {
  //   const date = new Date(isoTime);
  //   return date.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // };
  const formatTime = (isoTime: string) => {
  const date = new Date(isoTime);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  });
  };

  // Group time slots by morning, afternoon, evening
  const morningSlots = timeSlots.filter(
    slot => {
      const hour = new Date(slot.startTime).getHours();
      return hour >= 0 && hour < 12;
    }
  );
  
  const afternoonSlots = timeSlots.filter(
    slot => {
      const hour = new Date(slot.startTime).getHours();
      return hour >= 12 && hour < 17;
    }
  );
  
  const eveningSlots = timeSlots.filter(
    slot => {
      const hour = new Date(slot.startTime).getHours();
      return hour >= 17;
    }
  );

  // Check if a time slot is selected
  const isSelected = (timeSlot: TimeSlot) => {
    if (!selectedTimeSlot) return false;
    return timeSlot.id === selectedTimeSlot.id;
  };

  // Render a group of time slots
  const renderTimeSlotGroup = (slots: TimeSlot[], title: string) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {slots.map(slot => (
            <button
              key={slot.id}
              onClick={() => onSelectTimeSlot(slot)}
              className={`
                py-2 px-3 rounded-md text-sm font-medium 
                transition-all duration-200 text-center
                ${isSelected(slot)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              `}
            >
              {formatTime(slot.startTime)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      {timeSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No available time slots for this date.</p>
          <p className="text-gray-500 text-sm mt-1">Please select another date or service.</p>
        </div>
      ) : (
        <>
          {renderTimeSlotGroup(morningSlots, 'Morning')}
          {renderTimeSlotGroup(afternoonSlots, 'Afternoon')}
          {renderTimeSlotGroup(eveningSlots, 'Evening')}
        </>
      )}
    </div>
  );
};

export default TimeSlotPicker;