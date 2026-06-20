(function () {
    var mobileButton = document.querySelector('[data-mobile-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || input.value.trim() === '') {
                event.preventDefault();
            }
        });
    });

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var thumbs = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-thumb]'));
        var active = 0;
        var timer = null;

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === active);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === active);
            });
            thumbs.forEach(function (thumb, itemIndex) {
                thumb.classList.toggle('is-active', itemIndex === active);
            });
        }

        function start() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('mouseenter', function () {
                show(Number(thumb.getAttribute('data-hero-thumb')) || 0);
                start();
            });
        });

        show(0);
        start();
    }

    var panel = document.querySelector('[data-filter-panel]');
    var list = document.querySelector('[data-card-list]');
    if (panel && list) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var searchInput = panel.querySelector('[data-card-search]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var regionSelect = panel.querySelector('[data-filter-region]');
        var empty = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && searchInput) {
            searchInput.value = query;
        }

        function text(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();
        }

        function apply() {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var type = typeSelect ? typeSelect.value : '';
            var year = yearSelect ? yearSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var matched = true;
                if (keyword && text(card).indexOf(keyword) === -1) {
                    matched = false;
                }
                if (type && card.getAttribute('data-type') !== type) {
                    matched = false;
                }
                if (year && card.getAttribute('data-year') !== year) {
                    matched = false;
                }
                if (region && card.getAttribute('data-region') !== region) {
                    matched = false;
                }
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [searchInput, typeSelect, yearSelect, regionSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    }
})();
