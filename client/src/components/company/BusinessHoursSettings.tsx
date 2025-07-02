import React, { useState } from 'react';
import { BusinessHours } from '../../types';
import Button from '../common/Button';

interface BusinessHoursSettingsProps {
  businessHours: BusinessHours[];
  onSave: (hours: BusinessHours[]) => void;
}

const BusinessHoursSettings: React.FC<BusinessHoursSettingsProps> = ({
  businessHours,
  onSave
}) => {
  const [hours, setHours] = useState<BusinessHours[]>(businessHours);
  const [isEditing, setIsEditing] = useState(false);
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Toggle day open/closed
  const toggleDay = (dayOfWeek: number) => {
    setHours(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, isOpen: !day.isOpen }
          : day
      )
    );
  };
  
  // Update open time
  const updateOpenTime = (dayOfWeek: number, time: string) => {
    setHours(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, openTime: time }
          : day
      )
    );
  };
  
  // Update close time
  const updateCloseTime = (dayOfWeek: number, time: string) => {
    setHours(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, closeTime: time }
          : day
      )
    );
  };
  
  // Handle save
  const handleSave = () => {
    onSave(hours);
    setIsEditing(false);
  };
  
  // Handle cancel
  const handleCancel = () => {
    setHours(businessHours);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Business Hours</h2>
        {!isEditing && (
          <Button 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            Edit Hours
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {hours.map(day => (
          <div key={day.dayOfWeek} className="flex flex-wrap items-center gap-3">
            <div className="w-24">
              <span className="font-medium">{dayNames[day.dayOfWeek]}</span>
            </div>
            
            {isEditing ? (
              <>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={day.isOpen}
                    onChange={() => toggleDay(day.dayOfWeek)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Open</span>
                </label>
                
                {day.isOpen && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => updateOpenTime(day.dayOfWeek, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => updateCloseTime(day.dayOfWeek, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                )}
              </>
            ) : (
              <div>
                {day.isOpen ? (
                  <span>
                    {day.openTime} - {day.closeTime}
                  </span>
                ) : (
                  <span className="text-gray-500">Closed</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isEditing && (
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessHoursSettings;