import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          }
        ]
      },
      manifest: {
        name: 'AutoCreator AI',
        short_name: 'AutoCreator',
        description: 'AI-powered content creation platform',
        theme_color: '#000000',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    // Performance Optimization: Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for large dependencies
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-button', '@radix-ui/react-dialog'],
          utils: ['zustand', 'react-query', 'clsx', 'tailwind-merge'],
          animation: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    },
    // Performance Optimization: Minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    // Performance Optimization: Source maps only in development
    sourcemap: process.env.NODE_ENV === 'development',
    // Performance Optimization: Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Performance Optimization: CSS code splitting
    cssCodeSplit: true
  },
  // Performance Optimization: Development server optimizations
  server: {
    port: 3000,
    host: true,
    // Enable HTTP/2 in development
    https: false,
    // Preload optimization
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx']
    }
  },
  // Performance Optimization: Module resolution
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // Performance Optimization: Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'react-query'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Performance Optimization: CSS processing
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  },
  // Performance Optimization: Preview server
  preview: {
    port: 4173,
    host: true
  }
})