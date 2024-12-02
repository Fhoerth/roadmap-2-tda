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
      VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || null,
      MODE: process.env.MODE || null,
      NODE_ENV: process.env.NODE_ENV || null,
      VITE_API_KEY: process.env.VITE_API_KEY || null,
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || null,
      VITE_AUTH_URL: process.env.VITE_AUTH_URL || null,
      VITE_AUTH_CLIENT_ID: process.env.VITE_AUTH_CLIENT_ID || null,
      VITE_APP_ENV: process.env.VITE_APP_ENV || null,
      VITE_APP_VERSION: process.env.VITE_APP_VERSION || null,
      VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN || null,
      VITE_FEATURE_X_ENABLED: process.env.VITE_FEATURE_X_ENABLED || 'false',
      VITE_API_TIMEOUT: process.env.VITE_API_TIMEOUT || '5000',
      VITE_LOG_LEVEL: process.env.VITE_LOG_LEVEL || 'info',
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
