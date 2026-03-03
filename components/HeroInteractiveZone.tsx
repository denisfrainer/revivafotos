'use client';

import { useState } from 'react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { UploadBox } from './UploadBox';

interface HeroInteractiveZoneProps {
    beforeImage: string;
    afterImage: string;
    ctaText: string;
    cancelText: string;
}

/**
 * HERO INTERACTIVE ZONE
 * Client-side "Island" that handles the proof-to-action conversion swap.
 * Zero-CLS: Enforced via aspect-video on the container.
 */
export function HeroInteractiveZone({
    beforeImage,
    afterImage,
    ctaText,
    cancelText
}: HeroInteractiveZoneProps) {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="w-full flex flex-col items-center space-y-12">
            {/* 
        The "Interactive Zone" Container 
        Strict aspect-video to prevent layout shifts.
      */}
            <div className="w-full max-w-5xl aspect-video relative">
                {!isUploading ? (
                    <div className="animate-[fadeIn_0.4s_ease-out_forwards]">
                        <BeforeAfterSlider
                            beforeImage={beforeImage}
                            afterImage={afterImage}
                            priority={true} // High-priority LCP in Hero
                        />
                    </div>
                ) : (
                    <div className="animate-[fadeIn_0.5s_ease-out_forwards]">
                        <UploadBox onCancel={() => setIsUploading(false)} />
                    </div>
                )}
            </div>

            {/* 
        The Conversion Trigger 
        Swaps roles based on state.
      */}
            <div className="w-full max-w-md mx-auto">
                {!isUploading ? (
                    <button
                        onClick={() => setIsUploading(true)}
                        className="w-full block bg-white text-black font-bold px-12 py-6 text-2xl rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-gray-100"
                    >
                        {ctaText}
                    </button>
                ) : (
                    <button
                        onClick={() => setIsUploading(false)}
                        className="w-full block bg-white/5 hover:bg-white/10 text-white font-bold px-12 py-6 text-2xl rounded-full transition-all duration-300 backdrop-blur-md border border-white/10"
                    >
                        {cancelText}
                    </button>
                )}
            </div>
        </div>
    );
}
