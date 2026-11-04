(() => {
  const modal = document.getElementById('course-video-modal');
  const player = modal?.querySelector('[data-course-video]');
  const title = modal?.querySelector('[data-course-video-title]');
  const kicker = modal?.querySelector('[data-course-video-kicker]');
  const openLink = modal?.querySelector('[data-course-video-open]');
  const closeButton = modal?.querySelector('[data-course-video-close]');
  const cards = [...document.querySelectorAll('.course-card[data-video-src]')];
  if (!modal || !player || !title || !kicker || !openLink || !closeButton || !cards.length) return;

  let activeCard = null;

  const resetPlayer = () => {
    player.pause();
    player.removeAttribute('src');
    player.removeAttribute('poster');
    player.load();
  };

  const closeModal = () => {
    if (modal.open && typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    resetPlayer();
    activeCard?.focus({ preventScroll: true });
    activeCard = null;
  };

  const openModal = card => {
    activeCard = card;
    title.textContent = card.dataset.videoTitle || '课程视频';
    kicker.textContent = card.dataset.videoKicker || 'HANDS-ON LEARNING';
    openLink.href = card.dataset.videoSrc;
    player.poster = card.querySelector('img')?.currentSrc || card.querySelector('img')?.src || '';
    player.src = card.dataset.videoSrc;
    player.load();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    const playRequest = player.play();
    if (playRequest?.catch) playRequest.catch(() => {});
  };

  cards.forEach(card => {
    card.addEventListener('click', event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openModal(card);
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener('cancel', event => {
    event.preventDefault();
    closeModal();
  });
})();
