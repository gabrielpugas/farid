import React from 'react';
import { Appointment, Service } from '../../types';
import { Clock, Calendar, User, Mail, Phone, FileText } from 'lucide-react';
import Button from '../common/Button';

interface AppointmentListProps {
  appointments: Appointment[];
  services: Service[];
  onViewDetails: (appointmentId: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  services,
  onViewDetails
}) => {
  // Get service by ID
  const getServiceById = (serviceId: string) => {
    return services.find(service => service.id === serviceId);
  };

  // Format the time slot
  const formatTimeSlot = (timeSlot: Appointment['timeSlot']) => {
    const startTime = new Date(timeSlot.startTime);
    return startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status class for styling
  const getStatusClass = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No appointments found for this date.</p>
        </div>
      ) : (
        appointments.map(appointment => {
          const service = getServiceById(appointment.serviceId);
          return (
            <div
              key={appointment.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg text-gray-900">
                  {appointment.clientName}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${getStatusClass(appointment.status)}`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Clock size={16} className="mr-2" />
                  <span>{formatTimeSlot(appointment.timeSlot)}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <User size={16} className="mr-2" />
                  <span>{service?.name || 'Service unavailable'}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Mail size={16} className="mr-2" />
                  <span className="text-sm">{appointment.clientEmail}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Phone size={16} className="mr-2" />
                  <span>{appointment.clientPhone}</span>
                </div>

                {appointment.notes && (
                  <div className="flex items-start text-gray-700 md:col-span-2">
                    <FileText size={16} className="mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm">{appointment.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onViewDetails(appointment.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AppointmentList;