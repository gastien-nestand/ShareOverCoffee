import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About | Share Over Coffee',
    description: 'The world is moving faster than ever. This blog was created to slow things down and help you learn one new thing every day.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-6 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                        About This Blog
                    </h1>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                </div>

                {/* Content */}
                <div className="glass-card p-8 md:p-12 space-y-8 text-lg leading-relaxed text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <p>
                        The world is moving faster than ever. New technologies appear every week, AI is suddenly everywhere, and information comes at us so quickly that it barely has time to settle. We scroll, we skim, we save things "for later" and never return. Before we know it, we feel behind—like everyone else understands what's happening except us.
                    </p>

                    <p className="text-xl font-medium text-foreground">
                        This blog was created to slow things down.
                    </p>

                    <p>
                        Here, the goal is simple: learn one new thing every day, and explain it in a way anyone can understand. No jargon. No long lectures. No gatekeeping. Just clear ideas, broken down so that anyone no matter their background can walk away saying, "I get this now."
                    </p>

                    <p>
                        Every week, people from different fields share something they learned: something surprising, something useful, something from an industry you may know nothing about. It might be technology, or business, or health, or design, or science, or real estate. The point is variety. The point is curiosity. The point is to help you build a mind that keeps expanding instead of shrinking under the pressure of fast information.
                    </p>

                    <div className="bg-secondary/30 p-6 rounded-xl border border-border/50">
                        <h3 className="text-foreground font-semibold mb-4">This space is for you if:</h3>
                        <ul className="space-y-3 list-disc list-inside">
                            <li>You want to understand the world without getting overwhelmed.</li>
                            <li>You're curious but don't know where to start.</li>
                            <li>You want short, clear explanations instead of complicated noise.</li>
                            <li>You want to learn at least one meaningful thing each day.</li>
                        </ul>
                    </div>

                    <p className="italic text-foreground">
                        In a world that moves too quickly, learning slowly and clearly is a form of power.
                    </p>

                    <p>
                        Welcome to the place where ideas become simple, and knowledge becomes part of your everyday life.
                    </p>
                </div>

                {/* CTA */}
                <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <Link href="/search" className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-primary/25 transition-all">
                        Start Reading
                    </Link>
                </div>
            </div>
        </div>
    );
}
