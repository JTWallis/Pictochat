import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets':      path.resolve(__dirname, 'src/assets'),
      '@components':  path.resolve(__dirname, 'src/components'),
      '@contexts':    path.resolve(__dirname, 'src/contexts'),
      '@enums':       path.resolve(__dirname, 'src/enums'),
      '@models':      path.resolve(__dirname, 'src/models'),
      '@services':    path.resolve(__dirname, 'src/services'),
      '@utils':       path.resolve(__dirname, 'src/utils')
    }
  }
})
