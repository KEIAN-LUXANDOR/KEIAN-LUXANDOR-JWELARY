import path from 'node:path';
import type { NextConfig } from 'next';

// Where the Spring Boot backend runs. Change it with the BACKEND_URL setting
// (for example in a .env.local file) when the backend moves to a server.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
  // This folder (frontend/customer-website) is the project. Without this, Next.js can get
  // confused by other package-lock.json files in the folders above it.
  turbopack: {
    root: path.join(__dirname),
  },

  async rewrites() {
    return [
      // Every request that starts with /api is sent to the Spring Boot backend.
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
      // Product photos now live in public/images. The backend's sample data still uses
      // the old addresses (/ring.webp …), so those keep working too.
      { source: '/:file((?:ring|earring|bracelet|pendant|necklace)(?:-400)?\\.webp)', destination: '/images/:file' },
    ];
  },

  // Old addresses → new pages, so existing links and bookmarks keep working.
  async redirects() {
    return [
      { source: '/collections/rings', destination: '/rings', permanent: true },
      { source: '/collections/earrings', destination: '/earrings', permanent: true },
      { source: '/collections/necklaces', destination: '/necklaces', permanent: true },
      { source: '/collections/bracelets', destination: '/bracelets', permanent: true },
      { source: '/collections/pendants', destination: '/pendants', permanent: true },
      { source: '/collections/yellow-gold', destination: '/diamond-gold', permanent: true },
      { source: '/collections/sterling-silver', destination: '/diamond-silver', permanent: true },
      { source: '/collections/rose-gold', destination: '/diamond-rose', permanent: true },
      { source: '/collections/white-gold', destination: '/diamond-white', permanent: true },
    ];
  },
};

export default nextConfig;
