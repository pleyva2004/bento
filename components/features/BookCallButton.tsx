'use client';

import React, { useState } from 'react';
import SchedulingModal from './SchedulingModal';

const BookCallButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleOpenModal = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setIsClicked(false);
    }, 150);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`
          bg-gray-900 text-white
          px-6 sm:px-8 py-4
          rounded-full
          text-sm sm:text-base font-medium tracking-wide
          hover:bg-gray-800
          transition-all duration-300 ease-out
          shadow-lg hover:shadow-xl
          inline-flex items-center justify-center space-x-3
          group
          w-full sm:w-auto
          transform hover:scale-[1.02] active:scale-95
          ${isClicked ? 'scale-95' : ''}
          ${isModalOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}
        `}
      >
        <span
          className={`
            w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100
            transition-all duration-300 flex-shrink-0
            ${isClicked ? 'animate-pulse' : ''}
          `}
        ></span>
        <span className="whitespace-nowrap">Book a discovery call</span>
      </button>

      <SchedulingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default BookCallButton;


