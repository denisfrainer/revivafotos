'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeAlt?: string;
    afterAlt?: string;
    priority?: boolean;
}

/**
 * BEFORE/AFTER SLIDER - GHOST ARCHITECTURE
 * 1. Zero-CLS: Enforced aspect-video via Tailwind.
 * 2. High Performance: CSS clip-path for transitions, zero JS-heavy animations.
 * 3. Lazy Loading: Images use loading="lazy" by default, or priority for Hero LCP.
 */
export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeAlt = "Before Restoration",
    afterAlt = "After Restoration",
    priority = false
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(Number(e.target.value));
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-ew-resize">
            {/* 
        LAYER 1: The "After" Image (Base) 
        This remains static in the background.
      */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={afterImage}
                    alt={afterAlt}
                    fill
                    className="object-cover"
                    loading="lazy" // Critical: Do not compete with Hero LCP
                />
            </div>

            {/* 
        LAYER 2: The "Before" Image (Clipped) 
        This is clipped dynamically based on the slider state.
      */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                }}
            >
                <Image
                    src={beforeImage}
                    alt={beforeAlt}
                    fill
                    className="object-cover"
                    priority={priority}
                    fetchPriority={priority ? "high" : "auto"}
                    loading={priority ? "eager" : "lazy"}
                    decoding={priority ? "sync" : "async"}
                />
            </div>

            {/* 
        LAYER 3: The Ghost Slider Handle (Visual Only) 
        pointer-events-none ensures it doesn't block the range input.
      */}
            <div
                className="absolute inset-y-0 z-20 w-1 bg-white pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-black/10">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* 
        LAYER 4: The Native Range Input (Invisible Controller) 
        This catches all interaction and updates state.
      */}
            <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="absolute inset-0 z-30 w-full h-full cursor-ew-resize opacity-0"
                aria-label="Image comparison slider"
            />

            {/* Labels for better UX */}
            <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest text-white/80 pointer-events-none select-none border border-white/10">
                Antes
            </div>
            <div className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-[var(--accent-blue)]/80 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest text-white pointer-events-none select-none border border-white/10">
                Depois
            </div>
        </div>
    );
}
