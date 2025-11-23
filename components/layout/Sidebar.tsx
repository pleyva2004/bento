'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setCurrentSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About', link: null },
    { id: 'verticals', label: 'Verticals', link: null },
    { id: 'insights', label: 'Insights', link: '/insights' },
    { id: 'careers', label: 'Careers', link: null },
    { id: 'contact', label: 'Contact', link: null }
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex fixed left-10 top-0 h-full w-8 flex-col justify-center z-40">
      <nav className="flex flex-col items-center space-y-16">
        {navItems.map((item, index) => (
          item.link ? (
            <Link
              key={item.id}
              href={item.link}
              className={`
                text-gray-400 hover:text-gray-600 transition-colors duration-300
                text-md font-bold tracking-wider
                transform -rotate-90 origin-center whitespace-nowrap
                ${currentSection === item.id ? 'text-gray-900' : ''}
                ${index === 0 ? 'text-gray-900' : ''}
              `}
              style={{
                letterSpacing: '0.1em'
              }}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`
                text-gray-400 hover:text-gray-600 transition-colors duration-300
                text-md font-bold tracking-wider
                transform -rotate-90 origin-center whitespace-nowrap
                ${currentSection === item.id ? 'text-gray-900' : ''}
                ${index === 0 ? 'text-gray-900' : ''}
              `}
              style={{
                letterSpacing: '0.1em'
              }}
            >
              {item.label}
            </button>
          )
        ))}
      </nav>
    </div>

      {/* Mobile Hamburger Menu - Shown only on mobile */}
      <div className="md:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-white rounded-md shadow-lg flex flex-col justify-center items-center space-y-1"
        >
          <div className="w-5 h-0.5 bg-gray-900"></div>
          <div className="w-5 h-0.5 bg-gray-900"></div>
          <div className="w-5 h-0.5 bg-gray-900"></div>
        </button>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-12 right-0 bg-white rounded-md shadow-lg py-2 w-32">
            {navItems.map((item, index) => (
              item.link ? (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block w-full text-left px-4 py-2 text-sm
                    ${currentSection === item.id || index === 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}
                    hover:bg-gray-50
                  `}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    block w-full text-left px-4 py-2 text-sm
                    ${currentSection === item.id || index === 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}
                    hover:bg-gray-50
                  `}
                >
                  {item.label}
                </button>
              )
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;

