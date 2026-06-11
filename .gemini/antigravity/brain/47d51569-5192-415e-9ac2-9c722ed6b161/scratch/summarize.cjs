const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'findings.json'), 'utf-8'));

// We want to group by page, category, and a simplified description to avoid viewport duplication
const consolidated = {};

for (const item of raw) {
  // Simplify description by removing specific numbers that vary by viewport
  let desc = item.descripción
    .replace(/rect=\{[^}]+\}/g, 'rect={...}')
    .replace(/innerWidth=\d+/g, 'innerWidth=...')
    .replace(/width: \d+/g, 'width: ...')
    .replace(/height: \d+/g, 'height: ...')
    .replace(/\(\d+x\d+px\)/g, '(Size px)')
    .replace(/\d+px/g, '...px')
    .replace(/\d+\.\d+px/g, '...px')
    .replace(/scrollWidth: \d+px/g, 'scrollWidth: ...px')
    .replace(/innerWidth: \d+px/g, 'innerWidth: ...px');

  const key = `${item.página}|${item.categoría}|${desc}`;

  if (!consolidated[key]) {
    consolidated[key] = {
      página: item.página,
      viewports: new Set(),
      categoría: item.categoría,
      descripción: item.descripción, // keep one example
      severidad: item.severidad
    };
  }
  consolidated[key].viewports.add(item.viewport);
}

// Convert Set to string and format list
const list = Object.values(consolidated).map(item => ({
  página: item.página,
  viewports: Array.from(item.viewports).join(', '),
  categoría: item.categoría,
  descripción: item.descripción,
  severidad: item.severidad
}));

console.log(JSON.stringify(list, null, 2));
fs.writeFileSync(path.join(__dirname, 'summary.json'), JSON.stringify(list, null, 2), 'utf-8');
console.log(`Saved consolidated summary of ${list.length} unique issues.`);
