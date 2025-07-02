/**
 * Format a date as YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format a time from HH:MM to a more readable format
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

/**
 * Get a list of dates for the current month
 */
export const getDatesInMonth = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  // const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month, day));
  }
  
  return dates;
};

/**
 * Get a list of dates for the current week
 */
export const getDatesInWeek = (date: Date): Date[] => {
  const dates: Date[] = [];
  const currentDay = date.getDay();
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - currentDay);
  
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + i);
    dates.push(newDate);
  }
  
  return dates;
};

/**
 * Get the name of a day of the week
 */
export const getDayName = (date: Date, short = false): string => {
  if (short) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Get the name of a month
 */
export const getMonthName = (date: Date, short = false): string => {
  if (short) {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'long' });
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Generate time slots based on business hours
 */
export const generateTimeSlots = (
  date: Date, 
  openTime: string, 
  closeTime: string, 
  slotDuration: number // in minutes
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
  const startDate = new Date(date);
  startDate.setHours(openHour, openMinute, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(closeHour, closeMinute, 0, 0);
  
  const currentSlot = new Date(startDate);
  
  while (currentSlot < endDate) {
    const startTime = new Date(currentSlot);
    
    // Calculate end time
    const endTime = new Date(currentSlot);
    endTime.setMinutes(endTime.getMinutes() + slotDuration);
    
    // Don't add slots that extend beyond closing time
    if (endTime <= endDate) {
      slots.push({
        id: `${startTime.toISOString()}-${endTime.toISOString()}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isAvailable: true
      });
    }
    
    // Move to next slot
    currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
  }
  
  return slots;
};