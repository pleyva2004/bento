import { useState, useEffect } from 'react';
import Sidebar from '../src/components/Sidebar';
import Hero from '../src/components/Hero';
import FloatingCTA from '../src/components/FloatingCTA';
import Logo from '../src/components/Logo';
import ChatInput from '../src/components/ChatInput';
import TryOurAI from '../src/components/TryOurAI';

export default function Home() {
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
      <TryOurAI />
      <ChatInput />
    </div>
  );
}
