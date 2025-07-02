import React, { useState } from 'react';
import { Appointment, Service } from '../../types';
import Button from '../common/Button';
import { Check, X, Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react';

interface AppointmentDetailsProps {
  appointment: Appointment;
  service: Service | undefined;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onClose: () => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  service,
  onConfirm,
  onCancel,
  onClose
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    onConfirm(appointment.id);
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsCancelling(true);
    onCancel(appointment.id);
    setIsCancelling(false);
  };

  // Format date and time
  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(appointment.timeSlot.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Get status class
  const cancelledStatuses = ['cancelled_by_admin', 'cancelled_by_client', 'no_show'];

const getStatusClass = (status: Appointment['status']) => {
  if (status === 'confirmed') return 'bg-green-100 text-green-800';
  if (status === 'pending') return 'bg-amber-100 text-amber-800';
  if (cancelledStatuses.includes(status)) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
};

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Appointment Details</h2>
        <span
          className={`px-3 py-1 rounded-full font-medium ${getStatusClass(appointment.status)}`}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Client Information</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <User size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="font-medium">{appointment.clientName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              <div>
                <p>{appointment.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="text-gray-500 mr-3" />
              <div>
                <p>{appointment.clientPhone}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-3">Appointment Information</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar size={18} className="text-gray-500 mr-3" />
              <div>
                <p>{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="text-gray-500 mr-3" />
              <div>
                <p>{formattedTime}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-[18px] w-[18px] flex items-center justify-center text-gray-500 mr-3">
                <span className="font-bold text-sm">S</span>
              </div>
              <div>
                <p>{service?.name || 'Unknown service'}</p>
                {service && (
                  <p className="text-sm text-gray-500">
                    {service.duration} minutes - ${service.price}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {appointment.notes && (
        <div className="mb-8">
          <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex">
              <FileText size={18} className="text-gray-500 mr-3 flex-shrink-0" />
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>

        {appointment.status === 'pending' && (
          <>
            <Button 
              variant="danger" 
              onClick={handleCancel}
              disabled={isCancelling}
              icon={<X size={16} />}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
            </Button>
            <Button 
              variant="success" 
              onClick={handleConfirm}
              disabled={isConfirming}
              icon={<Check size={16} />}
            >
              {isConfirming ? 'Confirming...' : 'Confirm Appointment'}
            </Button>
          </>
        )}

        {appointment.status === 'confirmed' && (
          <Button 
            variant="danger" 
            onClick={handleCancel}
            disabled={isCancelling}
            icon={<X size={16} />}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;