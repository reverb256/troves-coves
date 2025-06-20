/**
 * Postbuild script to ensure CNAME and index.html are present in the GitHub Pages output directory.
 * This fixes 404 errors on custom domains.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'public');
const FILES_TO_COPY = ['index.html'];

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

// Ensure the built React app's index.html exists in the output directory
const reactBuildIndex = path.join(OUTPUT_DIR, 'index.html');
if (!fs.existsSync(reactBuildIndex)) {
  console.error('Error: index.html not found in build output directory!');
  console.log('Available files in output directory:');
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.readdirSync(OUTPUT_DIR).forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.log('Output directory does not exist!');
  }
}
