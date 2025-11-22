import { generateMetadata as getMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = getMetadata({
    title: "Privacy Policy",
    description: "Privacy Policy for ShareOverCoffee - Learn how we collect, use, and protect your personal information.",
    path: "/privacy",
});

export default function PrivacyPage() {
    const lastUpdated = "November 21, 2024";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold">1. Introduction</h2>
                        <p>
                            Welcome to ShareOverCoffee ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website shareovercoffee.com.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
                        <h3 className="text-xl font-medium mt-4">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
                            <li><strong>Profile Information:</strong> Optional bio, avatar, and other profile details</li>
                            <li><strong>Content:</strong> Articles, comments, and other content you create and publish</li>
                            <li><strong>Images:</strong> Cover images and media you upload through our service</li>
                        </ul>

                        <h3 className="text-xl font-medium mt-4">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and interaction with features</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                            <li><strong>Cookies:</strong> Authentication cookies and preference settings</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
                        <p>We use the collected information for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Providing and maintaining our services</li>
                            <li>Creating and managing your account</li>
                            <li>Enabling you to publish and share content</li>
                            <li>Communicating with you about updates and features</li>
                            <li>Improving our platform and user experience</li>
                            <li>Preventing fraud and ensuring security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
                        <p>We use the following third-party services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Neon (Database):</strong> Stores your account and content data</li>
                            <li><strong>Cloudinary:</strong> Hosts and delivers uploaded images</li>
                            <li><strong>Google OAuth:</strong> Optional sign-in service (if used)</li>
                            <li><strong>Vercel:</strong> Hosts our website and application</li>
                        </ul>
                        <p className="mt-2">
                            Each service has its own privacy policy governing how they handle your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">5. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Passwords are hashed using industry-standard encryption</li>
                            <li>All data transmission is encrypted via HTTPS/TLS</li>
                            <li>Database access is restricted and monitored</li>
                            <li>Regular security updates and patches</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Export:</strong> Download your published content</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">7. Cookies</h2>
                        <p>
                            We use essential cookies for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Keeping you signed in to your account</li>
                            <li>Remembering your preferences (e.g., theme)</li>
                            <li>Ensuring security and preventing fraud</li>
                        </ul>
                        <p className="mt-2">
                            You can disable cookies in your browser settings, but this may limit some functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
                        <p>
                            Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">9. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">10. Contact Us</h2>
                        <p>
                            If you have questions about this privacy policy or our data practices, please contact us at:
                        </p>
                        <p className="mt-2">
                            Email: privacy@shareovercoffee.com
                        </p>
                    </section>
                </div>

                <div className="pt-8 border-t border-border">
                    <Link href="/" className="text-primary hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
