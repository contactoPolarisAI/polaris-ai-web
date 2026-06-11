const fs = require('fs');
const path = require('path');

const summary = JSON.parse(fs.readFileSync(path.join(__dirname, 'summary.json'), 'utf-8'));

let markdown = '| Página | Viewport(s) | Categoría | Descripción | Severidad |\n';
markdown += '| --- | --- | --- | --- | --- |\n';

for (const item of summary) {
  // Translate category to a human-readable term if needed or keep it clean
  let cat = item.categoría;
  
  // Format severity with uppercase/lowercase
  let sev = item.severidad;
  if (sev === 'alta') sev = '**Alta**';
  else if (sev === 'media') sev = 'Media';
  else if (sev === 'baja') sev = 'Baja';

  // Escape any pipe symbols in description
  const desc = item.descripción.replace(/\|/g, '\\|');
  
  markdown += `| ${item.página} | ${item.viewports} | ${cat} | ${desc} | ${sev} |\n`;
}

fs.writeFileSync(path.join(__dirname, 'table.md'), markdown, 'utf-8');
console.log('Successfully formatted findings into table.md');
