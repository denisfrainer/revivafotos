'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import pt from '@/locales/pt.json';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Locale = 'pt' | 'en' | 'es';

const dictionaries = {
    pt,
    en,
    es,
};

// Recursive type to handle nested keys like "HeroSection.title"
type DefaultDictionary = typeof pt;

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('pt');

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = dictionaries[locale];

        for (const k of keys) {
            if (value === undefined) break;
            value = value[k];
        }

        // Fallback if not found
        if (value === undefined || typeof value !== 'string') {
            return key;
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
