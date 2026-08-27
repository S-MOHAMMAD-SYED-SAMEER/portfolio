import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // One entry point per page. Listing them here is what makes each case study
  // build to its own real URL as plain static output — no router and no extra
  // dependency for a handful of pages.
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        caseStudySalesRecovery: fileURLToPath(
          new URL('./case-study-sales-recovery.html', import.meta.url),
        ),
        caseStudyInboxCrm: fileURLToPath(
          new URL('./case-study-inbox-crm.html', import.meta.url),
        ),
        caseStudyExplainableAts: fileURLToPath(
          new URL('./case-study-explainable-ats.html', import.meta.url),
        ),
      },
    },
  },
})
