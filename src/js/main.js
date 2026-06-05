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
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('f-name').value;
      const empresa = document.getElementById('f-empresa').value;
      const email = document.getElementById('f-email').value;
      const sector = document.getElementById('f-sector').value;
      const empleados = document.getElementById('f-empleados').value;

      const messageText = `Hola Polaris AI, me gustaría solicitar una demo privada. 

Mis datos:
- Nombre: ${name}
- Empresa: ${empresa}
- Email: ${email}
- Sector: ${sector}
- Empleados: ${empleados}`;

      // Redirigir a WhatsApp de forma automática
      window.open(`https://wa.me/34602025877?text=${encodeURIComponent(messageText)}`, '_blank');
    });
  }
});
