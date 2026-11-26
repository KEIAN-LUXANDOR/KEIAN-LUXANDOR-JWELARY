import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Unit and component tests (tests/components, tests/features). Run: npm test
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/components/**/*.test.{ts,tsx}', 'tests/features/**/*.test.{ts,tsx}'],
    css: false,
  },
});
