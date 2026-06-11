const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'politica-privacidad.html',
  'politica-cookies.html',
  'terminos.html',
  'sector-gestorias.html',
  'sector-clinicas.html',
  'sector-despachos.html',
  'sector-logistica.html',
  'soluciones-facturas.html',
  'soluciones-rag.html',
  'soluciones-whatsapp.html',
  'soluciones-informes.html'
];

const viewports = [360, 390, 414];
const height = 800;

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allFindings = [];

  for (const pageName of pages) {
    const page = await browser.newPage();
    const url = `http://localhost:4173/${pageName}`;

    for (const width of viewports) {
      console.log(`Auditing ${pageName} at ${width}px...`);
      await page.setViewport({ width, height });

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
        // Extra wait to let animations/scripts settle
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pageFindings = await page.evaluate((w) => {
          const findings = [];

          // 1. Overflow Check
          const docScrollWidth = document.documentElement.scrollWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          const innerWidth = window.innerWidth;
          if (docScrollWidth > innerWidth + 1 || bodyScrollWidth > innerWidth + 1) {
            findings.push({
              category: 'Overflow',
              description: `Horizontal overflow detected (documentElement scrollWidth: ${docScrollWidth}px, body scrollWidth: ${bodyScrollWidth}px, innerWidth: ${innerWidth}px)`,
              severity: 'alta'
            });
          }

          // 2. Elements overflowing viewport
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            if (el.children.length > 15) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            if (style.position === 'fixed' || style.position === 'sticky') continue;

            if (rect.right > innerWidth + 1 || rect.left < -1) {
              const elementId = el.id ? `#${el.id}` : '';
              const elementClass = el.className ? `.${Array.from(el.classList).join('.')}` : '';
              findings.push({
                category: 'Overflow Element',
                description: `Element <${el.tagName.toLowerCase()}${elementId}${elementClass}> overflows bounds: rect={left: ${Math.round(rect.left)}, right: ${Math.round(rect.right)}, width: ${Math.round(rect.width)}}, innerWidth=${innerWidth}`,
                severity: 'alta'
              });
            }
          }

          // 3. Small touch targets (< 44x44 px)
          const targets = document.querySelectorAll('a, button, [role="button"]');
          for (const el of targets) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;

            if (rect.width < 44 || rect.height < 44) {
              const isInline = style.display === 'inline';
              const text = el.innerText ? el.innerText.trim().substring(0, 30) : '';
              if (!isInline || rect.height < 20) {
                const elementId = el.id ? `#${el.id}` : '';
                const elementClass = el.className ? `.${Array.from(el.classList).join('.')}` : '';
                findings.push({
                  category: 'Touch Target',
                  description: `Interactive <${el.tagName.toLowerCase()}${elementId}${elementClass}> is too small (${Math.round(rect.width)}x${Math.round(rect.height)}px). Text: "${text}"`,
                  severity: 'media'
                });
              }
            }
          }

          // 4. Input with computed font-size < 16px
          const inputs = document.querySelectorAll('input, select, textarea');
          for (const el of inputs) {
            if (el.type === 'submit' || el.type === 'button' || el.type === 'checkbox' || el.type === 'radio') continue;
            const style = window.getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            if (fontSize < 16) {
              const elementId = el.id ? `#${el.id}` : '';
              findings.push({
                category: 'Form Zoom',
                description: `Form element <${el.tagName.toLowerCase()}${elementId} type="${el.type}"> has font-size < 16px (${style.fontSize}), causing iOS zoom issue`,
                severity: 'media'
              });
            }
          }

          // 5. Image without width/height attributes
          const images = document.querySelectorAll('img');
          for (const img of images) {
            const hasWidth = img.hasAttribute('width');
            const hasHeight = img.hasAttribute('height');
            if (!hasWidth || !hasHeight) {
              const src = img.src ? img.src.split('/').pop() : 'no-src';
              findings.push({
                category: 'Image Dimensions',
                description: `Image "${src}" lacks explicit HTML width or height attributes (width: ${hasWidth}, height: ${hasHeight})`,
                severity: 'baja'
              });
            }
          }

          // 6. Fixed/sticky overlap with text or CTAs
          const fixedEls = [];
          for (const el of document.querySelectorAll('*')) {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'sticky') {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
                fixedEls.push({ el, rect, className: el.className, id: el.id, tagName: el.tagName });
              }
            }
          }

          const targetElements = document.querySelectorAll('a, button, [role="button"], h1, h2, h3, h4, h5, h6, p');
          for (const target of targetElements) {
            const targetStyle = window.getComputedStyle(target);
            if (targetStyle.display === 'none' || targetStyle.visibility === 'hidden') continue;
            const rectT = target.getBoundingClientRect();
            if (rectT.width === 0 || rectT.height === 0) continue;

            for (const fixed of fixedEls) {
              if (fixed.el === target || fixed.el.contains(target) || target.contains(fixed.el)) continue;

              const overlapX = rectT.left < fixed.rect.right - 2 && rectT.right > fixed.rect.left + 2;
              const overlapY = rectT.top < fixed.rect.bottom - 2 && rectT.bottom > fixed.rect.top + 2;
              if (overlapX && overlapY) {
                const text = target.innerText ? target.innerText.trim() : '';
                if (text.length > 2) {
                  const targetId = target.id ? `#${target.id}` : '';
                  const fixedId = fixed.el.id ? `#${fixed.el.id}` : '';
                  findings.push({
                    category: 'Overlap UI',
                    description: `Fixed/sticky <${fixed.tagName.toLowerCase()}${fixedId}> overlaps content <${target.tagName.toLowerCase()}${targetId}> containing text "${text.substring(0, 30)}..."`,
                    severity: 'alta'
                  });
                }
              }
            }
          }

          // 7. Headings with > 3 lines (non-fluid text)
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          for (const el of headings) {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;

            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') continue;

            const fontSize = parseFloat(style.fontSize);
            const lh = style.lineHeight;
            let lineHeightVal;
            if (lh === 'normal') {
              lineHeightVal = fontSize * 1.25;
            } else {
              lineHeightVal = parseFloat(lh);
            }

            const heightVal = el.clientHeight;
            const lines = Math.round(heightVal / lineHeightVal);
            if (lines > 3) {
              const text = el.innerText ? el.innerText.trim().substring(0, 30) : '';
              findings.push({
                category: 'Heading Wrap',
                description: `Heading <${el.tagName.toLowerCase()}> is too long or has rigid font size (${style.fontSize}), wrapping into ${lines} lines. Text: "${text}"`,
                severity: 'baja'
              });
            }
          }

          return findings;
        }, width);

        for (const finding of pageFindings) {
          allFindings.push({
            página: pageName,
            viewport: `${width}px`,
            categoría: finding.category,
            descripción: finding.description,
            severidad: finding.severity
          });
        }
      } catch (err) {
        console.error(`Error auditing ${pageName} at ${width}px:`, err.message);
      }
    }
    await page.close();
  }

  await browser.close();

  const outputPath = path.join(__dirname, 'findings.json');
  fs.writeFileSync(outputPath, JSON.stringify(allFindings, null, 2), 'utf-8');
  console.log(`Successfully completed audit. Saved ${allFindings.length} findings to ${outputPath}`);
}

run().catch(console.error);
