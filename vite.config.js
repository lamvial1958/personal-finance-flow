import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    // Base path baseado no ambiente
    base: isProduction ? '/personal-finance-flow/' : '/',
    
    plugins: [
      // ✅ CORRIGIDO: Configuração React sem jsxImportSource problemático
      react({
        // Configuração otimizada para Vite 7.x
        fastRefresh: true
      }),
      wasm(),
      topLevelAwait(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/sql.js/dist/sql-wasm.wasm',
            dest: 'assets'
          }
        ]
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
        disable: !isProduction,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            }
          ]
        },
        manifest: {
          name: 'V&M Personal Finance',
          short_name: 'V&M Finance',
          description: 'Aplicativo de controle financeiro pessoal com funcionalidade OFX',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: isProduction ? '/personal-finance-flow/' : '/',
          start_url: isProduction ? '/personal-finance-flow/' : '/',
          id: 'vm-personal-finance',
          categories: ['finance', 'productivity', 'business'],
          lang: 'pt-BR',
          dir: 'ltr',
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon',
              purpose: 'any'
            }
          ]
        }
      })
    ],
    
    // ✅ CORRIGIDO: Configuração de servidor otimizada para Vite 7.x
    server: {
      // Configuração HMR otimizada para prevenir re-renders
      hmr: {
        overlay: true,
        port: 5173
      },
      fs: {
        allow: ['..']
      }
    },
    
    // Configuração CSS
    css: {
      postcss: './postcss.config.js',
      devSourcemap: !isProduction
    },
    
    // ✅ CORRIGIDO: optimizeDeps limpo para Vite 7.x
    optimizeDeps: {
      exclude: ['sql.js']
    },
    
    // Build otimizado
    build: {
      target: 'es2020',
      minify: isProduction ? 'esbuild' : false,
      sourcemap: !isProduction,
      cssCodeSplit: true,
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            'sql.js': ['sql.js'],
            'react-vendor': ['react', 'react-dom'],
            'utils': ['papaparse', 'fast-xml-parser', 'xmlbuilder2']
          },
          chunkFileNames: isProduction ? 'assets/[name]-[hash].js' : 'assets/[name].js',
          entryFileNames: isProduction ? 'assets/[name]-[hash].js' : 'assets/[name].js',
          assetFileNames: isProduction ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]'
        }
      },
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000,
      cssMinify: isProduction ? 'esbuild' : false
    },
    
    // ✅ REMOVIDO: Configuração esbuild problemática que injetava React duplicado
    // esbuild: {
    //   jsxInject: `import React from 'react'`  // ← Esta linha causava o problema
    // },
    
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString())
    }
  }
})