import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import FloatingCTA from './components/FloatingCTA';
import Logo from './components/Logo';
import ChatInput from './components/ChatInput';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen pb-20">
      <Logo />
      <Sidebar 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection} 
      />
      <Hero scrollY={scrollY} />
      <FloatingCTA />
      <ChatInput />
    </div>
  );
}

export default App;