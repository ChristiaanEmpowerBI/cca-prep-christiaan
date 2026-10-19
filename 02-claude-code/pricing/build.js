'use strict';

// Inlines pricing.css and pricing.js into one fragment you can paste into an Elementor HTML widget.
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(path.join(__dirname, file), 'utf8').trim();

const snippet = [
  '<style>', read('pricing.css'), '</style>',
  read('pricing.html'),
  '<script>', read('pricing.js'), '</script>',
  '',
].join('\n');

const outDir = path.join(__dirname, 'dist');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'pricing-snippet.html'), snippet);
console.log('Wrote pricing/dist/pricing-snippet.html (' + snippet.length + ' bytes)');
