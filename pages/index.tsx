import { useState } from 'react';
import Sidebar from '../src/components/Sidebar';
import Hero from '../src/components/Hero';
import FloatingCTA from '../src/components/FloatingCTA';
import Logo from '../src/components/Logo';
import ChatInput from '../src/components/ChatInput';
// import TryOurAI from '../src/components/TryOurAI';

export default function Home() {
    const [currentSection, setCurrentSection] = useState<string>('home');

    return (
        <div className="bg-white text-gray-900 min-h-screen pb-20">
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
    );
}

