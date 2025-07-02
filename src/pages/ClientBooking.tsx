import React, { useState, useEffect } from 'react';
import { useAppointmentContext } from '../context/AppointmentContext';
import Calendar from '../components/common/Calendar';
import ServiceSelection from '../components/client/ServiceSelection';
import TimeSlotPicker from '../components/common/TimeSlotPicker';
import AppointmentForm from '../components/client/AppointmentForm';
import Button from '../components/common/Button';
import { ArrowLeft, ArrowRight, CalendarClock, CheckCircle } from 'lucide-react';
import { TimeSlot } from '../types';

enum BookingStep {
  SelectService,
  SelectDateTime,
  ConfirmDetails,
  Confirmation
}

const ClientBooking: React.FC = () => {
  const {
    services,
    selectedDate,
    setSelectedDate,
    selectedService,
    setSelectedService,
    availableTimeSlots
  } = useAppointmentContext();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.SelectService);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  
  // Reset time slot when date or service changes
  useEffect(() => {
    setSelectedTimeSlot(null);
  }, [selectedDate, selectedService]);
  
  // Handle next step
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Handle booking success
  const handleBookingSuccess = () => {
    setCurrentStep(BookingStep.Confirmation);
  };
  
  // Handle restart booking
  const handleRestartBooking = () => {
    setSelectedService(null);
    setSelectedDate(new Date());
    setSelectedTimeSlot(null);
    setCurrentStep(BookingStep.SelectService);
  };
  
  // Check if can proceed to next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case BookingStep.SelectService:
        return selectedService !== null;
      case BookingStep.SelectDateTime:
        return selectedTimeSlot !== null;
      default:
        return true;
    }
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case BookingStep.SelectService:
        return (
          <ServiceSelection
            services={services}
            selectedService={selectedService}
            onSelectService={setSelectedService}
          />
        );
      case BookingStep.SelectDateTime:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date & Time</h2>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Available Time Slots</h3>
              <TimeSlotPicker
                timeSlots={availableTimeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={setSelectedTimeSlot}
              />
            </div>
          </div>
        );
      case BookingStep.ConfirmDetails:
        return selectedService && selectedTimeSlot ? (
          <AppointmentForm
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSuccess={handleBookingSuccess}
            onCancel={handlePrevStep}
          />
        ) : null;
      case BookingStep.Confirmation:
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been scheduled successfully. We will contact you shortly to confirm your appointment.
            </p>
            <Button 
              onClick={handleRestartBooking} 
              variant="primary"
            >
              Book Another Appointment
            </Button>
          </div>
        );
    }
  };
  
  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { label: 'Select Service', icon: <span className="text-sm">1</span> },
      { label: 'Date & Time', icon: <span className="text-sm">2</span> },
      { label: 'Your Details', icon: <span className="text-sm">3</span> }
    ];
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2
                  ${
                    currentStep >= index
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                {step.icon}
              </div>
              <span
                className={`
                  text-xs mt-1
                  ${currentStep >= index ? 'text-blue-600' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-1
                  ${currentStep > index ? 'bg-blue-600' : 'bg-gray-300'}
                `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="container max-w-3xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <CalendarClock size={32} className="text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          </div>
          
          {currentStep < BookingStep.Confirmation && renderStepIndicator()}
        </header>
        
        <main className="bg-white shadow-md rounded-lg p-6">
          {renderStepContent()}
          
          {currentStep < BookingStep.ConfirmDetails && (
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
              {currentStep > BookingStep.SelectService ? (
                <Button 
                  onClick={handlePrevStep} 
                  variant="secondary"
                  icon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button 
                onClick={handleNextStep} 
                disabled={!canProceedToNextStep()}
                icon={<ArrowRight size={16} className="ml-1" />}
              >
                {currentStep === BookingStep.SelectDateTime ? 'Continue to Details' : 'Next'}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientBooking;