import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    // ✅ Auto-import components from specified directories
    Components({
      dirs: ['src/components', 'src/pages', 'src/routes', 'src/store'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts', // Optional: for TS auto-complete
    }),

     // ✅ Auto-import Vue functions like ref, reactive, etc.
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts', // TypeScript support
    }),

  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})

