import React, { useState } from 'react';
import SchedulingModal from './SchedulingModal';

const FloatingCTA: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleOpenModal = () => {
    setIsClicked(true);
    // Small delay to show click animation before opening modal
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
      <div className="fixed bottom-[145px] right-4 md:top-10 md:bottom-auto md:right-8 z-30">
        <button
          onClick={handleOpenModal}
          className={`
            bg-gray-900 text-white
            px-4 sm:px-6 lg:px-8 py-3 sm:py-4
            rounded-full
            text-xs sm:text-sm font-medium tracking-wide
            hover:bg-gray-800
            transition-all duration-300 ease-out
            shadow-lg hover:shadow-xl
            flex items-center space-x-2 sm:space-x-3
            group
            max-w-[280px] sm:max-w-none
            transform hover:scale-105 active:scale-95
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
          <span className="truncate">Schedule a No-Cost AI audit call</span>
        </button>
      </div>

      <SchedulingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default FloatingCTA;
