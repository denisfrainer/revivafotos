'use client';

/**
 * UPLOAD BOX - PREMIUM GLASSMORPHISM REDESIGN
 * 1. Visual Excellence: Replaced dashes with a solid glassmorphism look.
 * 2. Zero-CLS: Continues to match BeforeAfterSlider dimensions (aspect-video).
 * 3. High-End Feel: Uses backdrop-blur and subtle borders for a "Premium AI" aesthetic.
 */
export function UploadBox({ onCancel }: { onCancel: () => void }) {
    return (
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-8 group transition-all duration-500 hover:border-[var(--accent-blue)]/30 hover:bg-white/[0.06] shadow-[inset_0_0_20px_rgba(255,255,255,0.02),0_20px_50px_rgba(0,0,0,0.5)]">

            {/* Premium inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-blue)]/5 via-transparent to-white/5 pointer-events-none opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--accent-blue)]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight">Arraste sua foto aqui</h3>
                    <p className="text-sm md:text-base text-gray-400 font-light opacity-80">Ou selecione um arquivo de alta qualidade</p>
                </div>

                <button className="bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-gray-200 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 text-sm md:text-base">
                    Selecionar Arquivo
                </button>
            </div>

            {/* Hidden file input for native interaction */}
            <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                accept="image/*"
            />

            {/* Elegant Cancel button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                }}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all duration-300 p-2 z-30 group/btn"
                aria-label="Cancelar upload"
            >
                <svg className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="absolute bottom-6 text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] font-medium opacity-60">
                JPG, PNG ou WebP • Max 10MB
            </div>
        </div>
    );
}
