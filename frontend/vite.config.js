import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname),  // <-- Forces Vite to treat /frontend as the root
  plugins: [react()],
})
