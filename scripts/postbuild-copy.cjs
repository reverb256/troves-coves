/**
 * Postbuild script to ensure CNAME and index.html are present in the GitHub Pages output directory.
 * This fixes 404 errors on custom domains.
 */

const fs = require('fs');
const path = require('path');

// DO NOT copy or overwrite index.html in the build output anymore.
// Only check if the build output exists and log a warning if not.

const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'public');

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
