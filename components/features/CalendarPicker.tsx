'use client';

import React, { useState, useEffect } from 'react';
import {
  detectUserTimezone,
  getBestMatchingTimezone,
  generateTimeSlotsForTimezone,
  US_TIMEZONES,
  getCurrentTimeInTimezone,
} from '@/lib/timezone-utils';

interface CalendarPickerProps {
  onDateTimeSelect: (date: Date, time: string, timezone: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ onDateTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('America/New_York');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Auto-detect timezone on mount
  useEffect(() => {
    const detectedTz = detectUserTimezone();
    const matchingTz = getBestMatchingTimezone(detectedTz);
    setSelectedTimezone(matchingTz);
  }, []);

  // Update current time display every minute
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(getCurrentTimeInTimezone(selectedTimezone));
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  // Generate time slots based on selected timezone
  // Base availability: 11 AM - 7 PM EST
  const timeSlots = generateTimeSlotsForTimezone(selectedTimezone);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      // Only allow future dates and weekdays
      const isAvailable = date >= today && date.getDay() !== 0 && date.getDay() !== 6;
      days.push({ day, date, isAvailable });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const today = new Date();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection when date changes
    setAvailableSlots([]);
    setAvailabilityError(null);
    setIsLoadingAvailability(true);

    try {
      // Format date as YYYY-MM-DD
      const dateString = date.toISOString().split('T')[0];

      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          timezone: selectedTimezone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailabilityError('Failed to load available times. Please try again.');
      setAvailableSlots([]);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleTimezoneChange = async (timezone: string) => {
    setSelectedTimezone(timezone);
    setSelectedTime(''); // Reset time selection when timezone changes

    // Refetch availability if a date is already selected
    if (selectedDate) {
      setAvailableSlots([]);
      setAvailabilityError(null);
      setIsLoadingAvailability(true);

      try {
        const dateString = selectedDate.toISOString().split('T')[0];

        const response = await fetch('/api/check-availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: dateString,
            timezone: timezone,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to check availability');
        }

        const data = await response.json();
        setAvailableSlots(data.availableSlots || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailabilityError('Failed to load available times. Please try again.');
        setAvailableSlots([]);
      } finally {
        setIsLoadingAvailability(false);
      }
    }
  };

  const handleTimeSelect = (timeValue: string) => {
    setSelectedTime(timeValue);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime, selectedTimezone);
    }
  };

  // const timezoneInfo = getTimezoneInfo(selectedTimezone);

  return (
    <div className="space-y-6">
      {/* Timezone Selector */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-900 mb-2">
              Your Timezone
            </label>
            <select
              id="timezone"
              value={selectedTimezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              {US_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.abbreviation})
                </option>
              ))}
            </select>
            {currentTime && (
              <p className="text-xs text-gray-600 mt-2">
                Current time: {currentTime}
              </p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Available hours: 11:00 AM - 7:00 PM EST (converted to your timezone)
        </p>
      </div>

      {/* Calendar */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentMonth} {currentYear}
        </h3>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((dayObj, index) => (
            <div key={index} className="p-1">
              {dayObj && (
                <button
                  onClick={() => dayObj.isAvailable && handleDateSelect(dayObj.date)}
                  disabled={!dayObj.isAvailable}
                  className={`
                    w-8 h-8 rounded-full text-sm font-medium transition-colors
                    ${!dayObj.isAvailable
                      ? 'text-gray-300 cursor-not-allowed'
                      : selectedDate?.getDate() === dayObj.day
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {dayObj.day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Available Times for {selectedDate.toLocaleDateString()}
          </h3>

          {/* Loading State */}
          {isLoadingAvailability && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="text-gray-600">Checking availability...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoadingAvailability && availabilityError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
              {availabilityError}
            </div>
          )}

          {/* No Availability */}
          {!isLoadingAvailability && !availabilityError && availableSlots.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              No available time slots for this date. Please select another date or check your Cal.com availability settings.
            </div>
          )}

          {/* Available Time Slots */}
          {!isLoadingAvailability && !availabilityError && availableSlots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {timeSlots
                .filter(timeSlot => availableSlots.includes(timeSlot.value))
                .map(timeSlot => (
                  <button
                    key={timeSlot.value}
                    onClick={() => handleTimeSelect(timeSlot.value)}
                    className={`
                      p-3 rounded-lg text-sm font-medium transition-colors
                      ${selectedTime === timeSlot.value
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {timeSlot.display}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <div className="pt-4">
          <button
            onClick={handleContinue}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;

