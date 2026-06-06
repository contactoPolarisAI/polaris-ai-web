// Importar submódulos de JavaScript
import { ThemeManager } from './theme.js';
import { AnimationManager } from './animations.js';
import { RoiCalculator } from './calculator.js';
import { SliderManager } from './slider.js';
import { CookieManager } from './cookies.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar gestores
  ThemeManager.init();
  AnimationManager.init();
  RoiCalculator.init();
  SliderManager.init();
  CookieManager.init();

  // Lazy load Chart.js only on pages that have charts
  if (document.querySelector('canvas[id^="chart-"]')) {
    import('./charts.js').then(({ ChartManager }) => {
      ChartManager.init();
    });
  }

  // Defer Vercel Analytics and Speed Insights to avoid blocking the main thread
  setTimeout(() => {
    import('@vercel/analytics').then(({ inject }) => inject());
    import('@vercel/speed-insights').then(({ injectSpeedInsights }) => injectSpeedInsights());
  }, 1000);

  // navbar scroll behavior using IntersectionObserver
  const nav = document.getElementById('nav');
  const sentinel = document.getElementById('scroll-sentinel');
  if (nav && sentinel && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', !entry.isIntersecting);
      });
    });
    observer.observe(sentinel);
  } else if (nav) {
    // Fallback for older browsers
    const onScroll = () => {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 6);
      });
    };
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
