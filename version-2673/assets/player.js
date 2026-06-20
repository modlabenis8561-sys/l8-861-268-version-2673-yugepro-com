var MoviePlayer = (function () {
    function mount(streamUrl) {
        var video = document.getElementById('movie-player');
        var trigger = document.querySelector('[data-player-trigger]');
        var started = false;
        var hls = null;

        if (!video || !trigger || !streamUrl) {
            return;
        }

        function attach() {
            if (started) {
                return;
            }
            started = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function play() {
            attach();
            trigger.classList.add('is-hidden');
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    trigger.classList.remove('is-hidden');
                });
            }
        }

        trigger.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (!started || video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            trigger.classList.add('is-hidden');
        });
        video.addEventListener('ended', function () {
            trigger.classList.remove('is-hidden');
        });
        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    return {
        mount: mount
    };
})();
