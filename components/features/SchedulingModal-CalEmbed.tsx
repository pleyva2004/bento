'use client';

import React, { useState, useEffect } from 'react';
import { getCalApi } from "@calcom/embed-react";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingModalWithCalEmbed: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize Cal.com embed
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "levrok-labs" });

      cal("ui", {
        "hideEventTypeDetails": false,
        "layout": "week_view",
        "styles": {
          "branding": {
            "brandColor": "#111827"
          }
        }
      });
    })();
  }, []);

  // Handle modal entrance/exit animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(false), 10);
    } else {
      setIsAnimating(true);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 bg-black flex items-center justify-center z-50 p-4
        transition-all duration-300 ease-out
        ${isOpen && !isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden
          transition-all duration-300 ease-out transform
          ${isOpen && !isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-gray-100 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Schedule Your AI Audit Call
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a time that works best for you
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cal.com Embed */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
          <div
            data-cal-namespace="levrok-labs"
            data-cal-link="pablo-leyva-0g1kbd/levrok-labs"
            data-cal-config='{"layout":"week_view"}'
            style={{ width: "100%", height: "100%", minHeight: "600px", overflow: "scroll" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SchedulingModalWithCalEmbed;

