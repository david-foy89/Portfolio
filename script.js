const GITHUB_USERNAME = 'david-foy89';

/** Fallback copy when a repo has no GitHub description field */
const REPO_DESCRIPTIONS = {
  Portfolio:
    'Personal portfolio at davidkfoy.com — featured projects, live GitHub repo feed, animated canvas background, and Formspree contact form.',
  LastWarTools:
    'Browser-based toolkit for a mobile strategy game with Firebase sync, screenshot OCR, Claude AI helpers, and multi-language support — built for real daily users.',
  'TechForum---Advanced-Developer-Q-A-Platform':
    'Full-stack developer Q&A forum with React, Express, MongoDB, JWT auth, voting, reputation tracking, and responsive dashboards.',
  'Kanban-Board':
    'Interactive Kanban board with React, TypeScript, Zustand, and drag-and-drop — add/edit tasks, manage columns, and persist state in localStorage.',
  Giphy_Project:
    'Gifs-R-Us: search and browse trending GIFs via the Giphy API with infinite scroll, one-click downloads, and a fully responsive vanilla JavaScript UI.',
  'Big-Daddy-Dave-s-BBQ':
    'Restaurant website for Big Daddy Dave\'s BBQ in Erwin, TN — menu highlights, catering, contact, and mobile-friendly pages built with HTML and CSS.',
  'Task-Management-App':
    'React todo app with Redux Toolkit — CRUD tasks, All/Active/Completed filters, localStorage persistence, and a contact form with controlled inputs.',
};

const GITHUB_PAGES_USER = 'https://david-foy89.github.io';

/**
 * Live site URLs and button labels (overrides stale/missing GitHub homepage fields).
 * label: "Live Demo" | "Live Site"
 */
const REPO_LIVE_LINKS = {
  Portfolio: { url: 'https://davidkfoy.com/', label: 'Live Site' },
  'TechForum---Advanced-Developer-Q-A-Platform': {
    url: 'https://david-foy89.github.io/TechForum---Advanced-Developer-Q-A-Platform/',
    label: 'Live Demo',
  },
  LastWarTools: {
    url: 'https://david-foy89.github.io/LastWarTools/',
    label: 'Live Site',
  },
  'Kanban-Board': {
    url: 'https://david-foy89.github.io/Kanban-Board/',
    label: 'Live Demo',
  },
  Giphy_Project: {
    url: 'https://david-foy89.github.io/Giphy_Project/index.html',
    label: 'Live Demo',
  },
  'Big-Daddy-Dave-s-BBQ': {
    url: 'https://david-foy89.github.io/Big-Daddy-Dave-s-BBQ/',
    label: 'Live Site',
  },
  'Task-Management-App': {
    url: 'https://david-foy89.github.io/Task-Management-App/',
    label: 'Live Demo',
  },
};

const STALE_HOMEPAGE_PATTERNS = ['/Project4'];

const languageColors = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#1572B6',
  TypeScript: '#2b7489',
  Java: '#b07219',
  'C#': '#239120',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#2c3e50',
  'Jupyter Notebook': '#DA5B0B',
};

let repositories = [];
let filteredRepos = [];
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const projectsGrid = document.getElementById('projects-grid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const languageFilter = document.getElementById('language-filter');
const sortRepos = document.getElementById('sort-repos');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const retryReposBtn = document.getElementById('retry-repos');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

const backToTopBtn = document.getElementById('back-to-top');

const HERO_DEMO_FRAME = { width: 1280, height: 800 };

const HERO_FEATURED_DEMOS = [
  {
    title: 'TechForum',
    host: 'TechForum — GitHub Pages',
    url: 'https://david-foy89.github.io/TechForum---Advanced-Developer-Q-A-Platform/',
    label: 'Live Demo',
  },
  {
    title: 'LastWarTools',
    host: 'LastWarTools — GitHub Pages',
    url: 'https://david-foy89.github.io/LastWarTools/',
    label: 'Live Site',
  },
];

document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initBackgroundCanvas();
  initializeEventListeners();
  initCustomCursor();
  initNavObserver();
  initScrollReveal();
  initBackToTop();
  initHeroDemoShowcase();
  initExpandableDescriptions();
  loadRepositories();
  scanExpandableDescriptions(document);
});

function initExpandableDescriptions() {
  if (document.body.dataset.descToggleInit) return;
  document.body.dataset.descToggleInit = 'true';

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.description-toggle');
    if (!btn) return;

    const block = btn.closest('.description-block');
    const text = block?.querySelector('.clamp-text');
    if (!block || !text) return;

    const expanded = block.classList.toggle('is-expanded');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.textContent = expanded ? 'Less' : 'More';

    if (!expanded) {
      updateDescriptionToggle(block, btn, text);
    }
  });
}

function updateDescriptionToggle(block, btn, text) {
  if (block.classList.contains('is-expanded')) {
    btn.hidden = false;
    return;
  }
  btn.hidden = text.scrollHeight <= text.clientHeight + 2;
}

function scanExpandableDescriptions(scope = document) {
  scope.querySelectorAll('.description-block').forEach((block) => {
    const text = block.querySelector('.clamp-text');
    const btn = block.querySelector('.description-toggle');
    if (!text || !btn) return;

    if (text.classList.contains('is-clamp-empty')) {
      btn.hidden = true;
      return;
    }

    updateDescriptionToggle(block, btn, text);
    btn.textContent = block.classList.contains('is-expanded') ? 'Less' : 'More';
    btn.setAttribute(
      'aria-expanded',
      block.classList.contains('is-expanded') ? 'true' : 'false'
    );
  });
}

