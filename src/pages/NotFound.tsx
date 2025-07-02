import React from 'react';
import Button from '../components/common/Button';
import { Home, Calendar } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Calendar size={64} className="mx-auto text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="primary" 
            icon={<Home size={16} />}
            onClick={() => window.location.href = '/'}
          >
            Go to Booking
          </Button>
          <Button 
            variant="secondary" 
            icon={<Calendar size={16} />}
            onClick={() => window.location.href = '/company'}
          >
            Company Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;