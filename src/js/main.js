// Importar hojas de estilo para que Vite las procese y empaquete
import '../styles/variables.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/layouts.css';

// Importar submódulos de JavaScript
import { ThemeManager } from './theme.js';
import { AnimationManager } from './animations.js';
import { RoiCalculator } from './calculator.js';
import { ChartManager } from './charts.js';
import { SliderManager } from './slider.js';
import { CookieManager } from './cookies.js';

import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject } from '@vercel/analytics';

inject();

injectSpeedInsights();

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gestores
  ThemeManager.init();
  AnimationManager.init();
  RoiCalculator.init();
  ChartManager.init();
  SliderManager.init();
  CookieManager.init();

  // navbar scroll behavior
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('open');
    });
  });

  // Formularios y leads
  const demoForm = document.querySelector('form.demo-card');
  if (demoForm) {
    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('f-name').value.trim();
      const empresa = document.getElementById('f-empresa').value.trim();
      const email = document.getElementById('f-email').value.trim();
      const sector = document.getElementById('f-sector').value;
      const empleados = document.getElementById('f-empleados').value;
      const consentChecked = document.getElementById('f-consent').checked;
      
      const statusEl = document.getElementById('demo-form-status');
      const submitBtn = document.getElementById('btn-submit-demo');
      
      if (!consentChecked) {
        if (statusEl) {
          statusEl.style.color = '#E53E3E';
          statusEl.textContent = 'Debe aceptar la Política de Privacidad para continuar.';
          statusEl.style.display = 'block';
        }
        return;
      }
      
      // Cambiar estado del botón a cargando
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      if (statusEl) statusEl.style.display = 'none';
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, empresa, email, sector, empleados, consent: consentChecked })
        });
        
        const data = await response.json();
        
        if (response.ok && data.ok) {
          if (statusEl) {
            statusEl.style.color = '#38A169';
            statusEl.textContent = '¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.';
            statusEl.style.display = 'block';
          }
          demoForm.reset();
        } else {
          throw new Error(data.error || 'Error en el servidor');
        }
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        if (statusEl) {
          statusEl.style.color = '#E53E3E';
          statusEl.textContent = 'No se pudo enviar el mensaje. Por favor, inténtelo de nuevo o use WhatsApp.';
          statusEl.style.display = 'block';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }
});
