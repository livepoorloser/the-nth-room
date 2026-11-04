(() => {
  const track = document.getElementById('course-track');
  if (!track) return;

  const buttons = [...document.querySelectorAll('[data-course-scroll]')];
  const updateControls = () => {
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    for (const button of buttons) {
      button.disabled = Number(button.dataset.courseScroll) < 0 ? atStart : atEnd;
    }
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const direction = Number(button.dataset.courseScroll);
      const firstCard = track.querySelector('.course-card');
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      track.scrollBy({
        left: direction * ((firstCard?.getBoundingClientRect().width || track.clientWidth * 0.7) + gap),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  let pointerStart = 0;
  let scrollStart = 0;
  let activePointerId = null;
  let suppressClickPointerId = null;
  let moved = false;
  track.addEventListener('click', event => {
    if (event.pointerId !== suppressClickPointerId) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickPointerId = null;
  }, true);

  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    pointerStart = event.clientX;
    scrollStart = track.scrollLeft;
    activePointerId = event.pointerId;
    moved = false;
  });

  track.addEventListener('pointermove', event => {
    if (event.pointerId !== activePointerId) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 5) {
      if (!moved) track.setPointerCapture(event.pointerId);
      moved = true;
      track.classList.add('is-dragging');
      track.scrollLeft = scrollStart - distance;
      event.preventDefault();
    }
  });

  const finishDrag = event => {
    if (event.pointerId !== activePointerId) return;
    track.classList.remove('is-dragging');
    if (moved && event.type === 'pointerup') {
      suppressClickPointerId = event.pointerId;
      window.setTimeout(() => {
        if (suppressClickPointerId === event.pointerId) suppressClickPointerId = null;
      }, 0);
    }
    activePointerId = null;
    moved = false;
  };

  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
})();
