import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// The same modules every surface reads. Structured data derived from them
// cannot contradict what the pages themselves render.
import { projects } from './src/data/projects.ts'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from './src/data/contact.ts'

/**
 * Gives every page Open Graph and Twitter tags, derived from what it already says.
 *
 * WHY DERIVE RATHER THAN LIST
 *
 * Each of the seven pages already carries a hand-written <title> and meta
 * description that are accurate and page-specific. Writing og:title next to
 * them would mean maintaining a second copy of each string, and the failure
 * mode of a stale og:title is invisible — the page looks right, and only the
 * link preview on someone else's phone is wrong. Copying the page's own values
 * means the two cannot disagree.
 *
 * WHY A BUILD PLUGIN RATHER THAN REACT
 *
 * A crawler and a messaging app read the HTML that comes off the server; most
 * never execute the bundle. Metadata written by a component would be invisible
 * to exactly the clients it exists for. This runs at transform time, so the
 * tags are in the file on disk.
 *
 * WHY THE VALUES ARE COPIED AS RAW HTML
 *
 * The strings are lifted straight out of one double-quoted attribute (or the
 * title element) and placed into another, so whatever escaping the source
 * already had is exactly the escaping the destination needs — `&amp;` stays
 * `&amp;` and decodes once, on both sides. Re-encoding here is what would
 * produce `&amp;amp;`.
 *
 * ABSOLUTE URLS
 *
 * canonical, og:url, og:image and twitter:image all have to be absolute — a
 * crawler or a messaging app resolves them with no page context — so they need
 * the production origin. It is written once, below, and every route is derived
 * from the entry point's own filename, which is what Rollup uses to name the
 * output file. So a page cannot end up declaring a canonical URL for a route
 * that does not exist: the two come from the same string.
 */

/**
 * The deployed origin. No trailing slash — every route below supplies its own
 * leading one, which is what keeps `//` out of the result.
 *
 * Spelled exactly as the deployment is. The subdomain reads "porfolio", and
 * that is deliberate: it is the host that actually serves the site, and a
 * canonical tag pointing at a corrected-but-nonexistent domain would be worse
 * than none at all.
 */
const SITE_ORIGIN = 'https://porfolio-sigma-woad.vercel.app'

/** One card for the whole site: identity, not per-page artwork. */
const OG_IMAGE = `${SITE_ORIGIN}/og-image.png`

/**
 * The card's real pixel size, declared so a scraper can lay the preview out
 * before the image arrives.
 *
 * Without these, some scrapers — LinkedIn's in particular, on the first fetch
 * of a URL — will not block on downloading a 120 kB PNG to discover its shape,
 * and fall back to a small thumbnail or no image at all. The values are the
 * file's actual intrinsic dimensions, not a target: `public/og-image.png` is
 * 1200x630, which is also the 1.91:1 that `summary_large_image` expects.
 */
const OG_IMAGE_WIDTH = '1200'
const OG_IMAGE_HEIGHT = '630'

/**
 * What the card actually shows, for anyone whose reader announces it rather
 * than renders it.
 *
 * The image is a text card, so this describes the words on it — that is what
 * is in the frame. Ampersands are escaped because this string is authored here
 * rather than copied out of an already-escaped attribute like the title and
 * description below.
 */
const OG_IMAGE_ALT =
  'A dark title card reading: S Mohammad Syed Sameer, AI Automation Engineer — ' +
  'AI systems for small e-commerce and D2C stores, built, tested and documented. ' +
  'Three labels sit beneath it: AI Customer Support &amp; Sales Recovery, ' +
  'AI Inbox &amp; Lead Management, AI Recruitment Intelligence.'

/**
 * The name of the site itself, shown beside the title in a link preview.
 *
 * The wordmark in the nav and the line in the footer, which is the shortest
 * form the site uses for itself. Deliberately not the homepage <title>: that
 * string is already the og:title on `/`, and repeating it would print the same
 * words twice in one card.
 */
