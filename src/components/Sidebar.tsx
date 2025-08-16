import React from 'react';

interface SidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setCurrentSection }) => {
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'verticals', label: 'Verticals' },
    { id: 'blog', label: 'Blog' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="fixed left-10 top-0 h-full w-8 flex flex-col justify-center z-40">
      <nav className="flex flex-col items-center space-y-16">
        {navItems.map((item, index) => (
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
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;