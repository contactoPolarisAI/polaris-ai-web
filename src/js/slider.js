export const SliderManager = {
  init() {
    const track = document.querySelector('.perfil-carousel-track');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev');
    const nextBtn = document.querySelector('.carousel-nav-btn.next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!track) return;

    let cachedSlideWidth = 300;
    let cachedClientWidth = 0;
    let cachedScrollWidth = 0;

    const updateCachedDimensions = () => {
      const firstCard = track.firstElementChild;
      cachedSlideWidth = firstCard ? (firstCard.getBoundingClientRect().width + 24) : 300;
      cachedClientWidth = track.clientWidth;
      cachedScrollWidth = track.scrollWidth;
    };

    // Initial cache
    updateCachedDimensions();

    // Debounced resize handler to update dimensions
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          updateCachedDimensions();
          handleScrollImmediate();
        });
      }, 150);
    });

    // Scroll handlers for navigation buttons
    prevBtn?.addEventListener('click', () => {
      track.scrollBy({
        left: -cachedSlideWidth,
        behavior: 'smooth'
      });
    });

    nextBtn?.addEventListener('click', () => {
      track.scrollBy({
        left: cachedSlideWidth,
        behavior: 'smooth'
      });
    });

    // Scroll to specific index for pagination dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        track.scrollTo({
          left: cachedSlideWidth * index,
          behavior: 'smooth'
        });
      });
    });

    // Update dots and button states
    const handleScrollImmediate = () => {
      const scrollPosition = track.scrollLeft;
      const index = Math.round(scrollPosition / cachedSlideWidth);
      const activeIndex = Math.max(0, Math.min(index, dots.length - 1));

      requestAnimationFrame(() => {
        // Update active class on dots
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });

        // Disable buttons at boundaries
        if (prevBtn) prevBtn.style.opacity = scrollPosition <= 5 ? '0.5' : '1';
        if (nextBtn) {
          const isAtEnd = scrollPosition + cachedClientWidth >= cachedScrollWidth - 5;
          nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        }
      });
    };

    // Update dots active class on scroll
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollImmediate, 50);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run initial scroll update to set button states
    handleScrollImmediate();
  }
};
