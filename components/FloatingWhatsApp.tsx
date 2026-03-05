/**
 * FLOATING WHATSAPP CTA — Pure SVG Asset, No Processing
 *
 * Uses native <img> to render the SVG exactly as authored.
 * Server Component (No 'use client'): Zero JavaScript footprint.
 * Lazy loaded & Async decoded to protect the 1.3s LCP.
 */

const WHATSAPP_NUMBER = '5548992123255';
const WHATSAPP_MESSAGE = encodeURIComponent(
    'Olá! Fiz o teste no site e gostaria de ajuda para restaurar minha foto.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export function FloatingWhatsApp() {
    return (
        <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fale conosco pelo WhatsApp"
            className="fixed bottom-6 right-6 z-50 block hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-lg animate-[bounceIn_0.6s_ease-out_1s_both]"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/WhatsApp.svg"
                alt="WhatsApp"
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="w-16 h-16"
            />
        </a>
    );
}