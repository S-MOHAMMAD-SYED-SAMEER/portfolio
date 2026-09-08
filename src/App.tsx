import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/**
 * Honours the URL's own hash once the page has actually rendered.
 *
 * The homepage is client-rendered: the served HTML is an empty root element. So
 * when a browser opens `/#projects` — which is what pressing Back from a case
 * study now does — it looks for that element while parsing, finds nothing, and
 * gives up. React renders a moment later and the browser does not try again.
 *
 * This runs once, after the first commit, and only when the URL actually names
 * a section. It is not a stored scroll position and not a timer: it asks the
 * browser to bring the element the URL already points at into view, which is
 * the behaviour a static page would have had for free.
 *
 * Arriving at `/` is untouched and starts at the top. In-page anchor clicks are
 * untouched too — they are handled natively, and this never runs again after
 * mount. A page restored from the back-forward cache does not remount at all,
 * so on browsers that use it the scroll position is simply preserved and this
 * does nothing.
 */
function useHashTargetOnLoad() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // `scrollIntoView` rather than a saved offset: the browser works out where
    // the section is, so this stays correct whatever the layout above it does.
    document.getElementById(id)?.scrollIntoView();
  }, []);
}

function App() {
  useHashTargetOnLoad();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Nav />
      {/* The skip link in Nav targets this. `tabIndex={-1}` is what makes the
          jump actually move focus rather than only scrolling: a <main> is not
          focusable by default, so browsers leave focus on the link and the next
          Tab returns the visitor to the nav they just skipped. -1 keeps it out
          of the tab order while allowing it to be focused programmatically.

          The global rule in index.css is `:focus-visible`, not `:focus`, so
          landing here draws no outline around the whole page. */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