const OG_SITE_NAME = 'S Mohammad Syed Sameer'

/**
 * Structured data for one page, or null where the content does not support any.
 *
 * WHAT IS AND IS NOT CLAIMED HERE
 *
 * Every value below already appears on the page, in `projects.ts` or in
 * `contact.ts`. Nothing is asserted that the site does not itself say: no
 * awards, no employers, no customer counts, no dates, and in particular no
 * `aggregateRating`, `review` or `offers`. Those three are what earn a rich
 * result, and inventing them is how structured data turns into a lie that
 * Google renders in bold.
 *
 * WHY THE DEMO PAGES ARE `WebPage` AND NOT `WebApplication`
 *
 * They would pass as a web application — they are interactive and run entirely
 * in the browser. But `WebApplication` describes the product, and these pages
 * are a deterministic simulation of a product, on invented data. Labelling the
 * simulation as the software would state in machine-readable form exactly the
 * thing every disclosure on the page is careful to deny. `WebPage` is true,
 * and the description it carries is the page's own, which says "synthetic
 * data" in as many words.
 *
 * The case studies use `about: SoftwareApplication` instead, because there the
 * page really is a document ABOUT a deployed system, and the URL it points at
 * is that system's own.
 */
function structuredData(file: string, title: string, description: string): unknown {
  const person = {
    '@type': 'Person',
    '@id': `${SITE_ORIGIN}/#person`,
    name: 'S Mohammad Syed Sameer',
    jobTitle: 'AI Automation Engineer',
    url: `${SITE_ORIGIN}/`,
    // `sameAs` is how a search engine reconciles this person across the web, so
    // it takes the two profiles that are the person — the ones the Contact
    // section already links. It used to hold the monorepo URL, which is a
    // repository rather than a profile of anybody, and left the LinkedIn and
    // GitHub accounts the site does link out of the machine-readable identity.
    sameAs: [GITHUB_PROFILE_URL, LINKEDIN_URL],
  }

  if (file === 'index.html') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        person,
        {
          '@type': 'WebSite',
          '@id': `${SITE_ORIGIN}/#website`,
          url: `${SITE_ORIGIN}/`,
          name: title,
          description,
          publisher: { '@id': `${SITE_ORIGIN}/#person` },
        },
      ],
    }
  }

  const route = `/${file}`

  // The 3D experience. A WebPage like the demos: it presents the same three
  // projects in another form, and claiming it is a separate application would
  // say something the page itself does not.
  if (file === '3d.html') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: `${SITE_ORIGIN}${route}`,
      name: title,
      description,
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      author: { '@id': `${SITE_ORIGIN}/#person` },
    }
  }

  const project = projects.find(
    (p) => p.caseStudyHref === route || p.interactiveDemoHref === route,
  )
  if (!project) return null

  const page = {
    '@type': 'WebPage',
    url: `${SITE_ORIGIN}${route}`,
    name: title,
    description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    author: { '@id': `${SITE_ORIGIN}/#person` },
  }

  if (project.caseStudyHref !== route) return { '@context': 'https://schema.org', ...page }

  return {
    '@context': 'https://schema.org',
    ...page,
    about: {
      '@type': 'SoftwareApplication',
      name: project.title,
      applicationCategory: 'BusinessApplication',
      // The one place a browser is genuinely required, and the only
      // operating-system-ish claim that is true of all three.
      operatingSystem: 'Web browser',
      ...(project.demoHref ? { url: project.demoHref } : {}),
      author: { '@id': `${SITE_ORIGIN}/#person` },
    },
  }
}

