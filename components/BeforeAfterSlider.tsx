'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeAlt?: string;
    afterAlt?: string;
}

/**
 * BEFORE/AFTER SLIDER — GODSPEED ARCHITECTURE v2
 *
 * PERFORMANCE DOGMAS ENFORCED:
 * 1. Elite LCP Engine: Both images use priority + fetchPriority="high" + loading="eager" + decoding="sync".
 * 2. Squoosh Standard: Expects AVIF sources exclusively.
 * 3. Stability of State (0 TBT / 0 CLS): Initial 50% position is hardcoded via inline CSS.
 *    useRef (not useState) drives updates — zero re-renders, direct DOM mutations only.
 *
 * INTERACTION:
 * - Pointer events (mouse + touch) for fluid, 60fps dragging.
 * - Keyboard accessible: Arrow keys, Home/End.
 * - ARIA slider role for screen readers.
 *
 * LABELS:
 * - "Antes" hides when slider is at 0% (fully "Depois").
 * - "Depois" hides when slider is at 100% (fully "Antes").
 */
export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeAlt = "Foto antes da restauração",
    afterAlt = "Foto depois da restauração",
}: BeforeAfterSliderProps) {
    const positionRef = useRef(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const clipRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const beforeLabelRef = useRef<HTMLDivElement>(null);
    const afterLabelRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    /** Directly mutate DOM nodes — zero React re-renders */
    const updatePosition = useCallback((percent: number) => {
        const clamped = Math.max(0, Math.min(100, percent));
        positionRef.current = clamped;

        if (clipRef.current) {
            clipRef.current.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
        }
        if (handleRef.current) {
            handleRef.current.style.left = `${clamped}%`;
        }
        if (containerRef.current) {
            containerRef.current.setAttribute('aria-valuenow', String(Math.round(clamped)));
        }

        // Dynamic label visibility:
        // Hide "Antes" when fully at "Depois" (0%), hide "Depois" when fully at "Antes" (100%)
        if (beforeLabelRef.current) {
            beforeLabelRef.current.style.opacity = clamped <= 2 ? '0' : '1';
        }
        if (afterLabelRef.current) {
            afterLabelRef.current.style.opacity = clamped >= 98 ? '0' : '1';
        }
    }, []);

    /** Convert a pointer clientX to a percentage of the container width */
    const getPercent = useCallback((clientX: number) => {
        const container = containerRef.current;
        if (!container) return 50;
        const rect = container.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
    }, []);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        isDragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        updatePosition(getPercent(e.clientX));
    }, [getPercent, updatePosition]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current) return;
        updatePosition(getPercent(e.clientX));
    }, [getPercent, updatePosition]);

    const onPointerUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    /** Keyboard accessibility: Arrow keys ±2%, Home/End for 0%/100% */
    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        const step = 2;
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                e.preventDefault();
                updatePosition(positionRef.current - step);
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                e.preventDefault();
                updatePosition(positionRef.current + step);
                break;
            case 'Home':
                e.preventDefault();
                updatePosition(0);
                break;
            case 'End':
                e.preventDefault();
                updatePosition(100);
                break;
        }
    }, [updatePosition]);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-ew-resize select-none touch-none"
            role="slider"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Comparação de imagem antes e depois"
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
        >
            {/*
              LAYER 1: "After" Image (Base — full width, always visible)
              LCP-critical: all four performance attributes enforced.
            */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={afterImage}
                    alt={afterAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    priority={true}
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                />
            </div>

            {/*
              LAYER 2: "Before" Image (Clipped via inset clip-path)
              Uses clip-path: inset() for GPU-accelerated clipping.
              Initial clip hardcoded to 50% — server delivers this exact visual.
              JavaScript only mutates this value AFTER user interaction.
            */}
            <div
                ref={clipRef}
                className="absolute inset-0 z-10"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
            >
                <Image
                    src={beforeImage}
                    alt={beforeAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    priority={true}
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                />
            </div>

            {/*
              LAYER 3: Slider Handle (Visual Indicator)
              pointer-events-none — interaction is captured on the parent container.
              Initial left hardcoded to 50%.
            */}
            <div
                ref={handleRef}
                className="absolute inset-y-0 z-20 pointer-events-none"
                style={{ left: '50%' }}
            >
                {/* Vertical line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" />

                {/* Circular grip handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl border-[3px] border-black/10">
                    <svg className="w-5 h-5 text-black/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-5 h-5 text-black/80 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* LAYER 4: Labels — dynamic visibility based on slider position */}
            <div
                ref={beforeLabelRef}
                className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest text-white/80 pointer-events-none select-none border border-white/10 transition-opacity duration-200"
            >
                Antes
            </div>
            <div
                ref={afterLabelRef}
                className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-[var(--accent-blue)]/80 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest text-white pointer-events-none select-none border border-white/10 transition-opacity duration-200"
            >
                Depois
            </div>
        </div>
    );
}
