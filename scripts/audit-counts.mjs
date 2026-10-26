#!/usr/bin/env node
// Local audit tool, not shipped to visitors. Re-checks page counts from the project repositories.
// Usage: node scripts/audit-counts.mjs /path/to/folder-with-all-repos
// A "page" is a real HTML page a visitor can reach: excludes 404.html, partials, includes and admin tools.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = process.argv[2];
if (!root || !existsSync(root)) { console.error('Usage: node scripts/audit-counts.mjs <folder containing the repositories>'); process.exit(1); }

const PROJECTS = [
  { name: 'First Experts Logistics', match: /first.?experts/i, published: 23 },
  { name: 'ShelemJ Resources', match: /shelemj/i, published: 20 },
  { name: 'Amani Community Trust', match: /amani/i, published: 22 },
  { name: 'Fernhollow', match: /fernhollow/i, published: null },
  { name: 'Stride', match: /stride/i, published: null },
  { name: 'Pulse Analytics Dashboard', match: /pulse/i, published: null },
  { name: 'Individual support practice site', match: /teaching|support|practice/i, published: 'more than 30' },
];
const SKIP_DIR = /^(node_modules|\.git|dist|build|\.github|_[^/]*|partials?|includes?|admin|decap|cms)$/i;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e), st = statSync(p);
    if (st.isDirectory()) { if (!SKIP_DIR.test(e)) walk(p, out); }
    else if (/\.html?$/i.test(e)) out.push(p);
  }
  return out;
}

const repos = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory());
console.log('Project'.padEnd(36), 'HTML'.padEnd(6), 'excl 404'.padEnd(9), 'sitemap'.padEnd(8), 'site says');
for (const pr of PROJECTS) {
  const dir = repos.find((d) => pr.match.test(d));
  if (!dir) { console.log(pr.name.padEnd(36), 'repository folder not found'); continue; }
  const files = walk(join(root, dir));
  const html = files.length, real = files.filter((f) => basename(f).toLowerCase() !== '404.html').length;
  let sm = 'none'; const smp = join(root, dir, 'sitemap.xml');
  if (existsSync(smp)) sm = (readFileSync(smp, 'utf8').match(/<loc>/g) || []).length;
  console.log(pr.name.padEnd(36), String(html).padEnd(6), String(real).padEnd(9), String(sm).padEnd(8), pr.published ?? 'not published (confirm first)');
}
console.log('\nCompare "excl 404" with the number on the portfolio. Where a README disagrees, trust this output.');
