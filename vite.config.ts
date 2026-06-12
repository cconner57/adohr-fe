/// <reference types="node" />
import dns from 'node:dns'
import { fileURLToPath, URL } from 'node:url'

import { cloudflare } from "@cloudflare/vite-plugin";
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'


dns.setDefaultResultOrder('ipv4first')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), cloudflare()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: 'localhost',
      port: 5173,
      allowedHosts: ['www.adohr.app', 'adohr.app'],
      proxy: {
        // Proxy all backend routes to local backend while maintaining relative paths
        // This allows access via localhost OR tunnel (adohr.app) transparently
        '/v1': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/pets': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/applications': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/metrics': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/login': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/register': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/users': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/validate-invite': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/healthz': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/sitemap.xml': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
        '/pet-photos': {
          target: env.VITE_API_URL || 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
})