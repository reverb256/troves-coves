/**
 * Postbuild script to ensure CNAME and index.html are present in the GitHub Pages output directory.
 * This fixes 404 errors on custom domains.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'public');
const FILES_TO_COPY = ['CNAME', 'index.html'];

FILES_TO_COPY.forEach(file => {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(OUTPUT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to ${OUTPUT_DIR}`);
  } else {
    console.warn(`Warning: ${file} not found at project root.`);
  }
});
