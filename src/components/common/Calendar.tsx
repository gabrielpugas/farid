import React from 'react';
import { getDatesInMonth, getDayName, isPastDate, isToday } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = React.useState<number>(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = React.useState<number>(selectedDate.getFullYear());
  
  // Get days in the current month
  const daysInMonth = getDatesInMonth(currentYear, currentMonth);
  
  // Get days from previous month to fill the first week
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
    const day = new Date(currentYear, currentMonth, 0);
    day.setDate(day.getDate() - i);
    return day;
  }).reverse();
  
  // Get days from next month to fill the last week
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDay();
  const nextMonthDays = Array.from({ length: 6 - lastDayOfMonth }, (_, i) => {
    const day = new Date(currentYear, currentMonth + 1, i + 1);
    return day;
  });
  
  // All days to display
  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Check if a date is the selected date
  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  // Format the month and year header
  const monthYearHeader = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  // Days of the week
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{monthYearHeader}</h2>
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth;
          const isPast = isPastDate(date);
          const isToday_ = isToday(date);
          const isSelected = isSelectedDate(date);
          
          return (
            <button
              key={index}
              onClick={() => !isPast && onDateSelect(date)}
              disabled={isPast}
              className={`
                h-10 w-full rounded-md flex items-center justify-center text-sm
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${isToday_ && !isSelected ? 'border-2 border-blue-600' : ''}
                ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;