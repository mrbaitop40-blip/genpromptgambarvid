
import React, { useState } from 'react';
import VideoPromptGenerator from './components/VideoPromptGenerator';
import ImagePromptGenerator from './components/ImagePromptGenerator';

type Mode = 'video' | 'image';

export default function App() {
    const [mode, setMode] = useState<Mode>('video');

    const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            onClick={onClick}
            className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-primary ${
                active 
                    ? 'bg-surface text-secondary' 
                    : 'text-on-surface-muted hover:bg-surface/50 hover:text-on-surface'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Universal Prompt Architect</h1>
                <p className="text-on-surface-muted mt-2">Buat prompt kompleks untuk video dan gambar dengan mudah.</p>
            </header>

            <nav className="flex justify-center mb-8 border-b border-border-color">
                <NavButton active={mode === 'video'} onClick={() => setMode('video')}>
                    VEO3 Prompt Generator
                </NavButton>
                <NavButton active={mode === 'image'} onClick={() => setMode('image')}>
                    Image Prompt Generator
                </NavButton>
            </nav>
            
            <main>
                {mode === 'video' && <VideoPromptGenerator />}
                {mode === 'image' && <ImagePromptGenerator />}
            </main>
        </div>
    );
}
