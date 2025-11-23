'use client';

import React, { useEffect } from 'react';
import { getCalApi } from "@calcom/embed-react";

const FloatingCTAWithCalEmbed: React.FC = () => {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ "namespace": "levrok-labs" });

            // Configure Cal.com UI
            cal("ui", {
                "hideEventTypeDetails": true,
                "layout": "week_view",
                "styles": {
                    "branding": {
                        "brandColor": "#111827"
                    }
                }
            });

            // Add custom CSS to control modal dimensions
            const style = document.createElement('style');
            style.textContent = `
                /* Control Cal.com modal dimensions */
                [data-cal-namespace="levrok-labs"] iframe {
                    max-width: 900px !important;
                    max-height: 90vh !important;
                    width: 95vw !important;
                    height: auto !important;
                    border-radius: 16px !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                }

                /* Control the modal backdrop */
                [data-cal-namespace="levrok-labs"] + div {
                    backdrop-filter: blur(4px) !important;
                    transition: all 300ms ease-out !important;
                }

                /* Control modal container positioning */
                div[style*="z-index: 9999"] {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 1rem !important;
                }
            `;
            document.head.appendChild(style);
        })();
    }, []);

    return (
        <div className="fixed bottom-[145px] right-4 md:top-10 md:bottom-auto md:right-8 z-30">
            <button
                data-cal-namespace="levrok-labs"
                data-cal-link="pablo-leyva-0g1kbd/levrok-labs"
                data-cal-config='{"layout":"week_view"}'
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
          cursor-pointer
        `}
            >
                <span
                    className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                ></span>
                <span className="truncate">Schedule a No-Cost AI audit call</span>
            </button>
        </div>
    );
};

export default FloatingCTAWithCalEmbed;

