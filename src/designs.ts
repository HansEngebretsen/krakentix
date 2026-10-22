// Designs: visual-only skins layered over the app via designs.css.
// Each design is pure CSS keyed off <html data-design="…">; nothing here
// touches app data or interactions.
//
// The theme button in the header cycles designs through setDesign(). Locally
// (or with ?designs in the URL) a HUD also flips them with ←/→;
// ?design=<slug> picks one anywhere. The choice is remembered in localStorage.

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
let onChange: (() => void) | null = null;

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
  onChange?.();
}

export function initDesignSwitcher() {
  const params = new URLSearchParams(location.search);
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.hostname.endsWith('.local');
  const showHud = local || params.has('designs');

  current = indexOfSlug(params.get('design') || store.get());
  apply(DESIGNS[current]);
  if (!showHud) return;

  const hud = document.createElement('div');
  hud.className = 'kt-hud';
  hud.innerHTML = `
    <button class="kt-hud-btn" data-step="-1" aria-label="Previous design">‹</button>
    <div class="kt-hud-body">
      <div class="kt-hud-top"><span class="kt-hud-count"></span><span class="kt-hud-name"></span></div>
      <div class="kt-hud-note"></div>
    </div>
    <button class="kt-hud-btn" data-step="1" aria-label="Next design">›</button>`;
  document.body.appendChild(hud);

  const count = hud.querySelector('.kt-hud-count') as HTMLElement;
  const name = hud.querySelector('.kt-hud-name') as HTMLElement;
  const note = hud.querySelector('.kt-hud-note') as HTMLElement;
  let idleTimer = 0;

  const render = () => {
    const d = DESIGNS[current];
    count.textContent = `${current + 1} / ${DESIGNS.length}`;
    name.textContent = d.name;
    note.textContent = d.note;
    hud.classList.add('is-active');
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => hud.classList.remove('is-active'), 2200);
  };
  onChange = render;

  const go = (step: number) => {
    const next = DESIGNS[(current + step + DESIGNS.length) % DESIGNS.length];
    const url = new URL(location.href);
    url.searchParams.set('design', next.slug);
    history.replaceState(null, '', url);
    setDesign(next.slug);
  };

  hud.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('[data-step]') as HTMLElement | null;
    if (btn) go(Number(btn.dataset.step));
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    const t = e.target as HTMLElement;
    const typing = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.isContentEditable;
    // Arrows belong to the caret while there is text to move through.
    if (typing && (t as HTMLInputElement).value) return;
    if (typing) t.blur();
    e.preventDefault();
    go(e.key === 'ArrowRight' ? 1 : -1);
  });

  render();
}
