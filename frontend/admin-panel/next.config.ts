import path from 'node:path';
import type { NextConfig } from 'next';

// Where the Spring Boot backend runs (change with BACKEND_URL in .env.local).
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
  // This folder (frontend/admin-panel) is the project root.
  turbopack: {
    root: path.join(__dirname),
  },

  async rewrites() {
    // Every request that starts with /api is sent to the Spring Boot backend.
    return [{ source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }];
  },

  async redirects() {
    // The admin panel opens on the dashboard (it asks you to sign in first).
    return [{ source: '/', destination: '/dashboard', permanent: false }];
  },
};

export default nextConfig;
