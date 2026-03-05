'use client';

import { useState, useCallback } from 'react';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ActionButtons } from '@/components/ActionButtons';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type AppState = 'IDLE' | 'PREVIEW' | 'LOADING';

export function HeroConversion() {
    const [appState, setAppState] = useState<AppState>('IDLE');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [restoredImage, setRestoredImage] = useState<string | null>(null);

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

            // 2. Chamada para a rota RESTORE (Sincronizada com seu Explorer)
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
    }, []); // <--- O array de dependências que o erro ts(2554) reclamou

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

            {/* ESTADO LOADING: Spinner Limpo */}
            {appState === 'LOADING' && (
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner />
                    <p className="text-white animate-pulse">Restaurando memórias...</p>
                </div>
            )}

            {/* ESTADO PREVIEW: O Resultado Real do Usuário */}
            {appState === 'PREVIEW' && restoredImage && originalImage && (
                <div className="w-full flex flex-col items-center gap-8">
                    <BeforeAfterSlider
                        beforeImage={originalImage}
                        afterImage={restoredImage}
                    />
                    <button
                        onClick={() => setAppState('IDLE')}
                        className="bg-white text-black px-8 py-4 rounded-full font-bold"
                    >
                        Restaurar outra
                    </button>
                </div>
            )}
        </div>
    );
}