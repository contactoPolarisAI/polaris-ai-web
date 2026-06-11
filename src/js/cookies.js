export const CookieManager = {
  init() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('btn-accept-cookies');
    const rejectBtn = document.getElementById('btn-reject-cookies');

    if (!banner) return;

    // Check if user has already made a choice
    const consent = localStorage.getItem('polaris_cookie_consent');

    if (!consent) {
      // Show the banner with a small delay
      setTimeout(() => {
        banner.classList.add('show');
        document.body.classList.add('cookie-banner-active');
      }, 1500);
    }

    const triggerDeferredIntro = () => {
      if (document.documentElement.classList.contains('intro-deferred')) {
        document.documentElement.classList.remove('intro-deferred');
        document.documentElement.classList.add('intro-locked');
      }
    };

    // Accept cookies
    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('polaris_cookie_consent', 'accepted');
      banner.classList.remove('show');
      document.body.classList.remove('cookie-banner-active');
      triggerDeferredIntro();
    });

    // Reject cookies
    rejectBtn?.addEventListener('click', () => {
      localStorage.setItem('polaris_cookie_consent', 'rejected');
      banner.classList.remove('show');
      document.body.classList.remove('cookie-banner-active');
      triggerDeferredIntro();
    });
  }
};
