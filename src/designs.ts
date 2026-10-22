// Design explorer: visual-only skins layered over the app via designs.css.
// Each design is pure CSS keyed off <html data-design="…" data-family="…">;
// nothing here touches app state, data or interactions.
//
// ←/→ flips designs. The HUD shows on localhost or with ?designs in the URL;
// ?design=<slug> picks one anywhere (and is remembered in localStorage).

export type Design = {
  slug: string;
  name: string;
  note: string;
  family?: 'editorial';
};

export const DESIGNS: Design[] = [
  { slug: 'original', name: 'Original', note: 'The app as it was, anchor and all' },
  { slug: 'o-glow', name: 'Original · Glow', note: 'Same palette, with the soft glow behind the attended dots' },
  { slug: 'o-sharp', name: 'Original · Sharp', note: 'Same containers, tighter 4px corners' },
  { slug: 'o-ink', name: 'Original · Ink', note: 'Kraken navy ink and ice, same containers' },
  { slug: 'o-airy', name: 'Original · Airy', note: 'Bigger type, more room, rounder cards' },
  { slug: 'o-night', name: 'Original · Night', note: 'Original light; deep Kraken navy in dark mode, with the glow' },
  { slug: 'm-plex', name: 'Mono · Plex', note: 'IBM Plex Mono throughout, 4px corners' },
  { slug: 'm-jet', name: 'Mono · Jet', note: 'JetBrains Mono throughout, rounder 12px cards' },
  { slug: 'm-space', name: 'Mono · Space', note: 'Space Mono labels, Inter numerals, pill chips' },
  { slug: 'm-bw', name: 'Black & White', note: 'Pure grayscale, hard edges, solid black badges' },
  { slug: 'mono-ledger', name: 'Mono Ledger', note: 'Say-style hairlines, Inter, quiet monochrome', family: 'editorial' },
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

function apply(design: Design) {
  const root = document.documentElement;
  root.dataset.design = design.slug;
  if (design.family) root.dataset.family = design.family;
  else delete root.dataset.family;
}

export function initDesignSwitcher() {
  const params = new URLSearchParams(location.search);
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.hostname.endsWith('.local');
  const showHud = local || params.has('designs');

  let index = indexOfSlug(params.get('design') || store.get());
  apply(DESIGNS[index]);
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
    const d = DESIGNS[index];
    count.textContent = `${String(index).padStart(2, '0')} / ${String(DESIGNS.length - 1).padStart(2, '0')}`;
    name.textContent = d.name;
    note.textContent = d.note;
    hud.classList.add('is-active');
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => hud.classList.remove('is-active'), 2200);
  };

  const go = (step: number) => {
    index = (index + step + DESIGNS.length) % DESIGNS.length;
    const d = DESIGNS[index];
    apply(d);
    store.set(d.slug);
    const url = new URL(location.href);
    url.searchParams.set('design', d.slug);
    history.replaceState(null, '', url);
    render();
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