function buildDescriptionBlock(innerHtml, { empty = false } = {}) {
  if (empty) {
    return `<div class="description-block">
      <p class="clamp-text project-description is-clamp-empty">No description provided.</p>
    </div>`;
  }

  return `<div class="description-block">
    <p class="clamp-text project-description">${innerHtml}</p>
    <button type="button" class="description-toggle" hidden aria-expanded="false">More</button>
  </div>`;
}

function initHeroDemoShowcase() {
  const root = document.getElementById('hero-demo');
  const urlEl = document.getElementById('hero-demo-url');
  const openBtn = document.getElementById('hero-demo-open');
  const openLabel = openBtn?.querySelector('.hero-demo__open-label');
  const expandBtn = document.getElementById('hero-demo-expand');
  const panel = document.getElementById('hero-demo-panel');
  const heroPanes = panel?.querySelectorAll('.hero-demo__pane') ?? [];
  const heroFrames = [...heroPanes]
    .map((pane) => pane.querySelector('iframe'))
    .filter(Boolean);
  const tabs = root?.querySelectorAll('.hero-demo__tab');

  const popoutRoot = document.getElementById('hero-demo-popout');
  const popoutFrame = document.getElementById('hero-demo-popout-frame');
  const popoutUrlEl = document.getElementById('hero-demo-popout-url');
  const popoutOpen = document.getElementById('hero-demo-popout-open');
  const popoutOpenLabel = document.getElementById('hero-demo-popout-open-label');
  const popoutClose = document.getElementById('hero-demo-popout-close');
  const popoutPanel = document.getElementById('hero-demo-popout-panel');
  const popoutCloseTriggers = popoutRoot?.querySelectorAll('[data-popout-close]');
  const demoTabSelector = '#hero-demo .hero-demo__tab, #hero-demo-popout .hero-demo__tab';

  if (!root || !heroFrames.length || !urlEl || !openBtn || !openLabel || !tabs?.length) {
    return;
  }

  function getActiveHeroFrame() {
    return heroFrames[activeIndex] ?? heroFrames[0];
  }

  function setActiveHeroPane(index) {
    heroPanes.forEach((pane, i) => {
      pane.classList.toggle('is-active', i === index);
    });
  }

  function ensureHeroFrameLoaded(index) {
    const demo = HERO_FEATURED_DEMOS[index];
    const heroFrame = heroFrames[index];
    if (!demo || !heroFrame) return;

    heroFrame.removeAttribute('loading');
    const target = normalizeFrameUrl(demo.url);
    const current = normalizeFrameUrl(heroFrame.src);
    if (!current || current !== target) {
      heroFrame.src = demo.url;
    }
  }

  function preloadHeroFrames() {
    HERO_FEATURED_DEMOS.forEach((_, index) => ensureHeroFrameLoaded(index));
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let activeIndex = 0;
  let rotateTimer = null;
  let interactResumeTimer = null;
  let scrollLockY = null;
  let scrollLockRaf = null;
  let popoutPreviousFocus = null;

  function isPopoutOpen() {
    return Boolean(popoutRoot?.classList.contains('is-open'));
  }

  function normalizeFrameUrl(url) {
    if (!url || url === 'about:blank') return '';
    try {
      return new URL(url, window.location.href).href;
    } catch {
      return url;
    }
  }

  function syncAllDemoTabs(index) {
    document.querySelectorAll(demoTabSelector).forEach((tab) => {
      const i = Number(tab.dataset.demoIndex);
      const isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panel?.setAttribute('aria-labelledby', `hero-demo-tab-${index}`);
    popoutPanel?.setAttribute('aria-labelledby', `hero-demo-popout-tab-${index}`);
  }

  function syncDemoLinks(demo) {
    const openLabelText = demo.label;
    const openAria = `Open ${demo.title} ${demo.label.toLowerCase()} in a new tab`;

    urlEl.textContent = demo.host;
    openBtn.href = demo.url;
    openLabel.textContent = openLabelText;
    openBtn.setAttribute('aria-label', openAria);

    if (popoutUrlEl) popoutUrlEl.textContent = demo.host;
    if (popoutOpen) {
      popoutOpen.href = demo.url;
      popoutOpen.setAttribute('aria-label', openAria);
    }
    if (popoutOpenLabel) popoutOpenLabel.textContent = openLabelText;
  }

  function setPopoutFrameSrc(url, { resetScroll = false } = {}) {
    if (!popoutFrame || !url) return;

    const target = normalizeFrameUrl(url);
    const current = normalizeFrameUrl(popoutFrame.src);

    if (resetScroll) {
      popoutFrame.addEventListener(
        'load',
        () => {
          try {
            popoutFrame.contentWindow?.scrollTo(0, 0);
          } catch {
            /* cross-origin */
          }
        },
        { once: true }
      );
    }

    if (!current || current !== target) {
      popoutFrame.src = url;
    } else if (resetScroll) {
      try {
        popoutFrame.contentWindow?.scrollTo(0, 0);
      } catch {
        /* cross-origin */
      }
    }
  }

  function openPopout() {
    if (!popoutRoot || !popoutFrame) return;

    const demo = HERO_FEATURED_DEMOS[activeIndex];
    if (!demo) return;

    pauseRotateForInteraction();
    stopRotate();
    syncAllDemoTabs(activeIndex);
    syncDemoLinks(demo);

    popoutFrame.title = `${demo.title} expanded live preview`;
    const heroSrc = normalizeFrameUrl(getActiveHeroFrame().src);
    const startUrl = heroSrc || demo.url;

    popoutRoot.classList.add('is-open');
    popoutRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('hero-demo-popout-open');
    unlockPageScroll();

    expandBtn?.setAttribute('aria-expanded', 'true');
    popoutPreviousFocus = document.activeElement;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPopoutFrameSrc(startUrl);
        popoutClose?.focus();
      });
    });
  }

  function closePopout() {
    if (!popoutRoot?.classList.contains('is-open')) return;

    popoutRoot.classList.remove('is-open');
    popoutRoot.setAttribute('aria-hidden', 'true');
    expandBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('hero-demo-popout-open');

    if (popoutFrame) {
      popoutFrame.src = 'about:blank';
    }

    if (popoutPreviousFocus && typeof popoutPreviousFocus.focus === 'function') {
      popoutPreviousFocus.focus();
    }
    popoutPreviousFocus = null;

    requestAnimationFrame(() => {
      if (!isHeroEngaged()) startRotate();
    });
  }

  function preservePageScroll() {
    const y = scrollLockY ?? window.scrollY;
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    });
  }

  function lockPageScroll() {
    scrollLockY = window.scrollY;
    if (scrollLockRaf) return;
    const tick = () => {
      if (scrollLockY !== null && window.scrollY !== scrollLockY) {
        window.scrollTo({ top: scrollLockY, left: 0, behavior: 'instant' });
      }
      scrollLockRaf = requestAnimationFrame(tick);
    };
    scrollLockRaf = requestAnimationFrame(tick);
  }

  function unlockPageScroll() {
    scrollLockY = null;
    if (scrollLockRaf) {
      cancelAnimationFrame(scrollLockRaf);
      scrollLockRaf = null;
    }
  }

  function isHeroEngaged() {
    return (
      isPopoutOpen() ||
      root.matches(':hover') ||
      heroFrames.some((f) => document.activeElement === f)
    );
  }

  function onHeroDisengage() {
    requestAnimationFrame(() => {
      if (isHeroEngaged()) return;
      unlockPageScroll();
      clearTimeout(interactResumeTimer);
      interactResumeTimer = setTimeout(() => startRotate(), 4000);
    });
  }

  function updateHeroDemoScale() {
    if (!panel) return;
    const scale = Math.min(
      panel.clientWidth / HERO_DEMO_FRAME.width,
      panel.clientHeight / HERO_DEMO_FRAME.height,
      0.52
    );
    panel.style.setProperty('--hero-demo-scale', String(scale));
  }

  function pauseRotateForInteraction() {
    stopRotate();
    clearTimeout(interactResumeTimer);
    interactResumeTimer = setTimeout(() => startRotate(), 14000);
  }

  function setDemo(index) {
    const demo = HERO_FEATURED_DEMOS[index];
    if (!demo) return;

    activeIndex = index;

    syncAllDemoTabs(index);
    syncDemoLinks(demo);

    setActiveHeroPane(index);
    ensureHeroFrameLoaded(index);

    const activeFrame = getActiveHeroFrame();
    activeFrame.title = `${demo.title} live preview`;

    if (isPopoutOpen()) {
      popoutFrame.title = `${demo.title} expanded live preview`;
      setPopoutFrameSrc(demo.url, { resetScroll: true });
    }
  }

  function stopRotate() {
    if (rotateTimer) {
      clearInterval(rotateTimer);
      rotateTimer = null;
    }
  }

  function startRotate() {
    if (prefersReducedMotion || HERO_FEATURED_DEMOS.length < 2) return;
    stopRotate();
    rotateTimer = setInterval(() => {
      setDemo((activeIndex + 1) % HERO_FEATURED_DEMOS.length);
    }, 9000);
  }

  document.querySelectorAll(demoTabSelector).forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = Number(tab.dataset.demoIndex);
      if (Number.isNaN(index)) return;
      setDemo(index);
      pauseRotateForInteraction();
    });
  });

  if (panel) {
    panel.addEventListener('pointerdown', pauseRotateForInteraction);
    panel.addEventListener('wheel', pauseRotateForInteraction, { passive: true });
  }

  heroFrames.forEach((heroFrame) => {
    heroFrame.addEventListener('focus', () => {
      pauseRotateForInteraction();
      lockPageScroll();
      preservePageScroll();
    });

    heroFrame.addEventListener('blur', onHeroDisengage);
    heroFrame.addEventListener('pointerenter', () => {
      stopRotate();
      lockPageScroll();
    });
    heroFrame.addEventListener('pointerleave', onHeroDisengage);
    heroFrame.addEventListener('load', preservePageScroll);
  });

  root.addEventListener('pointerenter', () => {
    stopRotate();
    lockPageScroll();
  });
  root.addEventListener('pointerleave', onHeroDisengage);

  expandBtn?.addEventListener('click', openPopout);
  popoutClose?.addEventListener('click', closePopout);
  popoutCloseTriggers?.forEach((el) => {
    el.addEventListener('click', closePopout);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPopoutOpen()) {
      e.preventDefault();
      closePopout();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateHeroDemoScale, 120);
  });

  updateHeroDemoScale();
  preloadHeroFrames();
  setDemo(0);
  startRotate();
}

