// Generates the favicon set and the social share image from SVG, in the site's theme.
// Run once after a palette or name change:  node scripts/make-brand-assets.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const NAVY = '#010126';
const SURFACE = '#0c0b50';
const GOLD = '#f2c230';
const WHITE = '#ffffff';
const MUTED = '#b3b9f2';
const FONT = "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif";

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="20" fill="${NAVY}"/>
  <rect x="3" y="3" width="90" height="90" rx="17" fill="none" stroke="${GOLD}" stroke-width="3"/>
  <text x="48" y="68" text-anchor="middle" font-family="${FONT}" font-size="58" font-weight="700" fill="${GOLD}">J</text>
</svg>`;
writeFileSync('public/favicon.svg', favicon);
for (const [size, name] of [[48, 'favicon-48.png'], [96, 'favicon-96.png'], [192, 'favicon-192.png'], [180, 'apple-touch-icon.png']]) {
  await sharp(Buffer.from(favicon), { density: 300 }).resize(size, size).png().toFile(`public/${name}`);
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="100%" cy="0%" r="70%"><stop offset="0" stop-color="${GOLD}" stop-opacity="0.16"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="0%" cy="100%" r="80%"><stop offset="0" stop-color="#7d82ff" stop-opacity="0.30"/><stop offset="1" stop-color="#7d82ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="${SURFACE}" fill-opacity="0.55" stroke="#3836a0" stroke-width="2"/>
  <rect x="96" y="100" width="76" height="60" rx="14" fill="${NAVY}" stroke="${GOLD}" stroke-width="2.5"/>
  <text x="134" y="141" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="700" letter-spacing="2" fill="${GOLD}">JSP</text>
  <text x="96" y="318" font-family="${FONT}" font-size="92" font-weight="700" letter-spacing="-3" fill="${GOLD}">Janmejay S Purohit</text>
  <text x="96" y="388" font-family="${FONT}" font-size="40" font-weight="500" fill="${WHITE}">Full Stack Software Engineer</text>
  <text x="96" y="444" font-family="${FONT}" font-size="28" fill="${MUTED}">Lead Developer at T-Mobile · Angular · Svelte · Astro · Node.js</text>
  <text x="96" y="530" font-family="${FONT}" font-size="28" font-weight="600" fill="${WHITE}">janmejay.info</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('written: favicon.svg, favicon-48/96/192.png, apple-touch-icon.png, og.png');
