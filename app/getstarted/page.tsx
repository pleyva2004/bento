'use client';

import React, { useState } from 'react';
import Logo from '@/components/layout/Logo';
import ParticleAnimation from '@/components/ParticleAnimation';
import Sidebar from '@/components/layout/Sidebar';

export default function GetStarted() {
    const [currentSection, setCurrentSection] = useState<string>('');

    return (
        <div className="bg-white text-gray-900 min-h-screen pb-20 relative">
            <ParticleAnimation />
            <div className="relative z-10">
                <Logo />
                <Sidebar
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                />
                <div className="max-w-7xl mx-auto px-8 md:px-12 pt-32 md:pl-32">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Started with Levrok</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Ready to transform your organization with intelligent data systems?
                        </p>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <p className="text-gray-600">
                                Contact form or onboarding flow will go here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
