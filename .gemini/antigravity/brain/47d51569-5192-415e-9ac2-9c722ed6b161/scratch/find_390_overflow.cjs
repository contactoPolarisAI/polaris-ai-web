const fs = require('fs');
const path = require('path');

const findingsPath = path.join(__dirname, 'findings.json');
if (!fs.existsSync(findingsPath)) {
  console.log('findings.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));
const list = data.filter(item => {
  if (item.página !== 'index.html' || item.viewport !== '360px') return false;
  const match = item.descripción.match(/right: (\d+)/);
  if (!match) return false;
  const right = parseInt(match[1], 10);
  return right >= 380 && right <= 400;
});

console.log(`Matching elements: ${list.length}`);
for (const item of list) {
  console.log(item.descripción);
}
