import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['yt-dlp-wrap'],
    outputFileTracingIncludes: {
        '/*': ['./bin/**/*'],
    },
};

export default withNextIntl(withPWA(nextConfig));
