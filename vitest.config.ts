import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Component unit-test config (jsdom).
 *
 * Storybook ships its own browser-mode vitest config inside vite.config.ts
 * for visual/story tests. This file is the fast jsdom runner for
 * behavioral component tests (Button.test.tsx, Checkbox.test.tsx, etc).
 *
 * Run with: `pnpm test` (or `pnpm test:watch`).
 */
export default defineConfig({
  plugins: [react()],
  test: {
    name: 'unit',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