function initPageLoad() {
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });
}

function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const sketchToggle = document.getElementById('bg-sketch-toggle');
  const playHint = document.getElementById('bg-play-hint');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const INTERACTIVE =
    'a, button, .btn, .project-link, .view-btn, .contact-item, .hamburger, .back-to-top, .bg-sketch-toggle, input, textarea, select, label, #hero-demo, .hero-demo__tab, .hero-demo__viewport, .hero-demo__frame, #hero-demo-popout, .hero-demo--popout, .hero-demo-popout__close, .hero-demo-popout__backdrop';

  const mouse = { x: 0, y: 0, active: false };
  const palette = {
    node: 'rgba(91, 154, 255, 0.85)',
    nodeUser: 'rgba(140, 190, 255, 1)',
    line: 'rgba(45, 108, 223, 0.35)',
    lineBright: 'rgba(91, 154, 255, 0.55)',
    lineUser: 'rgba(91, 154, 255, 0.75)',
    lineChain: 'rgba(140, 190, 255, 0.9)',
    preview: 'rgba(91, 154, 255, 0.45)',
    selected: 'rgba(91, 154, 255, 0.35)',
  };

  let width = 0;
  let height = 0;
  let nodes = [];
  let ambientNodes = [];
  let userNodes = [];
  let userLinks = [];
  let floatingShapes = [];
  let nextNodeId = 1;
  let nextShapeId = 1;
  let animationId = null;
  let isVisible = true;
  let sketchMode = false;
  let shiftHeld = false;
  let selectedId = null;
  let draggingNode = null;
  let pointerId = null;
  let linkPreview = null;
  let shapeDrag = null;
  let dragMoved = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let flingSamples = [];
  let flingTarget = null;
  let lastClickAt = 0;
  let lastClickX = 0;
  let lastClickY = 0;

  const MAX_USER_NODES = 160;
  const DRAG_THRESHOLD = 6;
  const playHintDesktop = playHint?.innerHTML ?? '';

  function isSketching(e) {
    return sketchMode || shiftHeld || Boolean(e?.shiftKey);
  }

  function setSketchMode(on) {
    sketchMode = on;
    document.body.classList.toggle('bg-sketch-active', on);
    if (sketchToggle) {
      sketchToggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (playHint) {
      playHint.hidden = !on;
      playHint.classList.toggle('is-visible', on);
      if (on && isCoarsePointer) {
        playHint.innerHTML =
          'Tap to chain dots · drag &amp; fling your shape to float · double-click ends chain · <strong>Draw</strong> to exit';
      } else if (on) {
        playHint.innerHTML = playHintDesktop;
      }
    }
  }

  function endChain() {
    selectedId = null;
    linkPreview = null;
  }

  function recordFlingSample(x, y) {
    const now = performance.now();
    flingSamples.push({ x, y, t: now });
    if (flingSamples.length > 12) flingSamples.shift();
  }

  function isDoubleClick(x, y) {
    const now = performance.now();
    const isDouble =
      now - lastClickAt < 420 &&
      Math.hypot(x - lastClickX, y - lastClickY) < 18;
    lastClickAt = now;
    lastClickX = x;
    lastClickY = y;
    return isDouble;
  }

  function computeFlingVelocity(samples) {
    if (samples.length < 2) return { vx: 0, vy: 0 };

    const last = samples[samples.length - 1];
    const prev = samples[Math.max(0, samples.length - 4)];
    const dt = (last.t - prev.t) / 1000;
    if (dt < 0.008) return { vx: 0, vy: 0 };

    let vx = ((last.x - prev.x) / dt) * 0.45;
    let vy = ((last.y - prev.y) / dt) * 0.45;
    const maxSpeed = 14;
    const mag = Math.hypot(vx, vy);
    if (mag > maxSpeed) {
      vx = (vx / mag) * maxSpeed;
      vy = (vy / mag) * maxSpeed;
    }
    return { vx, vy };
  }

  function resolveFlingVelocity(samples, dragDx, dragDy) {
    let { vx, vy } = computeFlingVelocity(samples);
    const speed = Math.hypot(vx, vy);
    const dragLen = Math.hypot(dragDx, dragDy);

    if (speed < 0.4 && dragLen > 8) {
      vx = (dragDx / dragLen) * Math.min(4.5, dragLen * 0.12);
      vy = (dragDy / dragLen) * Math.min(4.5, dragLen * 0.12);
    }

    return { vx, vy };
  }

  function getConnectedUserNodeIds(startId) {
    const ids = new Set();
    const queue = [startId];

    while (queue.length) {
      const id = queue.shift();
      if (ids.has(id)) continue;

      const node = getNodeById(id);
      if (!node?.userCreated) continue;

      ids.add(id);

      for (const link of userLinks) {
        let other = null;
        if (link.fromId === id) other = link.toId;
        else if (link.toId === id) other = link.fromId;
        if (other !== null && !ids.has(other)) queue.push(other);
      }
    }

    return [...ids];
  }

  function removeFloatingShapesForNodes(nodeIds) {
    floatingShapes = floatingShapes.filter(
      (shape) => !shape.nodeIds.some((id) => nodeIds.includes(id))
    );
  }

  function findFloatingShapeByNode(nodeId) {
    return floatingShapes.find((shape) => shape.nodeIds.includes(nodeId));
  }

  function isNodeFloating(nodeId) {
    return Boolean(findFloatingShapeByNode(nodeId));
  }

  function applyFling(hit, vx, vy) {
    if (Math.hypot(vx, vy) < 0.15) return false;
    if (!hit.userCreated) return false;

    const ids = getConnectedUserNodeIds(hit.id);
    if (!ids.length) return false;

    removeFloatingShapesForNodes(ids);

    floatingShapes.push({
      id: nextShapeId++,
      nodeIds: ids,
      vx,
      vy,
    });

    for (const id of ids) {
      const node = getNodeById(id);
      if (!node) continue;
      node.vx = 0;
      node.vy = 0;
      node.pinned = false;
    }

    endChain();
    return true;
  }

  function tickFloatingShapes() {
    const pad = 24;
    const friction = 0.993;

    floatingShapes = floatingShapes.filter((shape) =>
      shape.nodeIds.every((id) => getNodeById(id))
    );

    for (const shape of floatingShapes) {
      const isDragging =
        draggingNode && shape.nodeIds.includes(draggingNode.id);
      if (isDragging) continue;

      const speed = Math.hypot(shape.vx, shape.vy);
      if (speed < 0.03) {
        shape.vx = 0;
        shape.vy = 0;
        continue;
      }

      const members = shape.nodeIds
        .map((id) => getNodeById(id))
        .filter(Boolean);
      if (!members.length) continue;

      for (const node of members) {
        node.x += shape.vx;
        node.y += shape.vy;
      }

      shape.vx *= friction;
      shape.vy *= friction;

      let bounceX = false;
      let bounceY = false;
      for (const node of members) {
        if (node.x < pad) {
          node.x = pad;
          bounceX = true;
        }
        if (node.x > width - pad) {
          node.x = width - pad;
          bounceX = true;
        }
        if (node.y < pad) {
          node.y = pad;
          bounceY = true;
        }
        if (node.y > height - pad) {
          node.y = height - pad;
          bounceY = true;
        }
      }
      if (bounceX) shape.vx *= -0.82;
      if (bounceY) shape.vy *= -0.82;
    }
  }

  function syncNodes() {
    nodes = [...ambientNodes, ...userNodes];
  }

  function nodeCount() {
    if (prefersReducedMotion) return 28;
    if (width < 640) return 32;
    if (width < 1024) return 44;
    return 58;
  }

  function connectDistance() {
    return width < 640 ? 110 : 150;
  }

  function makeAmbientNode() {
    return {
      id: nextNodeId++,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.35),
      vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.35),
      r: Math.random() * 1.2 + 1,
      pinned: false,
      userCreated: false,
    };
  }

  function makeUserNode(x, y) {
    return {
      id: nextNodeId++,
      x,
      y,
      vx: 0,
      vy: 0,
      r: 4,
      pinned: true,
      userCreated: true,
    };
  }

  function createAmbientNodes() {
    const count = nodeCount();
    return Array.from({ length: count }, makeAmbientNode);
  }

  function getNodeById(id) {
    return nodes.find((n) => n.id === id);
  }

  function findNodeAt(x, y) {
    let found = null;
    let best = 999;

    const search = (list, padding, extraRadius = 0) => {
      for (const node of list) {
        const dx = x - node.x;
        const dy = y - node.y;
        const dist = Math.hypot(dx, dy);
        const hit = padding + node.r + extraRadius;
        if (dist < hit && dist < best) {
          best = dist;
          found = node;
        }
      }
    };

    search(userNodes, 14, 4);
    if (!found) search(ambientNodes, 6, 0);
    return found;
  }

  function addUserLink(fromId, toId) {
    if (fromId === toId) return;
    const exists = userLinks.some(
      (l) =>
        (l.fromId === fromId && l.toId === toId) ||
        (l.fromId === toId && l.toId === fromId)
    );
    if (!exists) userLinks.push({ fromId, toId });
  }

  function clearUserArt() {
    userNodes = [];
    userLinks = [];
    floatingShapes = [];
    selectedId = null;
    linkPreview = null;
    draggingNode = null;
    flingTarget = null;
    shapeDrag = null;
    syncNodes();
  }

  function setCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prevW = width;
    const prevH = height;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (prevW && prevH) {
      const sx = width / prevW;
      const sy = height / prevH;
      for (const node of [...ambientNodes, ...userNodes]) {
        node.x *= sx;
        node.y *= sy;
      }
    }
  }

  function drawLink(x1, y1, x2, y2, color, alpha, lineWidth = 1) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    const maxDist = connectDistance();
    const maxDistSq = maxDist * maxDist;
    const sketching = sketchMode || shiftHeld;

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (isNodeFloating(a.id) || isNodeFloating(b.id)) continue;
        if (a.userCreated && b.userCreated) continue;

        if (distSq < maxDistSq) {
          const t = 1 - Math.sqrt(distSq) / maxDist;
          drawLink(a.x, a.y, b.x, b.y, palette.line, t * 0.45);
        }
      }
    }

    for (const link of userLinks) {
      const a = getNodeById(link.fromId);
      const b = getNodeById(link.toId);
      if (a && b) {
        const onChain =
          selectedId !== null &&
          (link.fromId === selectedId || link.toId === selectedId);
        drawLink(
          a.x,
          a.y,
          b.x,
          b.y,
          onChain ? palette.lineChain : palette.lineUser,
          onChain ? 0.95 : 0.85,
          onChain ? 2 : 1.5
        );
      }
    }

    if (linkPreview) {
      const from = getNodeById(linkPreview.fromId);
      if (from) {
        drawLink(from.x, from.y, linkPreview.x, linkPreview.y, palette.preview, 0.6, 1);
      }
    }

    if (mouse.active && !prefersReducedMotion && !sketching) {
      const reach = maxDist * 1.15;
      const reachSq = reach * reach;

      for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < reachSq) {
          const t = 1 - Math.sqrt(distSq) / reach;
          drawLink(node.x, node.y, mouse.x, mouse.y, palette.lineBright, t * 0.7);
        }
      }
    }

    ctx.globalAlpha = 1;
    for (const node of nodes) {
      const isSelected = node.id === selectedId;
      const isDragging = node === draggingNode;
      const isChainHead = isSelected && node.userCreated;

      if (isSelected || isDragging) {
        ctx.strokeStyle = isChainHead ? palette.lineChain : palette.selected;
        ctx.lineWidth = isChainHead ? 2.5 : 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + (isChainHead ? 8 : 6), 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = node.userCreated ? palette.nodeUser : palette.node;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (mouse.active && !isCoarsePointer && !sketching) {
      ctx.fillStyle = 'rgba(91, 154, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function tick() {
    if (!prefersReducedMotion) {
      for (const node of ambientNodes) {
        if (node.pinned || draggingNode === node) continue;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;

        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      }
    }

    if (floatingShapes.length) {
      tickFloatingShapes();
    }

    drawFrame();

    if (isVisible) {
      animationId = requestAnimationFrame(tick);
    } else {
      animationId = null;
    }
  }

  function start() {
    if (animationId) cancelAnimationFrame(animationId);
    setCanvasSize();

    if (!ambientNodes.length) {
      ambientNodes = createAmbientNodes();
      syncNodes();
    }

    tick();
  }

  function pointerPos(e) {
    return { x: e.clientX, y: e.clientY };
  }

  function isInteractiveTarget(el) {
    return Boolean(el?.closest(INTERACTIVE));
  }

  function onPointerDown(e) {
    if (!isSketching(e)) return;
    if (isInteractiveTarget(e.target) && e.target !== canvas) return;

    shiftHeld = e.shiftKey || shiftHeld;
    dragMoved = false;
    flingSamples = [];

    const { x, y } = pointerPos(e);
    pointerDownX = x;
    pointerDownY = y;
    recordFlingSample(x, y);

    if (isDoubleClick(x, y) && selectedId !== null) {
      endChain();
      e.preventDefault();
      return;
    }

    const hit = findNodeAt(x, y);

    if (hit) {
      const hitFloating = isNodeFloating(hit.id);

      if (!hitFloating) {
        if (selectedId !== null && selectedId !== hit.id) {
          addUserLink(selectedId, hit.id);
        }
        selectedId = hit.id;
        linkPreview = { fromId: hit.id, x, y };
      } else {
        endChain();
        linkPreview = null;
      }

      draggingNode = hit;
      flingTarget = hit;
      hit.pinned = true;
      hit.vx = 0;
      hit.vy = 0;
      pointerId = e.pointerId;

      if (hit.userCreated) {
        const shapeIds = getConnectedUserNodeIds(hit.id);
        const floating = findFloatingShapeByNode(hit.id);
        if (floating) {
          floating.vx = 0;
          floating.vy = 0;
        }
        shapeDrag = {
          nodeIds: shapeIds,
          startX: x,
          startY: y,
          origins: new Map(
            shapeIds.map((id) => {
              const n = getNodeById(id);
              return [id, { x: n.x, y: n.y }];
            })
          ),
        };
      }

      if (sketchMode && canvas.setPointerCapture) {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      e.preventDefault();
      return;
    }

    if (userNodes.length >= MAX_USER_NODES) return;

    const node = makeUserNode(x, y);
    if (selectedId !== null) {
      addUserLink(selectedId, node.id);
    }
    userNodes.push(node);
    syncNodes();
    selectedId = node.id;
    linkPreview = { fromId: node.id, x, y };
    e.preventDefault();
  }

  function onPointerMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    if (draggingNode) {
      recordFlingSample(mouse.x, mouse.y);
      const dist = Math.hypot(mouse.x - pointerDownX, mouse.y - pointerDownY);
      if (dist > DRAG_THRESHOLD) dragMoved = true;

      if (shapeDrag) {
        const dx = mouse.x - shapeDrag.startX;
        const dy = mouse.y - shapeDrag.startY;
        for (const [id, origin] of shapeDrag.origins) {
          const n = getNodeById(id);
          if (!n) continue;
          n.x = origin.x + dx;
          n.y = origin.y + dy;
        }
        if (linkPreview) {
          linkPreview.x = mouse.x;
          linkPreview.y = mouse.y;
        }
      } else {
        draggingNode.x = mouse.x;
        draggingNode.y = mouse.y;
        if (linkPreview) {
          linkPreview.x = mouse.x;
          linkPreview.y = mouse.y;
        }
      }
    } else if (selectedId && isSketching(e)) {
      linkPreview = { fromId: selectedId, x: mouse.x, y: mouse.y };
    }
  }

  function onPointerUp(e) {
    const releaseTarget = flingTarget || draggingNode;
    if (releaseTarget) {
      const dragDx = e.clientX - pointerDownX;
      const dragDy = e.clientY - pointerDownY;

      let flung = false;
      if (
        releaseTarget.userCreated &&
        (dragMoved || Math.hypot(dragDx, dragDy) > 4)
      ) {
        const { vx, vy } = resolveFlingVelocity(flingSamples, dragDx, dragDy);
        flung = applyFling(releaseTarget, vx, vy);
      }

      if (!dragMoved && !flung && releaseTarget.id === selectedId) {
        linkPreview = { fromId: selectedId, x: e.clientX, y: e.clientY };
      }

      if (releaseTarget.userCreated) {
        const ids = getConnectedUserNodeIds(releaseTarget.id);
        for (const id of ids) {
          const node = getNodeById(id);
          if (node) node.pinned = false;
        }
      }

      draggingNode = null;
      flingTarget = null;
      shapeDrag = null;
      pointerId = null;
      flingSamples = [];
    }

    if (canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Shift') {
      shiftHeld = true;
      if (playHint && !sketchMode) {
        playHint.hidden = false;
        playHint.classList.add('is-visible');
        playHint.textContent =
          'Hold Shift — click to place dots, click two dots to connect, drag to move. Esc to clear.';
      }
    }
    if (e.key === 'c' || e.key === 'C') {
      if (isSketching()) endChain();
    }
    if (e.key === 'Escape') {
      if (sketchMode) setSketchMode(false);
      clearUserArt();
    }
  }

  function onKeyUp(e) {
    if (e.key === 'Shift') {
      shiftHeld = false;
      if (!sketchMode) {
        linkPreview = null;
        selectedId = null;
        draggingNode = null;
        if (playHint) {
          playHint.classList.remove('is-visible');
          playHint.hidden = true;
        }
      }
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 150);
  });

  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseleave', () => {
    mouse.active = false;
    if (!sketchMode) linkPreview = null;
  });

  document.addEventListener(
    'pointerdown',
    (e) => {
      if (sketchMode) {
        if (isInteractiveTarget(e.target)) return;
        onPointerDown(e);
        return;
      }
      if (!e.shiftKey) return;
      if (isInteractiveTarget(e.target)) return;
      onPointerDown(e);
    },
    true
  );

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  if (sketchToggle) {
    sketchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setSketchMode(!sketchMode);
    });
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible && !animationId) {
      animationId = requestAnimationFrame(tick);
    }
    if (!isVisible && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });

  start();
}

