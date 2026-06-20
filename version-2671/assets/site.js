
(function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function initMenu() {
    const toggle = $('[data-menu-toggle]');
    const nav = $('[data-nav-links]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
  }

  function initFilters() {
    $all('[data-filter-input]').forEach(function (input) {
      const targetSel = input.getAttribute('data-filter-target');
      const cards = $all(targetSel);
      if (!cards.length) return;
      const empty = input.getAttribute('data-filter-empty');
      const emptyNode = empty ? document.getElementById(empty) : null;
      input.addEventListener('input', function () {
        const q = input.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach(function (card) {
          const hay = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.tags, card.textContent]
            .join(' ')
            .toLowerCase();
          const ok = !q || hay.indexOf(q) !== -1;
          card.classList.toggle('hidden', !ok);
          if (ok) visible += 1;
        });
        if (emptyNode) emptyNode.classList.toggle('hidden', visible > 0);
      });
    });
  }

  function initPlayButtons() {
    $all('[data-play-button]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = document.getElementById(btn.getAttribute('data-play-button'));
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const video = target.querySelector('video');
        if (video && video.paused) {
          video.play().catch(function () {});
        }
      });
    });
  }

  function initSearchPage() {
    const results = document.getElementById('search-results');
    const input = document.getElementById('search-query');
    if (!results || !input || !window.MOVIES_INDEX) return;

    const url = new URL(window.location.href);
    const q = (url.searchParams.get('q') || '').trim();
    input.value = q;

    function render(list) {
      if (!list.length) {
        results.innerHTML = '<div class="story-card"><h2>没有找到匹配内容</h2><p>换一个关键词再试试，例如片名、年份、类型、地区或标签。</p></div>';
        return;
      }
      results.innerHTML = list.map(function (item) {
        return '<a class="result-card" href="' + item.href + '">' +
          '<div><p class="result-title">' + item.title + '</p><div class="result-sub">' +
          item.year + ' · ' + item.region + ' · ' + item.genre + '</div></div>' +
          '<span class="list-badge">' + item.type + '</span></a>';
      }).join('');
    }

    function filter() {
      const term = input.value.trim().toLowerCase();
      const list = window.MOVIES_INDEX.filter(function (item) {
        const hay = [item.title, item.region, item.genre, item.tags, item.summary, item.type].join(' ').toLowerCase();
        return !term || hay.indexOf(term) !== -1;
      }).slice(0, 120);
      render(list);
    }

    input.addEventListener('input', filter);
    filter();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initFilters();
    initPlayButtons();
    initSearchPage();
  });
})();
