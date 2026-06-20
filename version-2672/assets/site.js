(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.mobile-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '×' : '☰';
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length && dots.length) {
    var current = 0;
    var show = function (index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show((current + 1) % slides.length);
    }, 5200);
  }

  var quickForm = document.querySelector('[data-quick-search]');
  if (quickForm) {
    quickForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = quickForm.querySelector('input');
      var value = input ? input.value.trim() : '';
      var suffix = value ? '?q=' + encodeURIComponent(value) : '';
      window.location.href = './search.html' + suffix;
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
  var empty = document.querySelector('[data-empty-state]');
  if (searchForm && cards.length) {
    var keywordInput = searchForm.querySelector('[name="q"]');
    var regionInput = searchForm.querySelector('[name="region"]');
    var typeInput = searchForm.querySelector('[name="type"]');
    var yearInput = searchForm.querySelector('[name="year"]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (keywordInput && q) {
      keywordInput.value = q;
    }
    var filter = function () {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var region = regionInput ? regionInput.value : '';
      var type = typeInput ? typeInput.value : '';
      var year = yearInput ? yearInput.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.year, card.dataset.genre, card.dataset.tags].join(' ').toLowerCase();
        var ok = true;
        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (region && card.dataset.region !== region) {
          ok = false;
        }
        if (type && card.dataset.type !== type) {
          ok = false;
        }
        if (year && card.dataset.year !== year) {
          ok = false;
        }
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    };
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      filter();
    });
    [keywordInput, regionInput, typeInput, yearInput].forEach(function (el) {
      if (el) {
        el.addEventListener('input', filter);
        el.addEventListener('change', filter);
      }
    });
    filter();
  }
})();