function initCustomCursor() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!cursorDot || !cursorRing || prefersReducedMotion || isTouch) {
    return;
  }

  document.body.classList.add('cursor-enabled');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  const lerp = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  const hoverTargets =
    'a, button, .btn, .project-link, .view-btn, .contact-item, .hamburger, .back-to-top, .bg-sketch-toggle, input, textarea, select, label';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverTargets);
    if (target) cursorRing.classList.add('is-hover');
  });

  document.addEventListener('mouseout', (e) => {
    const related = e.relatedTarget;
    if (!related || !related.closest(hoverTargets)) {
      cursorRing.classList.remove('is-hover');
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * lerp;
    ringY += (mouseY - ringY) * lerp;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }

  animateRing();
}

function initNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length) return;

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

function initBackToTop() {
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    backToTopBtn.classList.toggle('is-visible', window.scrollY > 400);
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function applyRevealStagger(group, step = 0.08, maxDelay = 1.2) {
  const children = group.querySelectorAll(':scope > .reveal-child');
  children.forEach((child, index) => {
    const delay = Math.min(index * step, maxDelay);
    child.style.setProperty('--reveal-delay', `${delay}s`);
  });
}

function initScrollReveal() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.section-reveal, .reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  document.querySelectorAll('.reveal-group').forEach((group) => {
    applyRevealStagger(group);
    revealObserver.observe(group);
  });
}

