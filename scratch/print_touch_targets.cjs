const fs = require('fs');
const path = require('path');

const findingsPath = 'C:\\Users\\steve\\Documents\\prueba\\polaris v2\\.gemini\\antigravity\\brain\\47d51569-5192-415e-9ac2-9c722ed6b161\\scratch\\findings.json';
if (!fs.existsSync(findingsPath)) {
  console.log('findings.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));
const list = data.filter(item => item.categoría === 'Touch Target');

console.log(`Touch targets too small: ${list.length}`);
const uniqueDescriptions = new Set();
for (const item of list) {
  uniqueDescriptions.add(`[${item.página}] ${item.descripción}`);
}
for (const desc of uniqueDescriptions) {
  console.log(desc);
}
