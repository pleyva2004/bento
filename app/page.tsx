'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Hero from '@/components/sections/Hero';
import FloatingCTA from '@/components/layout/FloatingCTA';
import Logo from '@/components/layout/Logo';
import ChatInput from '@/components/features/ChatInput';
import ParticleAnimation from '@/components/ParticleAnimation';

export default function Home() {
    const [currentSection, setCurrentSection] = useState<string>('about');

    return (
        <div className="bg-white text-gray-900 min-h-screen pb-20 relative">
            <ParticleAnimation />
            <div className="relative z-10">
                <Logo />
                <Sidebar
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                />
                <Hero />
                <FloatingCTA />
                {/* <TryOurAI /> */}
                <ChatInput />
            </div>
        </div>
    );
}

