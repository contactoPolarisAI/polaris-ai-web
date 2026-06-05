const TWEAK_DEFAULTS = {
  theme: 'light',
  accent: 'electric',
  orbit: true,
  herobg: 'plain'
};

let twk = { ...TWEAK_DEFAULTS };

export const ThemeManager = {
  init() {
    // Escucha eventos del panel de tweaks si existe
    const tweaksClose = document.getElementById('twk-close');
    if (tweaksClose) {
      tweaksClose.addEventListener('click', this.hideTweaks.bind(this));
    }

    document.querySelectorAll('[data-twk]').forEach(group => {
      group.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => this.setTweak(group.dataset.twk, b.dataset.val));
      });
    });

    const twkOrbit = document.getElementById('twk-orbit');
    if (twkOrbit) {
      twkOrbit.addEventListener('change', e => this.setTweak('orbit', e.target.checked));
    }

    window.addEventListener('message', (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode')   this.showTweaks();
      if (e.data.type === '__deactivate_edit_mode') this.hideTweaks();
    });

    // Indicar disponibilidad de edit mode
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

    // Cargar y aplicar tema guardado si existe (por defecto light)
    this.applyTweaks();
  },

  applyTweaks() {
    // Theme
    document.body.classList.toggle('theme-dark', twk.theme === 'dark');

    // Accent
    const accents = {
      navy:     { main: '#1B3A6B', alt: '#2E75B6', soft: '#D5E4F5', deep: '#0F2547' },
      blue:     { main: '#2E75B6', alt: '#1B3A6B', soft: '#D5E4F5', deep: '#1B3A6B' },
      electric: { main: '#3B9AFF', alt: '#1B3A6B', soft: '#DDEBFF', deep: '#0F2547' },
    };
    const a = accents[twk.accent] || accents.navy;
    document.documentElement.style.setProperty('--accent',      a.main);
    document.documentElement.style.setProperty('--accent-2',    a.alt);
    document.documentElement.style.setProperty('--accent-soft', a.soft);
    document.documentElement.style.setProperty('--polaris-navy-deep', a.deep);

    // Orbit
    document.querySelectorAll('.hero-visual .orbit, .hero-visual .glow, .hero-visual .ring').forEach(el => {
      el.style.display = twk.orbit ? '' : (el.classList.contains('isotype') ? '' : 'none');
    });

    // Hero bg
    const hero = document.getElementById('hero');
    if (hero) {
      hero.dataset.bg = twk.herobg;
      if (twk.herobg === 'aurora') {
        hero.style.background = 'linear-gradient(160deg, #f7faff 0%, #e6efff 50%, #d8e8ff 100%)';
      } else if (twk.herobg === 'plain') {
        hero.style.background = '#fff';
      } else {
        hero.style.background = '';
      }
    }

    // Update UI states
    document.querySelectorAll('[data-twk]').forEach(group => {
      const key = group.dataset.twk;
      group.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', String(b.dataset.val) === String(twk[key]));
      });
    });

    const twkOrbit = document.getElementById('twk-orbit');
    if (twkOrbit) {
      twkOrbit.checked = !!twk.orbit;
    }
  },

  setTweak(key, value) {
    twk[key] = value;
    this.applyTweaks();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
    } catch (e) {}
  },

  showTweaks() {
    const tweaksEl = document.getElementById('tweaks');
    if (tweaksEl) tweaksEl.classList.add('visible');
  },

  hideTweaks() {
    const tweaksEl = document.getElementById('tweaks');
    if (tweaksEl) tweaksEl.classList.remove('visible');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  }
};
