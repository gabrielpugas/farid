import React, { useState } from 'react';
import { useAppointmentContext } from '../context/AppointmentContext';
import CalendarView from '../components/company/CalendarView';
import AppointmentList from '../components/company/AppointmentList';
import AppointmentDetails from '../components/company/AppointmentDetails';
import BusinessHoursSettings from '../components/company/BusinessHoursSettings';
import ServiceManagement from '../components/company/ServiceManagement';
import { Calendar, Clock, Sliders, Users, CalendarClock } from 'lucide-react';
import { AppointmentStatus } from '../types';

enum DashboardTab {
  Appointments,
  Schedule,
  Services,
  Settings
}

const CompanyDashboard: React.FC = () => {
  const {
    // appointments,
    services,
    businessHours,
    getAppointment,
    getAppointmentsByDate,
    updateAppointment,
    updateBusinessHours,
    addService,
    updateService,
    removeService
  } = useAppointmentContext();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentTab, setCurrentTab] = useState<DashboardTab>(DashboardTab.Appointments);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  
  // Get appointments for the selected date
  const appointmentsForSelectedDate = getAppointmentsByDate(selectedDate);
  
  // Get the selected appointment
  const selectedAppointment = selectedAppointmentId
    ? getAppointment(selectedAppointmentId)
    : null;
  
  // Get the service for the selected appointment
  const appointmentService = selectedAppointment
    ? services.find(service => service.id === selectedAppointment.serviceId)
    : undefined;
  
  // Handle appointment confirmation
  const handleConfirmAppointment = (id: string) => {
    const appointment = getAppointment(id);
    if (appointment) {
      updateAppointment({
        ...appointment,
        status: AppointmentStatus.Confirmed,
        updatedAt: new Date().toISOString()
      });
    }
    // Close the details modal
    setSelectedAppointmentId(null);
  };
  
  // Handle appointment cancellation
  const handleCancelAppointment = (id: string) => {
    const appointment = getAppointment(id);
    if (appointment) {
      updateAppointment({
        ...appointment,
        status: AppointmentStatus.CancelledByAdmin,
        updatedAt: new Date().toISOString()
      });
    }
    // Close the details modal
    setSelectedAppointmentId(null);
  };
  
  // Render the current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case DashboardTab.Appointments:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CalendarView 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate} 
              />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Appointments for {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
                <AppointmentList
                  appointments={appointmentsForSelectedDate}
                  services={services}
                  onViewDetails={setSelectedAppointmentId}
                />
              </div>
            </div>
          </div>
        );
      case DashboardTab.Schedule:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BusinessHoursSettings
              businessHours={businessHours}
              onSave={updateBusinessHours}
            />
          </div>
        );
      case DashboardTab.Services:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceManagement
              services={services}
              onAddService={addService}
              onUpdateService={updateService}
              onDeleteService={removeService}
            />
          </div>
        );
      case DashboardTab.Settings:
        return (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-500">
              Additional settings and configuration options will be available here.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarClock size={32} className="text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Appointment Manager</h1>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </header>
      
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentTab(DashboardTab.Appointments)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium border-b-2 
                ${
                  currentTab === DashboardTab.Appointments
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <Calendar size={18} className="mr-2" />
              Appointments
            </button>
            <button
              onClick={() => setCurrentTab(DashboardTab.Schedule)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium border-b-2 
                ${
                  currentTab === DashboardTab.Schedule
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <Clock size={18} className="mr-2" />
              Business Hours
            </button>
            <button
              onClick={() => setCurrentTab(DashboardTab.Services)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium border-b-2 
                ${
                  currentTab === DashboardTab.Services
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <Users size={18} className="mr-2" />
              Services
            </button>
            <button
              onClick={() => setCurrentTab(DashboardTab.Settings)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium border-b-2 
                ${
                  currentTab === DashboardTab.Settings
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300'
                }
              `}
            >
              <Sliders size={18} className="mr-2" />
              Settings
            </button>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-6">
        {renderTabContent()}
      </main>
      
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <AppointmentDetails
              appointment={selectedAppointment}
              service={appointmentService}
              onConfirm={handleConfirmAppointment}
              onCancel={handleCancelAppointment}
              onClose={() => setSelectedAppointmentId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;