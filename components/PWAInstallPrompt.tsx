'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(iOS);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return; // Already installed
        }

        // For iOS, show install button if not in standalone mode
        if (iOS) {
            setShowInstallButton(true);
            return;
        }

        // For Android/Desktop Chrome
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // Show iOS instructions
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    const handleDismiss = () => {
        setShowInstallButton(false);
        // Store dismissal in localStorage to not show again for a while
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    const handleIOSClose = () => {
        setShowIOSInstructions(false);
    };

    if (!showInstallButton) {
        return null;
    }

    // iOS Instructions Modal
    if (showIOSInstructions) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Install ShareOverCoffee
                        </h3>
                        <button
                            onClick={handleIOSClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <p>To install this app on your iPhone/iPad:</p>
                        <ol className="list-decimal list-inside space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0">1.</span>
                                <span>
                                    Tap the <strong>Share</strong> button
                                    <svg className="inline h-5 w-5 mx-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                                    </svg>
                                    at the bottom of your screen
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0">2.</span>
                                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0">3.</span>
                                <span>Tap <strong>"Add"</strong> in the top right corner</span>
                            </li>
                        </ol>
                    </div>
                    <button
                        onClick={handleIOSClose}
                        className="mt-6 w-full btn-primary py-3"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        );
    }

    // Install Button (for both iOS and Android)
    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-40 animate-slide-up">
            <div className="glass-card border border-border rounded-lg shadow-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-10 w-10 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                            <line x1="6" x2="6" y1="2" y2="4" />
                            <line x1="10" x2="10" y1="2" y2="4" />
                            <line x1="14" x2="14" y1="2" y2="4" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            Install ShareOverCoffee
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                            Get quick access and offline reading
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="flex-1 btn-primary py-2 text-sm"
                            >
                                {isIOS ? 'How to Install' : 'Install'}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
