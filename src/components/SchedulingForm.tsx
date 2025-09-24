import React, { useState } from 'react';

interface SchedulingFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    companyName: string;
    companyNiche: string;
  }) => void;
  onBack: () => void;
  isSubmitting: boolean;
  selectedDate: Date | null;
  selectedTime: string;
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({
  onSubmit,
  onBack,
  isSubmitting,
  selectedDate,
  selectedTime
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    companyNiche: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companyNiche.trim()) {
      newErrors.companyNiche = 'Company niche is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Function to convert 24-hour time to 12-hour format
  const formatTimeToDisplay = (time24: string) => {
    const timeSlots = [
      { value: '09:00', display: '9:00 AM' },
      { value: '09:30', display: '9:30 AM' },
      { value: '10:00', display: '10:00 AM' },
      { value: '10:30', display: '10:30 AM' },
      { value: '11:00', display: '11:00 AM' },
      { value: '11:30', display: '11:30 AM' },
      { value: '13:00', display: '1:00 PM' },
      { value: '13:30', display: '1:30 PM' },
      { value: '14:00', display: '2:00 PM' },
      { value: '14:30', display: '2:30 PM' },
      { value: '15:00', display: '3:00 PM' },
      { value: '15:30', display: '3:30 PM' },
      { value: '16:00', display: '4:00 PM' },
      { value: '16:30', display: '4:30 PM' }
    ];
    
    const timeSlot = timeSlots.find(slot => slot.value === time24);
    return timeSlot ? timeSlot.display : time24;
  };

  const companyNiches = [
    'Technology/Software',
    'Healthcare/Medical',
    'Finance/Banking',
    'Retail/E-commerce',
    'Manufacturing',
    'Real Estate',
    'Legal Services',
    'Consulting',
    'Marketing/Advertising',
    'Education',
    'Food & Beverage',
    'Construction',
    'Transportation/Logistics',
    'Entertainment/Media',
    'Non-profit',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected Date & Time Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Selected Meeting Time</h4>
        <p className="text-sm text-gray-600">
          {selectedDate?.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} at {formatTimeToDisplay(selectedTime)}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 mt-2 underline"
        >
          Change date/time
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500
              ${errors.name ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500
              ${errors.email ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Company Name Field */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500
              ${errors.companyName ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Enter your company name"
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>

        {/* Company Niche Field */}
        <div>
          <label htmlFor="companyNiche" className="block text-sm font-medium text-gray-700 mb-2">
            Company Industry/Niche *
          </label>
          <select
            id="companyNiche"
            value={formData.companyNiche}
            onChange={(e) => handleInputChange('companyNiche', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500
              ${errors.companyNiche ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            <option value="">Select your industry</option>
            {companyNiches.map(niche => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
          {errors.companyNiche && <p className="text-red-500 text-sm mt-1">{errors.companyNiche}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </div>
    </form>
  );
};

export default SchedulingForm;