function socialMetadata(): Plugin {
  const read = (html: string, pattern: RegExp, what: string): string => {
    const match = pattern.exec(html)
    if (!match) throw new Error(`socialMetadata: no ${what} in this entry point`)
    return match[1]!.trim().replace(/\s+/g, ' ')
  }

  /**
   * Turns HTML-escaped attribute text back into the characters it stands for.
   *
   * The <title> and the meta description are escaped for HTML, which is right
   * for the og:/twitter: tags below — those are attributes, and copying the
   * escaping across is what keeps `&amp;` decoding exactly once. A <script>
   * element is not attribute context: its content is raw text, so an `&amp;`
   * left in there would reach a consumer as the five literal characters.
   */
  const decode = (value: string): string =>
    value
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')

  return {
    name: 'social-metadata',
    transformIndexHtml: {
      // After other plugins, so the tags land in the finished head.
      order: 'post',
      handler(html, ctx) {
        const title = read(html, /<title>([\s\S]*?)<\/title>/, '<title>')
        const description = read(
          html,
          /<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/,
          'meta description',
        )

        // The route this entry point becomes once built. `ctx.path` is the
        // entry's own path, so the canonical URL is the file's real address
        // rather than a hand-kept mapping that could fall out of step with
        // `build.rollupOptions.input`. The homepage is the one special case:
        // it is served at `/`, not at `/index.html`, and declaring the latter
        // would point every crawler at a duplicate of the site's front door.
        const file = ctx.path.split('/').pop() || 'index.html'
        const canonical = `${SITE_ORIGIN}/${file === 'index.html' ? '' : file}`

        const tags = [
          `<link rel="canonical" href="${canonical}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="${OG_SITE_NAME}" />`,
          `<meta property="og:title" content="${title}" />`,
          `<meta property="og:description" content="${description}" />`,
          `<meta property="og:url" content="${canonical}" />`,
          `<meta property="og:image" content="${OG_IMAGE}" />`,
          // Declared alongside the image rather than left to the scraper to
          // discover: the dimensions let a preview be laid out before the file
          // arrives, and the alt text is the only description a reader gets.
          `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
          `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
          `<meta property="og:image:alt" content="${OG_IMAGE_ALT}" />`,
          // The card is a real 1200x630 image, so the large variant is the
          // right one; `summary` would crop it into a small square thumbnail.
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:title" content="${title}" />`,
          `<meta name="twitter:description" content="${description}" />`,
          `<meta name="twitter:image" content="${OG_IMAGE}" />`,
        ]

        const jsonLd = structuredData(file, decode(title), decode(description))
        if (jsonLd) {
          // `<` is escaped so the payload can never terminate the script
          // element early, whatever ends up in the data.
          const json = JSON.stringify(jsonLd, null, 2).replace(/</g, '\u003c')
          tags.push(`<script type="application/ld+json">
${json}
    </script>`)
        }
        // Consume the whitespace before </head> so the first injected tag is
        // indented like the rest of the head rather than inheriting it.
        return html.replace(/[ \t]*<\/head>/, `    ${tags.join('\n    ')}\n  </head>`)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), socialMetadata()],
  resolve: {
    alias: {
      /**
       * The 3D experience, kept in its own subtree.
       *
       * The imported scene refers to its own modules as `@/…`, and pointing
       * that at `src/three` rather than `src/` is what keeps the two halves
       * apart: the 3D code has its own `data/projects.ts` and `data/skills.ts`,
       * and both would collide with the portfolio's files of the same name if
       * the subtrees were merged. Nothing outside `src/three` uses this alias.
       */
      '@': fileURLToPath(new URL('./src/three', import.meta.url)),
    },
  },
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
        // The interactive portfolio demos. Real static pages like the case
        // studies, so each has a genuine URL and no SPA rewrite is required.
        demoSalesRecovery: fileURLToPath(new URL('./demo-sales-recovery.html', import.meta.url)),
        demoInboxCrm: fileURLToPath(new URL('./demo-inbox-crm.html', import.meta.url)),
        demoExplainableAts: fileURLToPath(
          new URL('./demo-explainable-ats.html', import.meta.url),
        ),
        // The 3D experience. Its own entry point, which is what keeps three.js
        // out of every other page: Rollup only reaches the scene from here, so
        // nothing else in the site can pull it into a shared chunk.
        experience3d: fileURLToPath(new URL('./3d.html', import.meta.url)),
      },
    },
  },
})
