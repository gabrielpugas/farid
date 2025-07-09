import React, { useState } from 'react';
import Button from '../common/Button';
import { Service, TimeSlot } from '../../types';
const API_URL = import.meta.env.VITE_API_URL;
// import { useAppointmentContext } from '../../context/AppointmentContext';

interface AppointmentFormProps {
  selectedService: Service;
  selectedDate: Date;
  selectedTimeSlot: TimeSlot;
  onSuccess: () => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedService,
  selectedDate,
  selectedTimeSlot,
  onSuccess,
  onCancel
}) => {
  // const { addAppointment } = useAppointmentContext();
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
  }>({});

  // Format date and time for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = new Date(selectedTimeSlot.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Validate form
  const validateForm = () => {
    const newErrors: {
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
    } = {};
    
    if (!clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }
    
    if (!clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(clientEmail)) {
      newErrors.clientEmail = 'Email is invalid';
    }
    
    if (!clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) return;
    
  //   setIsSubmitting(true);
    
  //   // Create appointment
  //   addAppointment({
  //     clientName,
  //     clientEmail,
  //     clientPhone,
  //     serviceId: selectedService.id,
  //     date: selectedDate.toISOString(),
  //     timeSlot: selectedTimeSlot,
  //     status: 'pending',
  //     notes
  //   });
    
  //   setIsSubmitting(false);
  //   onSuccess();
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        service_id: selectedService.id,
        date: selectedDate.toISOString().split('T')[0],
        time_start: selectedTimeSlot.startTime.split('T')[1],
        time_end: selectedTimeSlot.endTime.split('T')[1],
        status: 'pending',
        notes
      })
    });

    onSuccess();
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    // Aqui você pode setar uma mensagem de erro para exibir no formulário se quiser
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Your Appointment</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <div className="mb-2">
          <span className="font-medium text-gray-700">Service:</span>{' '}
          <span>{selectedService.name}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Date:</span>{' '}
          <span>{formattedDate}</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">Time:</span>{' '}
          <span>{formattedTime}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Duration:</span>{' '}
          <span>{selectedService.duration} minutes</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.clientName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="clientEmail"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.clientEmail ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.clientEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="clientPhone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.clientPhone ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.clientPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.clientPhone}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="clientCpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <input
            type="text"
            id="clientCpf"
            value={clientCpf}
            onChange={(e) => setClientCpf(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;