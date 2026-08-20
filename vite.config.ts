/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    // Playwright's e2e/ specs use their own `test()`/`expect()` from
    // @playwright/test and must never be picked up by Vitest's own test
    // discovery — without this exclude, Vitest tries to run them and
    // Playwright errors with "did not expect test() to be called here."
    exclude: [...configDefaults.exclude, 'e2e/**'],
    globalSetup: ['./tests/globalSetup.ts'],
  },
});
