'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');

        // Simulate newsletter subscription
        // In production, you'd integrate with a service like ConvertKit, Mailchimp, etc.
        try {
            // Placeholder for actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStatus('success');
            setMessage('Thank you for subscribing! Check your email for confirmation.');
            setEmail('');

            // Reset after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 5000);
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');

            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 5000);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={status === 'loading'}
                    className="flex-1 px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary px-6 py-2 disabled:opacity-50"
                >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className={`text-center text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {message}
                </p>
            )}
        </div>
    );
}
