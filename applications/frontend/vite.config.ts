import react from '@vitejs/plugin-react-swc';
import process from 'process';

let fallbackPort: number = 5173;
let port: number = fallbackPort;
if (typeof process.env.PORT !== 'undefined') {
  port = parseInt(process.env.PORT);
}

console.log(process.env.VITE_BACKEND_URL);

/** @type {import('vite').UserConfig} */
export default {
  plugins: [react()],
  base: '/',
  define: {
    'process.env': {
      'VITE_BACKEND_URL': process.env.VITE_BACKEND_URL || null,
    },
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
};
