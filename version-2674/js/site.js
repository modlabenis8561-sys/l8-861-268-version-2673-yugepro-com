(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-local-filter]')).forEach(function (form) {
    var scope = form.closest('.section-wrap') || document;
    var input = form.querySelector('[data-filter-input]');
    var typeSelect = form.querySelector('[data-type-filter]');
    var list = scope.querySelector('[data-filter-list]');

    if (!list || !input) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    function applyFilter(event) {
      if (event) {
        event.preventDefault();
      }

      var keyword = input.value.trim().toLowerCase();
      var typeValue = typeSelect ? typeSelect.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-region'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' ').toLowerCase();
        var typeText = (card.getAttribute('data-type') || '').toLowerCase();
        var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchesType = !typeValue || typeText.indexOf(typeValue) !== -1;
        var showCard = matchesKeyword && matchesType;

        card.classList.toggle('is-hidden', !showCard);
        if (showCard) {
          visible += 1;
        }
      });

      var empty = list.querySelector('.empty-result');
      if (!visible && !empty) {
        empty = document.createElement('div');
        empty.className = 'empty-result';
        empty.textContent = '没有找到匹配的影片';
        list.appendChild(empty);
      } else if (visible && empty) {
        empty.remove();
      }
    }

    input.addEventListener('input', applyFilter);
    if (typeSelect) {
      typeSelect.addEventListener('change', applyFilter);
    }
    form.addEventListener('submit', applyFilter);
  });
})();
