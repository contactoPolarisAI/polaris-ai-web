const fs = require('fs');
const path = require('path');

const findingsPath = 'C:/Users/steve/Documents/prueba/polaris v2/.gemini/antigravity/brain/47d51569-5192-415e-9ac2-9c722ed6b161/scratch/findings.json';
const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));

console.log('--- Touch Target Findings ---');
data.filter(f => f.categoría === 'Touch Target').forEach(f => {
  console.log(`${f.página} (${f.viewport}): ${f.descripción}`);
});

console.log('\n--- Overlap UI Findings ---');
data.filter(f => f.categoría === 'Overlap UI').forEach(f => {
  console.log(`${f.página} (${f.viewport}): ${f.descripción}`);
});

console.log('\n--- Heading Wrap Findings ---');
data.filter(f => f.categoría === 'Heading Wrap').forEach(f => {
  console.log(`${f.página} (${f.viewport}): ${f.descripción}`);
});

console.log('\n--- Other Non-Table/Marquee Overflow Findings ---');
data.filter(f => f.categoría === 'Overflow' || (f.categoría === 'Overflow Element' && !f.descripción.includes('<tr>') && !f.descripción.includes('<td>') && !f.descripción.includes('<th>') && !f.descripción.includes('<thead>') && !f.descripción.includes('<tbody>') && !f.descripción.includes('<table') && !f.descripción.includes('<span.cross') && !f.descripción.includes('<span.check'))).forEach(f => {
  console.log(`${f.página} (${f.viewport}): ${f.descripción}`);
});
