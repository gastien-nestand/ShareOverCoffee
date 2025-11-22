import { type Metadata } from 'next';

type MetadataProps = {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
};

const defaultMetadata = {
    title: 'ShareOverCoffee - Share Your Stories',
    description: 'A modern blog platform for sharing insightful articles on psychology, business, technology, and more.',
    siteName: 'ShareOverCoffee',
};

export function generateMetadata({
    title,
    description,
    image,
    path = '',
}: MetadataProps = {}): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3002';
    const url = `${baseUrl}${path}`;
    const metaTitle = title ? `${title} | ${defaultMetadata.siteName}` : defaultMetadata.title;
    const metaDescription = description || defaultMetadata.description;
    const metaImage = image || `${baseUrl}/og-image.png`;

    return {
        title: metaTitle,
        description: metaDescription,
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url,
            siteName: defaultMetadata.siteName,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}
