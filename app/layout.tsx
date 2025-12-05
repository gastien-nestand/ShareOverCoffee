import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopLoader from "@/components/TopLoader";
import NotificationPrompt from "@/components/NotificationPrompt";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { generateMetadata as getMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    ...getMetadata({
        title: "ShareOverCoffee - Share Your Stories",
        description: "Discover insightful articles on psychology, business intelligence, systems analysis, technology, finance, and personal stories.",
    }),
    manifest: '/manifest.json',
    themeColor: '#0f172a',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'ShareOverCoffee',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <TopLoader />
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex min-h-screen flex-col">
                            <Header />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </div>
                        <NotificationPrompt />
                        <PWAInstallPrompt />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
