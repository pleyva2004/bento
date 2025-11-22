'use client';

import React from 'react';
import { SchedulingData } from './SchedulingModal';

interface ConfirmationScreenProps {
  schedulingData: SchedulingData;
  onClose: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  schedulingData,
  onClose
}) => {
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

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Meeting Successfully Scheduled!
        </h3>
        <p className="text-gray-600">
          We've sent a calendar invite to your email address with all the meeting details.
        </p>
      </div>

      {/* Meeting Details */}
      <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Meeting Details</h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium text-gray-900">
              {schedulingData.selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} at {formatTimeToDisplay(schedulingData.selectedTime)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium text-gray-900">{schedulingData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{schedulingData.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Company:</span>
            <span className="font-medium text-gray-900">{schedulingData.companyName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Industry:</span>
            <span className="font-medium text-gray-900">{schedulingData.companyNiche}</span>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Check your email for the calendar invite</li>
          <li>• The meeting will include a Google Meet link</li>
          <li>• Prepare any questions about your AI needs</li>
          <li>• We'll discuss how AI can transform your business</li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="text-sm text-gray-600">
        <p>
          Need to reschedule or have questions? Contact us at{' '}
          <a href="mailto:hello@levroklabs.com" className="text-gray-900 underline">
            hello@levroklabs.com
          </a>
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Close
      </button>
    </div>
  );
};

export default ConfirmationScreen;

