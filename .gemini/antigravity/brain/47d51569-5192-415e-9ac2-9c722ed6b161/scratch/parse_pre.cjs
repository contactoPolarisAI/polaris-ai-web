const fs = require('fs');
const path = require('path');

const reportPath = path.join(process.cwd(), 'report-pre.json');
if (!fs.existsSync(reportPath)) {
  console.log('report-pre.json not found at', reportPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
console.log('Data structure keys:', Object.keys(data));
if (Array.isArray(data)) {
  console.log(`Total findings: ${data.length}`);
  if (data.length > 0) {
    console.log('First finding example:', JSON.stringify(data[0], null, 2));
  }
} else if (data.findings && Array.isArray(data.findings)) {
  console.log(`Total findings in .findings: ${data.findings.length}`);
  if (data.findings.length > 0) {
    console.log('First finding example:', JSON.stringify(data.findings[0], null, 2));
  }
} else {
  console.log('Data format not recognized. Content keys:', Object.keys(data));
}
