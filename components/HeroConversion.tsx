'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ActionButtons } from '@/components/ActionButtons';

export type AppState = 'IDLE' | 'PREVIEW' | 'LOADING';

interface HeroConversionProps {
    onStateChange?: (state: AppState) => void;
}

export function HeroConversion({ onStateChange }: HeroConversionProps) {
    const [appState, setAppState] = useState<AppState>('IDLE');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [restoredImage, setRestoredImage] = useState<string | null>(null);

    // ⏱️ HIGH-PERFORMANCE TIMER — Zero re-render architecture
    const [displayTime, setDisplayTime] = useState('0.00');
    const rafIdRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    // 📡 Notify parent of state changes
    useEffect(() => {
        onStateChange?.(appState);
    }, [appState, onStateChange]);

    // 🔄 requestAnimationFrame loop — starts/stops with LOADING state
    useEffect(() => {
        if (appState !== 'LOADING') {
            // Clean up any lingering frame
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            return;
        }

        startTimeRef.current = performance.now();

        const tick = () => {
            const elapsed = (performance.now() - startTimeRef.current) / 1000;
            setDisplayTime(elapsed.toFixed(2));
            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [appState]);

    const handleFileSelected = useCallback(async (file: File) => {
        console.log('🚀 Iniciando restauração:', file.name);
        setAppState('LOADING');

        try {
            // 1. Converter para Base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
            });
            reader.readAsDataURL(file);
            const base64Data = await base64Promise;

            setOriginalImage(URL.createObjectURL(file));

            // 2. Chamada para a rota RESTORE
            const response = await fetch('/api/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Data,
                    mimeType: file.type
                }),
            });

            if (!response.ok) throw new Error('Falha na restauração');

            const data = await response.json();

            // 3. Processar Sucesso
            if (data.success && data.image) {
                setRestoredImage(data.image);
                setAppState('PREVIEW');
            } else {
                throw new Error(data.error || 'Falha na restauração');
            }

        } catch (error: any) {
            console.error('❌ Erro:', error);
            alert(error.message || 'Houve um erro ao processar sua foto.');
            setAppState('IDLE');
        }
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[500px] flex flex-col items-center justify-center relative">

            {/* ESTADO IDLE: Mostra o exemplo original */}
            {appState === 'IDLE' && (
                <div className="w-full flex flex-col items-center gap-10">
                    <BeforeAfterSlider
                        beforeImage="/assets/before.avif"
                        afterImage="/assets/after.avif"
                    />
                    <ActionButtons onFileSelected={handleFileSelected} />
                </div>
            )}

            {/* ESTADO LOADING: Spinner + Live Timer */}
            {appState === 'LOADING' && (
                <div className="flex flex-col items-center gap-6">
                    {/* Spinner */}
                    <div className="w-16 h-16 border-4 border-white/30 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-200" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '18px' }}>
                        A IA está fazendo sua mágica em{' '}
                        <span className="font-mono font-bold text-white tabular-nums">{displayTime}</span>s...
                    </p>
                </div>
            )}

            {/* ESTADO PREVIEW: Resultado + CTA de Conversão */}
            {appState === 'PREVIEW' && restoredImage && originalImage && (
                <div className="w-full flex flex-col items-center gap-8">
                    <BeforeAfterSlider
                        beforeImage={originalImage}
                        afterImage={restoredImage}
                    />

                    {/* 🔵 CTA PRINCIPAL — Azul idêntico ao Hero */}
                    <button
                        onClick={() => {
                            // TODO: Conectar ao fluxo de pagamento
                            alert('Em breve! O download em alta resolução será liberado após o pagamento.');
                        }}
                        className="w-full max-w-2xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-6 py-5 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg"
                    >
                        Baixar foto em alta resolução (HD)
                    </button>

                    {/* Link sutil — Restaurar outra */}
                    <button
                        onClick={() => {
                            setRestoredImage(null);
                            setOriginalImage(null);
                            setAppState('IDLE');
                        }}
                        className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors duration-200"
                    >
                        Restaurar outra foto
                    </button>

                    {/* Trust badge */}
                    <p className="text-xs text-gray-500">
                        🔒 Pagamento 100% Seguro. Download Imediato.
                    </p>
                </div>
            )}
        </div>
    );
}