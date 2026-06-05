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
      }, 1500);
    }

    // Accept cookies
    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('polaris_cookie_consent', 'accepted');
      banner.classList.remove('show');
    });

    // Reject cookies
    rejectBtn?.addEventListener('click', () => {
      localStorage.setItem('polaris_cookie_consent', 'rejected');
      banner.classList.remove('show');
    });
  }
};
