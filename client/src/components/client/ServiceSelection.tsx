import React from 'react';
import { Service } from '../../types';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceSelectionProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedService,
  onSelectService
  
}) => {
  return (
    
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Select a Service</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelectService(service)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${
                selectedService?.id === service.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
              </div>
              
              <div className="flex items-center mt-2 sm:mt-0">
                <div className="flex items-center text-gray-700 mr-4">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{service.duration} min</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign size={16} className="mr-1" />
                  <span className="text-sm">{service.price}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;