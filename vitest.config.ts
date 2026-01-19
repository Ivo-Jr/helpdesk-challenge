import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest.setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/.next/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/app': path.resolve(__dirname, './app'),
      '@/components': path.resolve(__dirname, './app/_components'),
      '@/ui': path.resolve(__dirname, './app/_components/ui'),
      '@/lib': path.resolve(__dirname, './app/_lib'),
      '@/types': path.resolve(__dirname, './app/_types'),
      '@/stores': path.resolve(__dirname, './app/_stores'),
      '@/styles': path.resolve(__dirname, './app/_styles'),
      '@/hooks': path.resolve(__dirname, './app/_hooks'),
    },
  },
});

