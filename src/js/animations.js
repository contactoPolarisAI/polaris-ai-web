export const AnimationManager = {
  init() {
    this.initIntro();
    this.initRevealOnScroll();
    this.initCounters();
  },

  /* === Intro overlay === */
  initIntro() {
    const overlay = document.getElementById('intro');
    const enter   = document.getElementById('intro-enter');
    const skip    = document.getElementById('intro-skip');
    if (!overlay) return;

    document.documentElement.classList.add('intro-locked');

    const dismiss = () => {
      overlay.classList.add('fade-out');
      setTimeout(() => document.documentElement.classList.remove('intro-locked'), 150);
      setTimeout(() => overlay.classList.add('hidden'), 900);
    };

    enter && enter.addEventListener('click', dismiss);
    skip  && skip.addEventListener('click', dismiss);

    const onKey = (e) => {
      if (overlay.classList.contains('hidden')) return;
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
  },

  /* === Reveal on scroll === */
  initRevealOnScroll() {
    const revealEls = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      // Si se prefiere movimiento reducido o no hay soporte, todo se muestra inmediatamente
      revealEls.forEach(el => el.classList.add('in'));
      return;
    }

    const enableRevealAnimation = () => {
      document.documentElement.classList.add('js-reveal');

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));

      // Respaldo en scroll directo
      const h = () => window.innerHeight || document.documentElement.clientHeight;
      let scheduled = false;
      const tick = () => {
        scheduled = false;
        const vh = h();
        revealEls.forEach(el => {
          if (el.classList.contains('in')) return;
          const r = el.getBoundingClientRect();
          if (r.top < vh - 20 && r.bottom > 0) el.classList.add('in');
        });
      };
      const onScrollReveal = () => {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(tick);
        }
      };
      window.addEventListener('scroll', onScrollReveal, { passive: true });
      window.addEventListener('resize', onScrollReveal);
      tick();
    };

    // Sensor de prueba para verificar si el IntersectionObserver se dispara correctamente en este entorno
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0;';
    document.body.appendChild(sentinel);
    let ioWorks = false;
    const probe = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        ioWorks = true;
        probe.disconnect();
        sentinel.remove();
        enableRevealAnimation();
      }
    });
    probe.observe(sentinel);
    setTimeout(() => {
      if (!ioWorks) {
        probe.disconnect();
        sentinel.remove();
        // Fallback: mostrar todo de inmediato si falla el probe
        revealEls.forEach(el => el.classList.add('in'));
      }
    }, 150);
  },

  /* === Animated counters === */
  initCounters() {
    const counters = document.querySelectorAll('.stat .num');
    const animateCounter = (el) => {
      if (el.dataset.animated === 'done') return;
      el.dataset.animated = 'done';
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const dur = 1200;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.innerHTML = val + '<span class="suffix">' + suffix + '</span>';
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const counterIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          animateCounter(e.target);
          counterIO.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(el => counterIO.observe(el));
    }
    
    // Respaldo de seguridad
    setTimeout(() => counters.forEach(animateCounter), 1500);
  }
};
