const path = require('path');
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LocalBlockExplorer',
      // the proper extensions will be added
      fileName: (format) => `local-block-explorer.${format}.js`,
    },
    rollupOptions: {
      input: "./src/index.ts",
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vue-router'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})