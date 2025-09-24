import React, { useState } from 'react';

interface CalendarPickerProps {
  onDateTimeSelect: (date: Date, time: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ onDateTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate available time slots (9 AM to 5 PM, excluding weekends)
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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time selection when date changes
  };

  const handleTimeSelect = (timeValue: string) => {
    setSelectedTime(timeValue);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime);
    }
  };

  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(timeSlot => (
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
