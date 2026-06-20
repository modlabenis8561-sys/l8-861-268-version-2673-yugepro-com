(function () {
    var frame = document.querySelector('[data-video-frame]');
    var video = document.querySelector('[data-player]');
    var button = document.querySelector('[data-play-button]');

    if (!frame || !video || !button) {
        return;
    }

    var stream = video.getAttribute('data-stream');
    var hlsInstance = null;
    var loaded = false;

    function loadStream() {
        if (loaded || !stream) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            loaded = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
            loaded = true;
            return;
        }

        video.src = stream;
        loaded = true;
    }

    function playVideo() {
        loadStream();
        button.classList.add('is-hidden');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', playVideo);
    frame.addEventListener('click', function (event) {
        if (event.target === video && video.paused) {
            playVideo();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('is-hidden');
        }
    });
    video.addEventListener('ended', function () {
        button.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
