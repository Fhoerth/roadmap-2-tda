import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: path.join(__dirname, 'dist'),
    lib: {
      entry: path.join(__dirname, 'project', 'main', 'index.ts'),
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['express'],
    },
  },
});
