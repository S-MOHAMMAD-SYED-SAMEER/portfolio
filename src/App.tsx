import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
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
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
