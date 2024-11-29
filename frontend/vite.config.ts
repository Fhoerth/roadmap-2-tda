import react from '@vitejs/plugin-react-swc';
import process from 'process';

let fallbackPort: number = 5173;
let port: number = fallbackPort;
if (typeof process.env.PORT !== 'undefined') {
  port = parseInt(process.env.PORT);
}

/** @type {import('vite').UserConfig} */
export default {
  plugins: [react()],
  base: '/',
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
};