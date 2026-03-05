/*
  app/layout.tsx
  Root layout — provides <html> and <body> for ALL routes.
  Font Stack: Space Grotesk (headings) + Inter (body/buttons).
*/

import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-space-grotesk",
    display: 'swap',
});

const sourceSans = Source_Sans_3({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-source-sans",
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Reviva Fotos | Restaure suas fotos antigas',
    description: 'Sabe aquela foto antiga manchada ou borrada? Nossa tecnologia recupera o rosto de quem você ama na hora. Clique e veja a mágica.',
    metadataBase: new URL('https://revivafotos.netlify.app'), // MUDAR PARA O SEU DOMÍNIO REAL
    openGraph: {
        title: '✨ Reviva Fotos: Restaure suas fotos antigas em segundos',
        description: 'Sabe aquela foto antiga manchada ou borrada? Nossa tecnologia recupera o rosto de quem você ama na hora. Clique e veja a mágica.',
        url: 'https://revivafotos.netlify.app', // MUDAR PARA O SEU DOMÍNIO REAL
        siteName: 'Reviva Fotos',
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '✨ Reviva Fotos: Restaure suas fotos antigas',
        description: 'Recupere memórias de família com um clique.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt">
            <body
                className={cn(
                    "font-sans antialiased bg-black text-white",
                    spaceGrotesk.variable,
                    sourceSans.variable
                )}
            >
                {children}
            </body>
        </html>
    );
}
