import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components', 'src/pages', 'src/routes', 'src/store'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
    }),

    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    chunkSizeWarningLimit: 8000,
    rollupOptions: {
      output: {
        // Split vendor code into separate chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx-populate')) {
              return 'xlsx'; // heavy Excel lib in its own chunk
            }
            if (id.includes('pinia')) {
              return 'pinia'; // state management separate
            }
            return 'vendor'; // everything else
          }
        },
      },
    },
  },
});
