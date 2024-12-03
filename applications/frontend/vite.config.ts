import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dotenv from 'dotenv';
import process from 'process';

let fallbackPort: number = 5173;
let port: number = fallbackPort;

if (typeof process.env.PORT !== 'undefined') {
  port = parseInt(process.env.PORT);
}

dotenv.config();
console.log('BACKEND_URL', process.env.VITE_BACKEND_URL);

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '/',
  define: {
    'process.env': process.env,
  },
  server: {
    port,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist/',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: './index.html',
    },
  },
})
