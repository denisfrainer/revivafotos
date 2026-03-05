'use client';

import { useState, useCallback } from 'react';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ActionButtons } from '@/components/ActionButtons';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type AppState = 'IDLE' | 'PREVIEW' | 'LOADING';

/**
 * HERO CONVERSION — Premium State Machine
 *
 * States:
 * - IDLE: BeforeAfterSlider (proof) + ActionButtons (conversion triggers)
 * - PREVIEW: (reserved for future use: shows user's selected photo before processing)
 * - LOADING: Full-screen LoadingSpinner, hides everything else
 *
 * Zero CLS: Container has min-h to prevent layout shifts on state transitions.
 * Crossfade: opacity + transition for smooth state swaps.
 */
export function HeroConversion() {
    const [appState, setAppState] = useState<AppState>('IDLE');

    const handleFileSelected = useCallback((file: File) => {
        console.log('Processing file:', file.name, file.size);
        // Transition to LOADING state
        setAppState('LOADING');

        // TODO: Send file to Gemini restoration API
        // On success: setAppState('PREVIEW') or show result
        // On error: setAppState('IDLE') with error message
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[500px] sm:min-h-[600px] flex flex-col items-center justify-center relative">
            {/* IDLE STATE: Slider + Action Buttons */}
            {appState === 'IDLE' && (
                <div className="w-full flex flex-col items-center gap-8 sm:gap-10 animate-[fadeIn_0.3s_ease-out_forwards]">
                    {/* THE PROOF: Before/After Slider */}
                    <BeforeAfterSlider
                        beforeImage="/assets/before.avif"
                        afterImage="/assets/after.avif"
                    />

                    {/* THE ACTION: Massive Camera + Gallery Buttons */}
                    <ActionButtons onFileSelected={handleFileSelected} />
                </div>
            )}

            {/* LOADING STATE: Spinner Only */}
            {appState === 'LOADING' && (
                <div className="w-full flex items-center justify-center min-h-[400px] animate-[fadeIn_0.3s_ease-out_forwards]">
                    <LoadingSpinner />
                </div>
            )}

            {/* PREVIEW STATE: Reserved for future result display */}
            {appState === 'PREVIEW' && (
                <div className="w-full flex flex-col items-center gap-6 animate-[fadeIn_0.3s_ease-out_forwards]">
                    <p className="text-xl text-gray-300">Resultado da restauração</p>
                    <button
                        type="button"
                        onClick={() => setAppState('IDLE')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-5 rounded-2xl transition-all duration-200 active:scale-[0.98]"
                    >
                        Restaurar outra foto
                    </button>
                </div>
            )}
        </div>
    );
}
