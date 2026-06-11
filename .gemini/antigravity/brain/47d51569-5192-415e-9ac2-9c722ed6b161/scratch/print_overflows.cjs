const fs = require('fs');
const path = require('path');

const findingsPath = path.join(__dirname, 'findings.json');
if (!fs.existsSync(findingsPath)) {
  console.log('findings.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));
const list = data.filter(item => item.página === 'index.html' && item.categoría === 'Overflow Element' && !item.descripción.includes('nav-menu-mobile'));

console.log(`Overflow elements on index.html: ${list.length}`);
for (const item of list.slice(0, 30)) {
  console.log(`[${item.viewport}] ${item.descripción}`);
}
