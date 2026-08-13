import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Two pages, two entry points. Listing them here is what makes the case
  // study build to its own real URL as plain static output — no router and no
  // extra dependency for a site with exactly two pages.
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        caseStudySalesRecovery: fileURLToPath(
          new URL('./case-study-sales-recovery.html', import.meta.url),
        ),
      },
    },
  },
})
