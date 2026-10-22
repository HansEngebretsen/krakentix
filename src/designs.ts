// Designs: visual-only skins layered over the app via designs.css.
// Each design is pure CSS keyed off <html data-design="…">; nothing here
// touches app data or interactions.
//
// The header theme button cycles designs through setDesign().
// ?design=<slug> picks one from the URL. The choice is remembered in localStorage.

export type Design = {
  slug: string;
  name: string;
  note: string;
};

// First entry is the default.
export const DESIGNS: Design[] = [
  { slug: 'bw-sharp', name: 'B&W · Sharp', note: 'Ice-cast black and white, hard edges, soft green and red' },
  { slug: 'original', name: 'Original', note: 'The app as it was: slate and blueberry' },
  { slug: 'o-ink', name: 'Original · Ink', note: 'Original containers in Kraken navy ink and ice' },
];

const STORAGE_KEY = 'kt-design';

const store = {
  get(): string | null {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  },
  set(v: string) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch { /* private mode */ }
  },
};

function indexOfSlug(slug: string | null | undefined) {
  const i = DESIGNS.findIndex(d => d.slug === slug);
  return i === -1 ? 0 : i;
}

let current = 0;

function apply(design: Design) {
  document.documentElement.dataset.design = design.slug;
  window.dispatchEvent(new CustomEvent('kt-design', { detail: design.slug }));
}

export function getDesign() {
  return DESIGNS[current].slug;
}

export function setDesign(slug: string) {
  current = indexOfSlug(slug);
  const d = DESIGNS[current];
  apply(d);
  store.set(d.slug);
  // keep a ?design= link in step, so a reload lands on the same design
  const url = new URL(location.href);
  if (url.searchParams.has('design')) {
    url.searchParams.set('design', d.slug);
    history.replaceState(null, '', url);
  }
}

// The switcher HUD and arrow keys are gone; the header theme button is the only control.
export function initDesignSwitcher() {
  const params = new URLSearchParams(location.search);
  current = indexOfSlug(params.get('design') || store.get());
  apply(DESIGNS[current]);
}
