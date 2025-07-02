import React from 'react';
import { AppointmentProvider } from './context/AppointmentContext';
import ClientBooking from './pages/ClientBooking';
import CompanyDashboard from './pages/CompanyDashboard';
import NotFound from './pages/NotFound';

function App() {
  // Simple routing based on path
  const path = window.location.pathname;
  
  // Render the appropriate page based on the path
  const renderPage = () => {
    if (path === '/' || path === '/booking') {
      return <ClientBooking />;
    } else if (path === '/company' || path === '/dashboard') {
      return <CompanyDashboard />;
    } else {
      return <NotFound />;
    }
  };

  return (
    <AppointmentProvider>
      {renderPage()}
    </AppointmentProvider>
  );
}

export default App;