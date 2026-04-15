// inject-key.mjs
// Reads WEB3FORMS_KEY from .env and bakes it into dist/ HTML files
// Run: node inject-key.mjs
// Then deploy the dist/ folder to Vercel

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// --- Load .env ---
let key = '';
try {
  const env = readFileSync(resolve(__dir, '.env'), 'utf8');
  const match = env.match(/^WEB3FORMS_KEY=(.+)$/m);
  if (match) key = match[1].trim();
} catch {
  key = process.env.WEB3FORMS_KEY || '';
}

if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
  console.error('❌  No key found. Add your Web3Forms key to .env first.');
  console.error('    WEB3FORMS_KEY=your-actual-key-here');
  process.exit(1);
}

// --- Inject key into all HTML files ---
mkdirSync(resolve(__dir, 'dist'), { recursive: true });

const htmlFiles = readdirSync(__dir).filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
  const src = readFileSync(resolve(__dir, file), 'utf8');
  const out = src.replaceAll('{{WEB3FORMS_KEY}}', key);
  writeFileSync(resolve(__dir, 'dist', file), out, 'utf8');
  console.log(`✅  dist/${file} built with Web3Forms key injected.`);
}

console.log('\n    Deploy the dist/ folder to Vercel.');
