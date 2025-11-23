'use client';

import { useState } from 'react';
import Logo from '@/components/layout/Logo';
import Sidebar from '@/components/layout/Sidebar';
import ChatInput from '@/components/features/ChatInput';
import ParticleAnimation from '@/components/ParticleAnimation';

interface InsightsLayoutProps {
  children: React.ReactNode;
}

export default function InsightsLayout({ children }: InsightsLayoutProps) {
  const [currentSection, setCurrentSection] = useState<string>('insights');

  return (
    <div className="bg-white text-gray-900 min-h-screen pb-20 relative">
      <ParticleAnimation />
      <div className="relative z-10">
        <Logo />
        <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
        {children}
        <ChatInput />
      </div>
    </div>
  );
}

