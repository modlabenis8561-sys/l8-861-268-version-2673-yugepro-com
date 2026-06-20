(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-menu");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            var opened = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function setupHero() {
        var carousel = document.querySelector(".hero-carousel");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll(".hero-dot"));
        var prev = carousel.querySelector(".hero-prev");
        var next = carousel.querySelector(".hero-next");
        var index = 0;
        var timer;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function restart() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });
        restart();
    }

    function setupFilters() {
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        if (!cards.length) {
            return;
        }
        var search = document.getElementById("site-search");
        var type = document.getElementById("filter-type");
        var region = document.getElementById("filter-region");
        var year = document.getElementById("filter-year");
        var category = document.getElementById("filter-category");
        var empty = document.getElementById("empty-results");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");

        if (query && search) {
            search.value = query;
        }

        function valueOf(select) {
            return select ? select.value.trim() : "";
        }

        function filter() {
            var q = search ? search.value.trim().toLowerCase() : "";
            var selectedType = valueOf(type);
            var selectedRegion = valueOf(region);
            var selectedYear = valueOf(year);
            var selectedCategory = valueOf(category);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || "").toLowerCase();
                var ok = true;
                if (q && haystack.indexOf(q) === -1) {
                    ok = false;
                }
                if (selectedType && card.getAttribute("data-type") !== selectedType) {
                    ok = false;
                }
                if (selectedRegion && card.getAttribute("data-region") !== selectedRegion) {
                    ok = false;
                }
                if (selectedYear && card.getAttribute("data-year") !== selectedYear) {
                    ok = false;
                }
                if (selectedCategory && card.getAttribute("data-category") !== selectedCategory) {
                    ok = false;
                }
                card.classList.toggle("is-hidden", !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [search, type, region, year, category].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filter);
        });
        filter();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();

function setupMoviePlayer(videoId, buttonId, streamUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var loaded = false;

    if (!video || !button || !streamUrl) {
        return;
    }

    function load() {
        if (loaded) {
            return Promise.resolve();
        }
        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            video.hlsInstance = hls;
            return Promise.resolve();
        }

        video.src = streamUrl;
        return Promise.resolve();
    }

    function play() {
        button.classList.add("is-playing");
        load().then(function () {
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    button.classList.remove("is-playing");
                });
            }
        });
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
    video.addEventListener("play", function () {
        button.classList.add("is-playing");
    });
    video.addEventListener("pause", function () {
        if (!video.ended) {
            button.classList.remove("is-playing");
        }
    });
}
