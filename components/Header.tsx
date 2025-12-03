'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        } else {
            router.push('/search');
            setSearchOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-foreground to-muted-foreground opacity-0 group-hover:opacity-100 blur transition-opacity rounded-full" />
                            <svg
                                className="relative h-8 w-8 text-foreground"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                                <line x1="6" x2="6" y1="2" y2="4" />
                                <line x1="10" x2="10" y1="2" y2="4" />
                                <line x1="14" x2="14" y1="2" y2="4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold gradient-text">ShareOverCoffee</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/search"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/create"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Write
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 rounded-md hover:bg-accent transition-colors"
                            aria-label="Search"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>

                        {/* Notification Bell */}
                        <NotificationBell />

                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-md hover:bg-accent transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                )}
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Auth Buttons - Desktop */}
                        {session ? (
                            <div className="hidden md:block relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors"
                                >
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || ''}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 glass-card border border-border rounded-lg shadow-lg py-1">
                                        <div className="px-4 py-2 border-b border-border">
                                            <p className="text-sm font-medium">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                        </div>
                                        <Link
                                            href={`/profile/${session.user.id}`}
                                            className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/saved"
                                            className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Saved Posts
                                        </Link>
                                        <Link
                                            href="/create"
                                            className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Write Article
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                signOut();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-accent transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="hidden sm:inline-flex btn-ghost px-3 py-2 text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="hidden sm:inline-flex btn-primary px-3 py-2 text-sm"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Search Bar (expandable) */}
                {searchOpen && (
                    <div className="pb-4 animate-fade-in">
                        <form onSubmit={handleSearch} className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                                autoFocus
                            />
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 animate-fade-in border-t border-border mt-4 pt-4">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                href="/search"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Explore
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/create"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Write
                            </Link>
                            {session ? (
                                <>
                                    <Link
                                        href={`/profile/${session.user.id}`}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/saved"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Saved Posts
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            signOut();
                                        }}
                                        className="text-left text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-2 py-1"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="btn-primary px-4 py-2 text-sm text-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
