const fs = require('fs');
const path = require('path');

const findingsPath = path.join(__dirname, 'findings.json');
if (!fs.existsSync(findingsPath)) {
  console.log('findings.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));
console.log(`Total findings: ${data.length}`);

const pageCounts = {};
const categoryCounts = {};
const specificExamples = {};

for (const item of data) {
  pageCounts[item.página] = (pageCounts[item.página] || 0) + 1;
  categoryCounts[item.categoría] = (categoryCounts[item.categoría] || 0) + 1;
  
  const key = `${item.categoría} -> ${item.descripción.substring(0, 80)}`;
  specificExamples[key] = (specificExamples[key] || 0) + 1;
}

console.log('\n--- Findings by Page ---');
for (const [page, count] of Object.entries(pageCounts)) {
  console.log(`${page}: ${count}`);
}

console.log('\n--- Findings by Category ---');
for (const [cat, count] of Object.entries(categoryCounts)) {
  console.log(`${cat}: ${count}`);
}

console.log('\n--- Top 20 specific findings ---');
const sortedExamples = Object.entries(specificExamples).sort((a, b) => b[1] - a[1]);
for (const [example, count] of sortedExamples.slice(0, 20)) {
  console.log(`[${count} times] ${example}`);
}
