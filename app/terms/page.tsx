import { generateMetadata as getMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = getMetadata({
    title: "Terms of Service",
    description: "Terms of Service for ShareOverCoffee - Read our terms and conditions for using our platform.",
    path: "/terms",
});

export default function TermsPage() {
    const lastUpdated = "November 21, 2024";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using ShareOverCoffee (&ldquo;the Service&rdquo;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">2. Description of Service</h2>
                        <p>
                            ShareOverCoffee is a blog platform that allows users to create, publish, and share articles on various topics including psychology, business intelligence, systems analysis, technology, finance, and personal stories.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">3. User Accounts</h2>
                        <h3 className="text-xl font-medium mt-4">3.1 Registration</h3>
                        <p>
                            To access certain features, you must create an account. You agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your password</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Be responsible for all activities under your account</li>
                        </ul>

                        <h3 className="text-xl font-medium mt-4">3.2 Account Termination</h3>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful activities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">4. Content Guidelines</h2>
                        <h3 className="text-xl font-medium mt-4">4.1 Your Content</h3>
                        <p>
                            You retain ownership of content you create and publish. By posting content, you grant us a non-exclusive license to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Display and distribute your content on the platform</li>
                            <li>Make your content available to other users</li>
                            <li>Create backups and copies for service operation</li>
                        </ul>

                        <h3 className="text-xl font-medium mt-4">4.2 Prohibited Content</h3>
                        <p>You may not post content that:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Violates laws or regulations</li>
                            <li>Infringes on intellectual property rights</li>
                            <li>Contains hate speech, harassment, or discrimination</li>
                            <li>Includes spam, malware, or phishing attempts</li>
                            <li>Promotes violence or illegal activities</li>
                            <li>Contains explicit adult content</li>
                            <li>Impersonates others or misrepresents identity</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
                        <p>
                            The Service, including its design, features, and functionality, is owned by ShareOverCoffee and protected by copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="mt-2">
                            You may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Copy or reproduce our platform design or code</li>
                            <li>Use our trademarks without permission</li>
                            <li>Scrape or extract data through automated means</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">6. User Conduct</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Interfere with the proper functioning of the Service</li>
                            <li>Attempt to gain unauthorized access to systems</li>
                            <li>Use automated scripts or bots</li>
                            <li>Collect user information without consent</li>
                            <li>Engage in any behavior that disrupts other users</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">7. Privacy</h2>
                        <p>
                            Your use of the Service is also governed by our{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            , which describes how we collect, use, and protect your personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">8. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, ShareOverCoffee shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">10. Content Moderation</h2>
                        <p>
                            We reserve the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Review and remove content that violates these terms</li>
                            <li>Moderate comments and discussions</li>
                            <li>Take action against accounts that violate our policies</li>
                        </ul>
                        <p className="mt-2">
                            However, we are not obligated to monitor all content and do not guarantee that all content complies with these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
                        <p>
                            We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or platform notifications.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">12. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold">13. Contact Information</h2>
                        <p>
                            If you have questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="mt-2">
                            Email: legal@shareovercoffee.com
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
