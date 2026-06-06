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

    if (reduceMotion) {
      revealEls.forEach(el => el.classList.add('in'));
      return;
    }

    if ('IntersectionObserver' in window) {
      document.documentElement.classList.add('js-reveal');

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            requestAnimationFrame(() => {
              e.target.classList.add('in');
            });
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => io.observe(el));
    } else {
      // Fallback para navegadores antiguos
      revealEls.forEach(el => el.classList.add('in'));
    }
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
