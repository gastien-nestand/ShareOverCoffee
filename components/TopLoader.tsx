'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function TopLoaderContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Configure NProgress
        NProgress.configure({
            showSpinner: false,
            trickleSpeed: 200,
            minimum: 0.08,
            easing: 'ease',
            speed: 500,
        });
    }, []);

    useEffect(() => {
        // Complete progress when route changes
        NProgress.done();

        // Start progress on next navigation
        return () => {
            NProgress.start();
        };
    }, [pathname, searchParams]);

    return null;
}

export default function TopLoader() {
    return (
        <Suspense fallback={null}>
            <TopLoaderContent />
        </Suspense>
    );
}
