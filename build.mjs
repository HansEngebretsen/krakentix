// Bundles src/main.tsx into a single app.js next to index.html.
//   node build.mjs          → writes a static site to dist/
//   node build.mjs --serve  → serves the repo root on $PORT (default 3000), rebuilding app.js in memory
import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const serve = process.argv.includes('--serve');
const STATIC_FILES = ['index.html', 'designs.css', 'favicon.svg', 'og.png', 'assets'];

const options = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'esm',
  target: ['es2020'],
  jsx: 'transform',
  minify: !serve,
  sourcemap: serve,
  define: { 'process.env.NODE_ENV': JSON.stringify(serve ? 'development' : 'production') },
  logLevel: 'info',
};

if (serve) {
  const ctx = await esbuild.context({ ...options, outfile: 'app.js' });
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: '.', port: Number(process.env.PORT) || 3000 });
  console.log(`\n  krakentix → http://localhost:${port}  (←/→ to flip designs)\n`);
} else {
  rmSync('dist', { recursive: true, force: true });
  mkdirSync('dist');
  await esbuild.build({ ...options, outfile: 'dist/app.js' });
  for (const f of STATIC_FILES) cpSync(f, `dist/${f}`, { recursive: true });

  // Cache-bust: the CDN caches for hours, so point index.html at content-hashed URLs
  const hash = (f) => createHash('sha1').update(readFileSync(`dist/${f}`)).digest('hex').slice(0, 10);
  const html = readFileSync('dist/index.html', 'utf8')
    .replace('./app.js"', `./app.js?v=${hash('app.js')}"`)
    .replace('./designs.css"', `./designs.css?v=${hash('designs.css')}"`);
  writeFileSync('dist/index.html', html);
}
