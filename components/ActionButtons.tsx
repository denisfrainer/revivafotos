'use client';

import { useRef } from 'react';

interface ActionButtonsProps {
    onFileSelected: (file: File) => void;
}

/**
 * ACTION BUTTONS — 50+ AUDIENCE OPTIMIZED
 *
 * Two massive, full-width buttons for photo input:
 * 1. "Tirar foto com o celular" — triggers native camera via capture="environment"
 * 2. "Escolher da galeria" — triggers native file picker
 *
 * NO drag and drop. NO dropzones. NO emojis.
 * Hidden <input type="file"> elements triggered by styled buttons.
 */
export function ActionButtons({ onFileSelected }: ActionButtonsProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileSelected(file);
        // Reset the input so the same file can be selected again
        e.target.value = '';
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-5">
            {/* Instruction text — large, explicit, high-contrast */}
            <p className="text-center text-lg sm:text-xl text-gray-300 font-medium leading-relaxed px-2">
                Toque em um dos botões abaixo para restaurar uma foto antiga:
            </p>

            {/* Button 1: Camera Capture — Primary solid blue */}
            <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-6 py-5 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg"
            >
                Tirar foto com o celular
            </button>
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Tirar foto com a câmera"
            />

            {/* Button 2: Gallery Picker — Secondary outlined blue */}
            <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-full flex items-center justify-center bg-transparent text-blue-400 font-bold text-xl px-6 py-5 rounded-2xl transition-all duration-200 active:scale-[0.98] border-2 border-blue-500/50 hover:bg-blue-500/10 hover:border-blue-400"
            >
                Escolher da galeria
            </button>
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Escolher foto da galeria"
            />
        </div>
    );
}