function initializeEventListeners() {
  hamburger.addEventListener('click', toggleMobileNav);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  languageFilter.addEventListener('change', filterRepositories);
  sortRepos.addEventListener('change', sortRepositories);
  gridViewBtn.addEventListener('click', () => toggleView('grid'));
  listViewBtn.addEventListener('click', () => toggleView('list'));

  if (retryReposBtn) {
    retryReposBtn.addEventListener('click', loadRepositories);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
}

function toggleMobileNav() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
}

function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function fetchGitHub(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
  });

  if (!response.ok) {
    const err = new Error(`GitHub API error: ${response.status}`);
    err.status = response.status;
    if (response.status === 403) {
      err.message =
        'GitHub rate limit reached. Please try again in a few minutes or visit my profile directly.';
    } else if (response.status === 404) {
      err.message = 'GitHub user not found. Please check back later.';
    }
    throw err;
  }

  return response.json();
}

async function loadRepositories() {
  showLoading(true);
  hideError();
  projectsGrid.innerHTML = '';

  try {
    const repos = await fetchGitHub(
      `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`
    );

    repositories = repos.filter((repo) => !repo.fork && !repo.archived);
    await enrichReposWithLanguages(repositories);

    filteredRepos = [...repositories];
    updateLanguageFilter();
    sortRepositories();
  } catch (error) {
    console.error('Error loading repositories:', error);
    const message =
      error.message ||
      "We couldn't load GitHub repositories right now. Please try again in a few minutes, or visit my profile directly.";
    showError(message);
  } finally {
    showLoading(false);
  }
}

