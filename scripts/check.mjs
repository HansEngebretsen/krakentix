// Checks data/tickets.json before the site is built from it.
//   npm run check  → prints a per-season summary, exits 1 on any problem
// Catches bad math, impossible seat counts, and anything that looks like a seat
// number, order number or barcode, which should never be published.
import { readFileSync } from 'node:fs';

const FILE = process.argv[2] || 'data/tickets.json';
const data = JSON.parse(readFileSync(FILE, 'utf8'));
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const GAME_KEYS = new Set(['date', 'opponent', 'cost', 'ticketsSold', 'ticketsKept', 'soldFor', 'gainLoss', 'isPackage', 'emailLink']);
const PRIVATE_KEY = /seat(?!s$)|order|confirm|barcode|account|address|phone|card/i;
// "Seat 12", "Seats 11-13", "Seat(s) 11-13", "Order #K123", long barcode-like numbers
const PRIVATE_VALUE = /\bseat(s|\(s\))? *#? *\d|\border *#|\b(confirmation|barcode|acct)\b|\b\d{12,}\b/i;

// Top level
for (const key of ['title', 'subtitle', 'seats', 'seasons']) {
  if (data[key] === undefined) err('top level', `missing "${key}"`);
}
if (!Number.isInteger(data.seats) || data.seats < 1) err('top level', '"seats" must be a whole number, 1 or more');

const seats = data.seats;
const ids = new Set();

for (const season of data.seasons || []) {
  const where = `season ${season.id}`;
  if (!/^\d{2}-\d{2}$|^\d{4}$/.test(season.id || '')) err(where, 'id must look like "25-26" (or "2025" for one-year seasons)');
  if (ids.has(season.id)) err(where, 'duplicate season id');
  ids.add(season.id);
  if (!Array.isArray(season.games) || !season.games.length) { err(where, 'no games'); continue; }

  const dates = new Map();
  season.games.forEach((g, i) => {
    const at = `${where}, ${g.date || `game ${i + 1}`} ${g.opponent || ''}`.trim();
    for (const k of Object.keys(g)) {
      if (!GAME_KEYS.has(k)) err(at, `unknown field "${k}"${PRIVATE_KEY.test(k) ? ' (looks private, remove it)' : ''}`);
    }
    for (const [k, v] of Object.entries(g)) {
      if (typeof v === 'string' && k !== 'emailLink' && PRIVATE_VALUE.test(v)) err(at, `"${k}" looks like it holds a seat, order or barcode number`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(g.date || '')) err(at, 'date must be YYYY-MM-DD');
    if (!g.opponent) err(at, 'missing opponent');
    for (const k of ['cost', 'ticketsSold', 'ticketsKept', 'soldFor', 'gainLoss']) {
      if (typeof g[k] !== 'number' || Number.isNaN(g[k])) err(at, `"${k}" must be a number`);
    }
    const playoff = /playoff/i.test(g.opponent || '');
    const isPackage = g.isPackage ?? !playoff;
    if (isPackage && g.ticketsSold + g.ticketsKept !== seats) err(at, `ticketsSold + ticketsKept should be ${seats}`);
    if (g.ticketsSold === 0 && g.soldFor !== 0) err(at, 'soldFor is set but no tickets were sold');
    if (g.ticketsSold > 0 && g.ticketsKept === 0 && Math.abs(g.soldFor - g.cost - g.gainLoss) > 0.02) {
      err(at, `gainLoss should be soldFor − cost = ${(g.soldFor - g.cost).toFixed(2)}`);
    }
    // Same-day doubleheaders are rare; two rows on one date is usually a duplicate email
    const key = `${g.date}|${isPackage}`;
    if (dates.has(key)) warn(at, `two ${isPackage ? 'plan' : 'extra'} games on the same date, check the schedule`);
    dates.set(key, true);
  });

  // Dates should sit inside the season: Aug of the first year through Jul of the next
  const [a, b] = season.id.includes('-') ? season.id.split('-').map(y => 2000 + Number(y)) : [Number(season.id), Number(season.id)];
  const lo = `${a}-${season.id.includes('-') ? '07' : '01'}-01`, hi = `${b}-${season.id.includes('-') ? '07-31' : '12-31'}`;
  for (const g of season.games) if (g.date < lo || g.date > hi) err(`${where}, ${g.date}`, `date falls outside ${lo} – ${hi}`);
}

// Summary, newest season first like the site
const money = n => `$${Math.round(n).toLocaleString('en-US')}`;
console.log(`\n${data.title || 'tickets'} · ${seats} seat${seats === 1 ? '' : 's'}\n`);
console.log('season  games  attended  resold  paid      back      net       per game');
for (const s of data.seasons || []) {
  const plan = (s.games || []).filter(g => g.isPackage ?? !/playoff/i.test(g.opponent || ''));
  const paid = plan.reduce((t, g) => t + (g.cost || 0), 0);
  const back = plan.reduce((t, g) => t + (g.soldFor || 0), 0);
  const attended = plan.filter(g => g.ticketsKept > 0).length;
  const resold = plan.filter(g => g.ticketsSold > 0 && g.ticketsKept === 0).length;
  const per = attended ? (paid - back) / attended : 0;
  console.log([s.id.padEnd(6), String(plan.length).padStart(5), String(attended).padStart(9), String(resold).padStart(7), '', money(paid).padEnd(9), money(back).padEnd(9), money(paid - back).padEnd(9), money(per)].join(' '));
}

if (warnings.length) {
  console.warn(`\n${warnings.length} warning${warnings.length === 1 ? '' : 's'}:`);
  for (const w of warnings) console.warn(`  • ${w}`);
}
if (errors.length) {
  console.error(`\n${errors.length} problem${errors.length === 1 ? '' : 's'} in ${FILE}:`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}
console.log(`\n${FILE} looks good.\n`);
