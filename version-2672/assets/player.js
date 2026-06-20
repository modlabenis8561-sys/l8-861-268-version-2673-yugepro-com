(function () {
  window.initMoviePlayer = function (videoId, coverId, url) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    if (!video || !cover || !url) {
      return;
    }
    var loaded = false;
    var load = function () {
      if (loaded) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
      video.controls = true;
    };
    var start = function () {
      load();
      cover.classList.add('is-hidden');
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    };
    cover.addEventListener('click', start);
    video.addEventListener('play', function () {
      cover.classList.add('is-hidden');
    });
  };
})();
