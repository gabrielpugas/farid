import React, { useState } from 'react';
import { Service } from '../../types';
import Button from '../common/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ServiceManagementProps {
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('0');
  
  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setDuration('30');
    setPrice('0');
    setIsAdding(false);
    setEditingService(null);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price)
    };
    
    if (editingService) {
      onUpdateService({
        ...serviceData,
        id: editingService.id
      });
    } else {
      onAddService(serviceData);
    }
    
    resetForm();
  };
  
  // Start editing a service
  const handleEdit = (service: Service) => {
    setName(service.name);
    setDescription(service.description);
    setDuration(service.duration.toString());
    setPrice(service.price.toString());
    setEditingService(service);
    setIsAdding(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Services</h2>
        {!isAdding && (
          <Button 
            size="sm" 
            onClick={() => setIsAdding(true)}
            icon={<Plus size={16} />}
          >
            Add Service
          </Button>
        )}
      </div>
      
      {isAdding ? (
        <form onSubmit={handleSubmit} className="border p-4 rounded-md mb-4">
          <h3 className="text-md font-medium mb-3">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          
          <div className="mb-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="5"
                step="5"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              type="submit"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </form>
      ) : null}
      
      <div className="space-y-3">
        {services.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No services available. Add a service to get started.</p>
        ) : (
          services.map((service) => (
            <div 
              key={service.id} 
              className="border border-gray-200 rounded-md p-3 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-700">
                    <span>{service.duration} minutes</span>
                    <span>${service.price}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteService(service.id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;