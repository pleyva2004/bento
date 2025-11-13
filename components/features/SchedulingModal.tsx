'use client';

import React, { useState, useEffect } from 'react';
import CalendarPicker from './CalendarPicker';
import SchedulingForm from './SchedulingForm';
import ConfirmationScreen from './ConfirmationScreen';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SchedulingData {
  selectedDate: Date | null;
  selectedTime: string;
  name: string;
  email: string;
  companyName: string;
  companyNiche: string;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'calendar' | 'form' | 'confirmation'>('calendar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [schedulingData, setSchedulingData] = useState<SchedulingData>({
    selectedDate: null,
    selectedTime: '',
    name: '',
    email: '',
    companyName: '',
    companyNiche: ''
  });

  // Handle modal entrance/exit animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger entrance animation
      setTimeout(() => setIsAnimating(false), 10);
    } else {
      setIsAnimating(true);
      // Wait for exit animation before hiding
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSchedulingData(prev => ({ ...prev, selectedDate: date, selectedTime: time }));

    // Add smooth transition between steps
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep('form');
      setIsAnimating(false);
    }, 150);
  };

  const handleFormSubmit = async (formData: Omit<SchedulingData, 'selectedDate' | 'selectedTime'>) => {
    setIsSubmitting(true);

    const completeData = {
      selectedDate: schedulingData.selectedDate?.toISOString().split('T')[0] || '',
      selectedTime: schedulingData.selectedTime,
      name: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      companyNiche: formData.companyNiche,
    };

    try {
      const response = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      if (response.ok) {
        setSchedulingData(prev => ({ ...prev, ...formData }));

        // Smooth transition to confirmation
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentStep('confirmation');
          setIsAnimating(false);
        }, 150);
      } else {
        throw new Error('Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Failed to schedule meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('calendar');
    setSchedulingData({
      selectedDate: null,
      selectedTime: '',
      name: '',
      email: '',
      companyName: '',
      companyNiche: ''
    });
    onClose();
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep === 'form') {
        setCurrentStep('calendar');
      } else if (currentStep === 'confirmation') {
        setCurrentStep('form');
      }
      setIsAnimating(false);
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 bg-black flex items-center justify-center z-50 p-4
        transition-all duration-300 ease-out
        ${isOpen && !isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'}
      `}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden
          transition-all duration-300 ease-out transform
          ${isOpen && !isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-gray-100">
          <div className={`
            transition-all duration-200 ease-out
            ${isAnimating ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}
          `}>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentStep === 'calendar' && 'Select Date & Time'}
              {currentStep === 'form' && 'Your Information'}
              {currentStep === 'confirmation' && 'Meeting Scheduled!'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentStep === 'calendar' && 'Choose your preferred meeting time'}
              {currentStep === 'form' && 'Tell us about yourself and your company'}
              {currentStep === 'confirmation' && 'We\'ll send you a calendar invite shortly'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-gray-100 border-b border-gray-100 flex justify-center">
          <div className="flex items-center space-x-2">
            {['calendar', 'form', 'confirmation'].map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted =
                (step === 'calendar' && (currentStep === 'form' || currentStep === 'confirmation')) ||
                (step === 'form' && currentStep === 'confirmation');

              return (
                <React.Fragment key={step}>
                  <div
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300 ease-out
                      ${isActive ? 'bg-gray-500 scale-110' :
                        isCompleted ? 'bg-green-900' : 'bg-gray-300'
                      }
                    `}
                  />
                  {index < 2 && (
                    <div
                      className={`
                        h-0.5 w-8 transition-all duration-300 ease-out
                        ${isCompleted ? 'bg-green-900' : 'bg-gray-300'}
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content with slide transitions */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)] relative">
          <div
            className={`
              transition-all duration-200 ease-out transform
              ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
            `}
          >
            {currentStep === 'calendar' && (
              <CalendarPicker onDateTimeSelect={handleDateTimeSelect} />
            )}

            {currentStep === 'form' && (
              <SchedulingForm
                onSubmit={handleFormSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
                selectedDate={schedulingData.selectedDate}
                selectedTime={schedulingData.selectedTime}
              />
            )}

            {currentStep === 'confirmation' && (
              <ConfirmationScreen
                schedulingData={schedulingData}
                onClose={handleClose}
              />
            )}
          </div>

          {/* Loading overlay for form submission */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 font-medium">Scheduling your meeting...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulingModal;

