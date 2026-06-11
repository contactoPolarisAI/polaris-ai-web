const fs = require('fs');
const path = require('path');

const findingsPath = 'C:/Users/steve/Documents/prueba/polaris v2/.gemini/antigravity/brain/47d51569-5192-415e-9ac2-9c722ed6b161/scratch/findings.json';
const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));

const touchTargets = data.filter(f => f.categoría === 'Touch Target');
console.log(`Total Touch Target findings: ${touchTargets.length}`);

const uniqueTargets = new Set();
touchTargets.forEach(f => {
  uniqueTargets.add(`${f.página}: ${f.descripción}`);
});

console.log('\n--- Unique Touch Targets ---');
uniqueTargets.forEach(t => console.log(t));

const overlaps = data.filter(f => f.categoría === 'Overlap UI');
console.log(`\nTotal Overlap UI findings: ${overlaps.length}`);
const uniqueOverlaps = new Set();
overlaps.forEach(f => {
  uniqueOverlaps.add(`${f.página}: ${f.descripción}`);
});
console.log('\n--- Unique Overlaps ---');
uniqueOverlaps.forEach(o => console.log(o));