async function enrichReposWithLanguages(repos) {
  const concurrency = 6;

  async function attachLanguages(repo) {
    try {
      const breakdown = await fetchGitHub(
        `/repos/${GITHUB_USERNAME}/${repo.name}/languages`
      );
      repo.languages = Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name);
    } catch {
      repo.languages = repo.language ? [repo.language] : [];
    }
  }

  for (let i = 0; i < repos.length; i += concurrency) {
    await Promise.all(repos.slice(i, i + concurrency).map(attachLanguages));
  }
}

function getRepoLanguages(repo) {
  if (Array.isArray(repo.languages) && repo.languages.length) {
    return repo.languages;
  }
  return repo.language ? [repo.language] : [];
}

function buildLanguagesHtml(repo) {
  const languages = getRepoLanguages(repo);
  if (!languages.length) return '';

  return `<div class="project-languages">${languages
    .map((lang) => {
      const color = languageColors[lang] || '#858585';
      return `<span class="language-item">
          <span class="language-color" style="background-color: ${color}"></span>
          <span class="language-name">${escapeHtml(lang)}</span>
        </span>`;
    })
    .join('')}</div>`;
}

function updateLanguageFilter() {
  const languages = new Set();
  repositories.forEach((repo) => {
    getRepoLanguages(repo).forEach((lang) => languages.add(lang));
  });

  const sortedLanguages = Array.from(languages).sort();
  languageFilter.innerHTML =
    '<option value="">All Languages</option>' +
    sortedLanguages.map((lang) => `<option value="${lang}">${lang}</option>`).join('');
}

