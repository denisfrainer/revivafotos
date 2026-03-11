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
 * BEFORE/AFTER SLIDER — ANTI-CROP ARCHITECTURE
 *
 * KEY DESIGN: Flow-based layout (NO fixed aspect ratio).
 * The "after" image sits in normal document flow with `w-full h-auto`,
 * so the container's height is dictated by the image's intrinsic aspect ratio.
 * The "before" image is absolutely positioned on top and clipped.
 * This guarantees 100% of pixels are visible — zero cropping.
 *
 * PERFORMANCE:
 * - next/image with unoptimized (AVIF sources already optimized).
 * - priority + eager loading for LCP.
 * - useRef-only updates — zero re-renders.
 *
 * INTERACTION:
 * - Pointer events (mouse + touch) for fluid, 60fps dragging.
 * - Keyboard accessible: Arrow keys, Home/End.
 * - ARIA slider role for screen readers.
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
            className="w-full max-w-md mx-auto relative rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl border border-white/10 cursor-ew-resize select-none touch-none"
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
              LAYER 1: "After" Image — IN FLOW (dictates container height).
              w-full h-auto ensures the image's intrinsic aspect ratio is preserved.
              This is the key to zero-crop: no fill, no object-cover.
            */}
            <Image
                src={afterImage}
                alt={afterAlt}
                width={1200}
                height={1600}
                priority={true}
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                className="w-full h-auto object-contain"
            />

            {/*
              LAYER 2: "Before" Image — ABSOLUTE overlay, clipped via inset().
              Identical sizing to Layer 1 so pixels align perfectly.
            */}
            <div
                ref={clipRef}
                className="absolute inset-0 z-10"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
            >
                <Image
                    src={beforeImage}
                    alt={beforeAlt}
                    width={1200}
                    height={1600}
                    priority={true}
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                    className="w-full h-auto object-contain"
                />
            </div>

            {/*
              LAYER 3: Slider Handle
              pointer-events-none — interaction captured on parent.
            */}
            <div
                ref={handleRef}
                className="absolute inset-y-0 z-20 pointer-events-none"
                style={{ left: '50%' }}
            >
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl border-[3px] border-black/10">
                    <svg className="w-5 h-5 text-black/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg className="w-5 h-5 text-black/80 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* LAYER 4: Labels */}
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
