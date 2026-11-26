(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopProjects = window.matchMedia('(min-width: 761px)');
  const playback = new Map();
  const visible = new Set();

  function inView(container) {
    return visible.has(container) && !document.hidden;
  }
  function syncAll() {
    playback.forEach(sync => sync());
  }
  document.querySelectorAll('.project-media > video:not(.project-demo)').forEach(video => {
    const container = video.parentElement;
    video.muted = true;
    video.addEventListener('play', () => container.classList.add('is-playing'));
    video.addEventListener('pause', () => container.classList.remove('is-playing'));
    video.addEventListener('error', () => container.classList.remove('is-playing'));
    playback.set(container, () => {
      if (reducedMotion.matches || !inView(container)) video.pause();
      else video.play().catch(() => container.classList.remove('is-playing'));
    });
  });

  document.querySelectorAll('video.project-demo').forEach(video => {
    const frame = video.parentElement;
    const card = frame.closest('.work-card');
    const row = card.closest('.work-row');
    const details = card.querySelector('.project-details');
    const cover = frame.classList.contains('project-media');
    video.muted = true;
    video.addEventListener('playing', () => frame.classList.add('is-playing'));
    video.addEventListener('error', () => frame.classList.remove('is-playing'), true);

    function syncDemo() {
      const showing = details.open || (cover && !(desktopProjects.matches && row.querySelector('.project-details[open]')));
      if (showing && !reducedMotion.matches && inView(frame)) {
        if (video.preload === 'none') video.preload = 'auto';
        video.play().catch(() => frame.classList.remove('is-playing'));
      } else {
        video.pause();
      }
    }

    row.addEventListener('toggle', syncDemo, true);
    playback.set(frame, syncDemo);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
      playback.get(target)();
    });
  }, { threshold: 0.1 });
  playback.forEach((_, container) => observer.observe(container));
  reducedMotion.addEventListener('change', syncAll);
  desktopProjects.addEventListener('change', syncAll);
  document.addEventListener('visibilitychange', syncAll);
  syncAll();

  let activeProject = null;
  let openingPosition = null;
  let transition;
  let returningToGrid = false;

  function showProject(project, { animate = true, restore = false } = {}) {
    if (project === activeProject) return;
    const previous = activeProject;
    activeProject = project;

    function update() {
      if (project !== activeProject) return;
      document.querySelector('.project-details[open]')?.removeAttribute('open');
      if (project) {
        project.open = true;
        if (animate) project.querySelector('summary').focus({ preventScroll: true });
        project.closest('.work-card').scrollIntoView({ block: 'start', behavior: 'instant' });
      } else if (restore) {
        const summary = openingPosition?.summary ?? previous.querySelector('summary');
        summary.focus({ preventScroll: true });
        if (openingPosition) window.scrollTo({ top: openingPosition.scroll, behavior: 'instant' });
        summary.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      } else {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      }
    }

    transition?.skipTransition();
    if (animate && !reducedMotion.matches && !document.hidden && document.startViewTransition) {
      transition = document.startViewTransition(update);
      transition.ready.catch(() => {});
    } else {
      update();
    }
  }

  function closeProject() {
    if (history.state?.projectOpenedFromTile) {
      if (returningToGrid) return;
      returningToGrid = true;
      history.back();
    } else {
      history.replaceState(history.state, '', location.pathname + location.search);
      showProject(null, { restore: true });
    }
  }

  function syncProject(animate = true) {
    returningToGrid = false;
    const target = document.getElementById(location.hash.slice(1));
    const project = target?.querySelector(':scope > .project-details') ?? null;
    const restore = !project && (!location.hash || location.hash === openingPosition?.hash);
    showProject(project, { animate, restore });
  }

  document.querySelectorAll('.project-details > summary').forEach(summary => {
    summary.addEventListener('click', event => {
      event.preventDefault();
      const project = summary.parentElement;
      if (project === activeProject) {
        closeProject();
        return;
      }

      const hash = `#${project.closest('.work-card').id}`;
      if (activeProject) {
        history.replaceState(history.state, '', hash);
      } else {
        openingPosition = { summary, hash: location.hash, scroll: window.scrollY };
        history.pushState({ ...history.state, projectOpenedFromTile: true }, '', hash);
      }
      showProject(project);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeProject) closeProject();
  });
  window.addEventListener('popstate', () => syncProject());
  window.addEventListener('hashchange', () => syncProject());
  syncProject(false);
})();
