
(function () {
  const HLS_CDN = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';

  function qs(sel, ctx = document) { return ctx.querySelector(sel); }
  function qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function initMobileNav() {
    const toggle = qs('[data-mobile-toggle]');
    const nav = qs('[data-mobile-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    qsa('[data-mobile-nav] a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  function initHeroSlider() {
    const hero = qs('[data-hero-slider]');
    if (!hero) return;
    const slides = qsa('[data-hero-slide]', hero);
    const dots = qsa('[data-hero-dot]', hero);
    const prev = qs('[data-hero-prev]', hero);
    const next = qs('[data-hero-next]', hero);
    if (slides.length <= 1) return;

    let index = 0;
    let timer = null;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => slide.classList.toggle('active', n === index));
      dots.forEach((dot, n) => dot.classList.toggle('active', n === index));
    };
    const start = () => {
      stop();
      timer = setInterval(() => show(index + 1), 5000);
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };

    prev && prev.addEventListener('click', () => { show(index - 1); start(); });
    next && next.addEventListener('click', () => { show(index + 1); start(); });
    dots.forEach((dot, n) => dot.addEventListener('click', () => { show(n); start(); }));

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function matchCard(card, query, region, type, year) {
    const title = (card.dataset.title || '').toLowerCase();
    const tags = (card.dataset.tags || '').toLowerCase();
    const genre = (card.dataset.genre || '').toLowerCase();
    const cardRegion = (card.dataset.region || '').toLowerCase();
    const cardType = (card.dataset.type || '').toLowerCase();
    const cardYear = (card.dataset.year || '').toLowerCase();
    const q = query.trim().toLowerCase();

    const okQuery = !q || title.includes(q) || tags.includes(q) || genre.includes(q);
    const okRegion = !region || region === 'all' || cardRegion.includes(region.toLowerCase());
    const okType = !type || type === 'all' || cardType.includes(type.toLowerCase());
    const okYear = !year || year === 'all' || cardYear === year;
    return okQuery && okRegion && okType && okYear;
  }

  function initFilters() {
    qsa('[data-filter-form]').forEach(form => {
      const input = qs('[data-filter-q]', form);
      const region = qs('[data-filter-region]', form);
      const type = qs('[data-filter-type]', form);
      const year = qs('[data-filter-year]', form);
      const reset = qs('[data-filter-reset]', form);
      const cards = qsa('[data-filter-card]', document);
      const empty = qs('[data-filter-empty]', document);

      const apply = () => {
        let visible = 0;
        cards.forEach(card => {
          const ok = matchCard(card, input ? input.value : '', region ? region.value : '', type ? type.value : '', year ? year.value : '');
          card.classList.toggle('hidden', !ok);
          if (ok) visible += 1;
        });
        if (empty) empty.classList.toggle('hidden', visible !== 0);
      };

      [input, region, type, year].forEach(el => el && el.addEventListener('input', apply));
      [input, region, type, year].forEach(el => el && el.addEventListener('change', apply));
      if (reset) reset.addEventListener('click', () => {
        if (input) input.value = '';
        if (region) region.value = 'all';
        if (type) type.value = 'all';
        if (year) year.value = 'all';
        apply();
      });
      apply();
    });
  }

  function loadHlsJs(callback) {
    if (window.Hls) { callback(); return; }
    const script = document.createElement('script');
    script.src = HLS_CDN;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function initPlayer() {
    const video = qs('[data-player-video]');
    if (!video) return;
    const stream = video.dataset.stream;
    if (!stream) return;

    const attachSource = () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }
      loadHlsJs(() => {
        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          window.__movieHls = hls;
        } else {
          video.src = stream;
        }
      });
    };
    attachSource();

    qsa('[data-copy-stream]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(stream);
          const old = btn.textContent;
          btn.textContent = '已复制播放地址';
          setTimeout(() => btn.textContent = old, 1500);
        } catch (e) {
          alert('复制失败，请手动复制播放地址。');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHeroSlider();
    initFilters();
    initPlayer();
  });
})();
