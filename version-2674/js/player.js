import { H as Hls } from '../assets/video-vendor-dru42stk.js';

var players = Array.prototype.slice.call(document.querySelectorAll('.hls-player'));

function prepare(video) {
  if (!video || video.dataset.ready === '1') {
    return Promise.resolve(video);
  }

  var streamUrl = video.getAttribute('data-stream');
  if (!streamUrl) {
    return Promise.resolve(video);
  }

  video.dataset.ready = '1';

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl;
    return Promise.resolve(video);
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    video._hls = hls;
    return Promise.resolve(video);
  }

  video.src = streamUrl;
  return Promise.resolve(video);
}

players.forEach(function (video) {
  var frame = video.closest('.video-frame');
  var button = frame ? frame.querySelector('.player-start') : null;

  function playNow() {
    prepare(video).then(function () {
      if (frame) {
        frame.classList.add('is-ready');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (frame) {
            frame.classList.remove('is-ready');
          }
        });
      }
    });
  }

  if (button) {
    button.addEventListener('click', playNow);
  }

  video.addEventListener('play', function () {
    if (frame) {
      frame.classList.add('is-ready');
    }
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && frame) {
      frame.classList.remove('is-ready');
    }
  });
});
