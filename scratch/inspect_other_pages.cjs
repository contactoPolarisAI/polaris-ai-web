const fs = require('fs');
const path = require('path');

const findingsPath = 'C:/Users/steve/Documents/prueba/polaris v2/.gemini/antigravity/brain/47d51569-5192-415e-9ac2-9c722ed6b161/scratch/findings.json';
const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));

const nonIndexData = data.filter(f => f.página !== 'index.html');
console.log(`Total non-index findings: ${nonIndexData.length}`);

const pageCounts = {};
nonIndexData.forEach(f => {
  pageCounts[f.página] = (pageCounts[f.página] || 0) + 1;
});
console.log('\n--- Non-Index Findings by Page ---');
for (const [page, count] of Object.entries(pageCounts)) {
  console.log(`${page}: ${count}`);
}

console.log('\n--- Detailed Non-Index Findings ---');
nonIndexData.forEach(f => {
  console.log(`${f.página} (${f.viewport}): [${f.categoría}] ${f.descripción}`);
});
