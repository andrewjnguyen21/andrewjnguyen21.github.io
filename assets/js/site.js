(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const media = [...document.querySelectorAll('.project-media')];
  const visible = new Set();
  let paused = reducedMotion.matches;

  function syncPlayback(container) {
    const video = container.querySelector('video');
    if (paused || document.hidden || !visible.has(container)) {
      video.pause();
    } else {
      video.play().catch(() => container.classList.remove('is-playing'));
    }
  }
  function syncAll() {
    media.forEach(syncPlayback);
  }
  media.forEach(container => {
    const video = container.querySelector('video');
    video.muted = true;
    if (paused) { video.autoplay = false; video.pause(); }
    video.addEventListener('play', () => container.classList.add('is-playing'));
    video.addEventListener('pause', () => container.classList.remove('is-playing'));
    video.addEventListener('error', () => container.classList.remove('is-playing'));
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
      syncPlayback(target);
    });
  }, { threshold: 0.1 });
  media.forEach(container => observer.observe(container));
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncAll(); });
  document.addEventListener('visibilitychange', syncAll);
  syncAll();

  function revealProject() {
    if (!location.hash.startsWith('#project-')) return;
    const project = document.getElementById(location.hash.slice(1));
    if (project) project.querySelector('details').open = true;
  }
  function collapseProjects() {
    document.querySelectorAll('.project-details').forEach(d => { d.open = false; });
    if (location.hash.startsWith('#project-')) history.replaceState(null, '', location.pathname + location.search);
  }
  window.addEventListener('hashchange', revealProject);
  window.addEventListener('pageshow', collapseProjects);
  collapseProjects();
})();
