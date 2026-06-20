(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = qs('[data-menu-toggle]');
        var menu = qs('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var prev = qs('[data-hero-prev]', hero);
        var next = qs('[data-hero-next]', hero);
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle('active', idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle('active', idx === current);
            });
        }

        function play() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            play();
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                show(idx);
                restart();
            });
        });
        show(0);
        play();
    }

    function attachVideo(video, src) {
        if (!video || !src || video.dataset.ready === '1') {
            return;
        }
        video.dataset.ready = '1';
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            video._hls = hls;
            return;
        }
        video.src = src;
    }

    function initPlayers() {
        qsa('[data-player]').forEach(function (shell) {
            var video = qs('video', shell);
            var trigger = qs('[data-play]', shell);
            if (!video || !trigger) {
                return;
            }
            var src = video.getAttribute('data-video-url');
            function start() {
                attachVideo(video, src);
                shell.classList.add('is-playing');
                video.controls = true;
                var attempt = video.play();
                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(function () {
                        video.muted = true;
                        video.play();
                    });
                }
            }
            trigger.addEventListener('click', start);
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                }
            });
        });
    }

    function escapeHtml(text) {
        return String(text || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function renderSearchResults(items) {
        var grid = qs('[data-search-results]');
        if (!grid) {
            return;
        }
        if (!items.length) {
            grid.innerHTML = '<div class="search-results-empty">没有找到匹配的影片</div>';
            return;
        }
        grid.innerHTML = items.slice(0, 120).map(function (item) {
            return [
                '<article class="movie-card">',
                '<a class="movie-card-link" href="./' + escapeHtml(item.file) + '">',
                '<figure class="poster-frame"><img class="poster-img" src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></figure>',
                '<div class="movie-card-body">',
                '<div class="movie-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.region) + '</span></div>',
                '<h2>' + escapeHtml(item.title) + '</h2>',
                '<p>' + escapeHtml(item.oneLine) + '</p>',
                '<div class="tag-row"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.genre) + '</span></div>',
                '</div>',
                '</a>',
                '</article>'
            ].join('');
        }).join('');
    }

    function initSearch() {
        var data = window.siteSearchData || [];
        var input = qs('[data-search-input]');
        var year = qs('[data-year-filter]');
        var type = qs('[data-type-filter]');
        var category = qs('[data-category-filter]');
        if (!input || !data.length) {
            return;
        }

        function apply() {
            var query = input.value.trim().toLowerCase();
            var selectedYear = year ? year.value : '';
            var selectedType = type ? type.value : '';
            var selectedCategory = category ? category.value : '';
            var results = data.filter(function (item) {
                var text = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine, item.category].join(' ').toLowerCase();
                if (query && text.indexOf(query) === -1) {
                    return false;
                }
                if (selectedYear && item.year !== selectedYear) {
                    return false;
                }
                if (selectedType && item.type !== selectedType) {
                    return false;
                }
                if (selectedCategory && item.categorySlug !== selectedCategory) {
                    return false;
                }
                return true;
            });
            renderSearchResults(results);
        }

        input.addEventListener('input', apply);
        [year, type, category].forEach(function (select) {
            if (select) {
                select.addEventListener('change', apply);
            }
        });
        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initPlayers();
        initSearch();
    });
})();