function filterRepositories() {
  const selectedLanguage = languageFilter.value;
  filteredRepos =
    selectedLanguage === ''
      ? [...repositories]
      : repositories.filter((repo) =>
          getRepoLanguages(repo).includes(selectedLanguage)
        );
  sortRepositories();
}

function sortRepositories() {
  const sortBy = sortRepos.value;

  filteredRepos.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'updated':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at);
    }
  });

  displayRepositories();
}

function displayRepositories() {
  if (filteredRepos.length === 0) {
    projectsGrid.innerHTML =
      '<div class="no-repos"><p>No public repositories match the current filters.</p></div>';
    return;
  }

  projectsGrid.innerHTML = filteredRepos.map(createRepositoryCard).join('');
  applyRevealStagger(projectsGrid);
  scanExpandableDescriptions(projectsGrid);
}

function getRepoDescription(repo) {
  const custom = REPO_DESCRIPTIONS[repo.name];
  if (custom) return custom;
  const fromGitHub = repo.description?.trim();
  if (fromGitHub) return fromGitHub;
  return null;
}

function isStaleHomepage(url) {
  return STALE_HOMEPAGE_PATTERNS.some((part) => url.includes(part));
}

function getRepoLiveLink(repo) {
  const custom = REPO_LIVE_LINKS[repo.name];
  if (custom) return custom;

  const homepage = repo.homepage?.trim();
  if (homepage && !isStaleHomepage(homepage)) {
    return { url: homepage, label: 'Live Demo' };
  }

  if (repo.has_pages) {
    return {
      url: `${GITHUB_PAGES_USER}/${repo.name}/`,
      label: 'Live Demo',
    };
  }

  return null;
}

