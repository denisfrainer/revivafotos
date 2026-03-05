'use client';

/**
 * LOADING SPINNER — Zero-Rerender Architecture
 *
 * All other text uses Inter (inherited).
 */
export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            {/* Spinner */}
            <svg className="animate-spin h-10 w-10 text-blue-400 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>

            <p className="text-lg text-gray-200 font-semibold mb-2">
                A IA está restaurando sua foto...
            </p>
            <p className="text-sm text-gray-400">
                A IA está fazendo sua mágica... (Isso pode levar alguns segundos)
            </p>
        </div>
    );
}