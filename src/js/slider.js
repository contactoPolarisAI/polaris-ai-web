export const SliderManager = {
  init() {
    const track = document.querySelector('.perfil-carousel-track');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev');
    const nextBtn = document.querySelector('.carousel-nav-btn.next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!track) return;

    // Helper to calculate card slide width including gap
    const getSlideWidth = () => {
      const firstCard = track.firstElementChild;
      if (!firstCard) return 300;
      return firstCard.getBoundingClientRect().width + 24; // Width + gap
    };

    // Scroll handlers for navigation buttons
    prevBtn?.addEventListener('click', () => {
      track.scrollBy({
        left: -getSlideWidth(),
        behavior: 'smooth'
      });
    });

    nextBtn?.addEventListener('click', () => {
      track.scrollBy({
        left: getSlideWidth(),
        behavior: 'smooth'
      });
    });

    // Scroll to specific index for pagination dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const slideWidth = getSlideWidth();
        track.scrollTo({
          left: slideWidth * index,
          behavior: 'smooth'
        });
      });
    });

    // Update dots active class on scroll
    let scrollTimeout;
    const handleScroll = () => {
      // Debounce or throttle scroll to prevent layout thrashing
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const slideWidth = getSlideWidth();
        const scrollPosition = track.scrollLeft;
        const index = Math.round(scrollPosition / slideWidth);

        // Clamp index between 0 and dots.length - 1
        const activeIndex = Math.max(0, Math.min(index, dots.length - 1));

        // Update active class on dots
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });

        // Optional: disable prev/next button states at boundaries
        if (prevBtn) prevBtn.style.opacity = scrollPosition <= 5 ? '0.5' : '1';
        if (nextBtn) {
          const isAtEnd = scrollPosition + track.clientWidth >= track.scrollWidth - 5;
          nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        }
      }, 50);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run initial scroll update to set button states
    handleScroll();
  }
};
