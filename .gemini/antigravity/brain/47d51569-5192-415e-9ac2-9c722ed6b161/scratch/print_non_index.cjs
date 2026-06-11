const fs = require('fs');
const path = require('path');

const findingsPath = path.join(__dirname, 'findings.json');
if (!fs.existsSync(findingsPath)) {
  console.log('findings.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));
const nonIndex = data.filter(item => item.página !== 'index.html');

console.log(`Findings on other pages: ${nonIndex.length}`);
for (const item of nonIndex) {
  console.log(`[${item.página} - ${item.viewport}] [${item.categoría}] ${item.descripción}`);
}
