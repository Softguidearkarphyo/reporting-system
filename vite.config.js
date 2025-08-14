import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
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
});