function createRepositoryCard(repo) {
  const descriptionText = getRepoDescription(repo);
  const descriptionBlock = descriptionText
    ? buildDescriptionBlock(escapeHtml(descriptionText))
    : buildDescriptionBlock('', { empty: true });

  const languages = getRepoLanguages(repo);
  const languageHtml = buildLanguagesHtml(repo);
  const liveLink = getRepoLiveLink(repo);
  const liveLinkHtml = liveLink
    ? `<a href="${escapeHtml(liveLink.url)}" target="_blank" rel="noopener noreferrer" class="project-link project-link--live">
          <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          ${escapeHtml(liveLink.label)}
        </a>`
    : '';

  return `
    <article class="project-card card reveal-child" data-languages="${escapeHtml(languages.join(','))}">
      <div class="project-header">
        <h3 class="project-title">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a>
        </h3>
      </div>
      ${descriptionBlock}
      ${languageHtml}
      <div class="project-links">
        ${liveLinkHtml}
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link project-link--github">
          <i class="fab fa-github" aria-hidden="true"></i>
          GitHub
        </a>
      </div>
    </article>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function toggleView(view) {
  if (view === 'grid') {
    projectsGrid.classList.remove('list-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  } else {
    projectsGrid.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
  }
}

function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function showError(message) {
  const paragraph = errorMessage.querySelector('p');
  if (paragraph) paragraph.textContent = message;
  errorMessage.classList.remove('hidden');
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formStatus.classList.add('hidden');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      formStatus.textContent = 'Thanks! Your message was sent successfully.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch {
    formStatus.textContent =
      'Something went wrong. Please email me directly at david.foy89@gmail.com.';
    formStatus.className = 'form-status error';
  } finally {
    formStatus.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

console.log(
  '%c👋 Hey, you found the console!',
  'color: #1E3A5F; font-size: 16px; font-weight: bold;'
);
console.log(
  "%cI'm David Foy — let's build something together.",
  'color: #9090aa; font-size: 13px;'
);
console.log(
  '%c📧 [email protected] | 🔗 github.com/david-foy89',
  'color: #3D6B9E; font-size: 13px;'
);
