module.exports = {
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        // Only run ESLint on these directories during production builds
        dirs: ['app', 'components', 'lib'],
        // Ignore ESLint errors during builds (warnings still show)
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};
