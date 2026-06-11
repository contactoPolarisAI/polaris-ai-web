const fs = require('fs');
const path = require('path');

const findingsPath = 'C:/Users/steve/Documents/prueba/polaris v2/.gemini/antigravity/brain/47d51569-5192-415e-9ac2-9c722ed6b161/scratch/findings.json';
const data = JSON.parse(fs.readFileSync(findingsPath, 'utf-8'));

const indexData = data.filter(f => f.página === 'index.html');

// Filter out marquee elements (like marquees inside marquee-inner)
// and comparison table elements (like table, tr, td, th, thead, tbody, span.cross, span.check)
// and testimonial carousel elements (like perfil-card, etc.)
// and the 3 inline links
const realIndexIssues = indexData.filter(f => {
  const desc = f.descripción;
  const cat = f.categoría;
  
  if (cat === 'Overflow Element') {
    if (desc.includes('<tr>') || desc.includes('<td>') || desc.includes('<th>') || 
        desc.includes('<thead>') || desc.includes('<tbody>') || desc.includes('<table') ||
        desc.includes('<span.cross') || desc.includes('<span.check') ||
        desc.includes('.perfil-') || desc.includes('<circle') || desc.includes('<path') || 
        desc.includes('<svg') || desc.includes('<rect') || desc.includes('<ellipse') ||
        desc.includes('.marquee-') || desc.includes('.testimonial-') ||
        desc.includes('.logo-mark') || desc.includes('<span.pct') || desc.includes('<h3.perfil') ||
        desc.includes('<p.perfil') || desc.includes('<span.cross') || desc.includes('<div>') ||
        desc.includes('.stat') || desc.includes('.orbit') || desc.includes('.chip') ||
        desc.includes('.logo-carousel') || desc.includes('.logo-track')) {
      return false;
    }
  }
  
  if (cat === 'Touch Target') {
    if (desc.includes('reservarla por WhatsApp') || desc.includes('Política de Cookies') || desc.includes('Política de Privacidad')) {
      return false;
    }
  }
  
  if (cat === 'Overlap UI') {
    // Let's keep these to check them
    return true;
  }
  
  if (cat === 'Heading Wrap') {
    return false; // we know these are just long headings wrapping
  }
  
  return true;
});

console.log(`Remaining index.html issues: ${realIndexIssues.length}`);
realIndexIssues.forEach(f => {
  console.log(`(${f.viewport}): [${f.categoría}] ${f.descripción}`);
});
