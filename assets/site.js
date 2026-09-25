/* Live previews: each .screen loads the real page in an iframe at desktop
   width and scales it down to fit. Frames load once they near the viewport. */
(function () {
  var DESKTOP = 1440;

  function fit(screen) {
    var iframe = screen.querySelector('iframe');
    var s = screen.clientWidth / DESKTOP;
    iframe.style.width = DESKTOP + 'px';
    iframe.style.height = (screen.clientHeight / s) + 'px';
    iframe.style.transform = 'scale(' + s + ')';
  }

  function load(screen, src) {
    var iframe = screen.querySelector('iframe');
    iframe.classList.remove('ready');
    iframe.onload = function () { iframe.classList.add('ready'); };
    iframe.src = src;
  }

  var ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { fit(e.target); }); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      load(e.target, e.target.dataset.src);
      io.unobserve(e.target);
    });
  }, { rootMargin: '300px' });

  document.querySelectorAll('.screen').forEach(function (screen) {
    if (screen.dataset.poster) screen.style.backgroundImage = 'url(' + screen.dataset.poster + ')';
    ro.observe(screen);
    io.observe(screen);
  });

  /* Switcher: swap which design runs inside a preview */
  document.querySelectorAll('.switch').forEach(function (sw) {
    var project = sw.closest('.project');
    var screen = project.querySelector('.screen');
    var open = project.querySelector('.preview .open');
    var url = project.querySelector('.chrome .url');
    sw.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sw.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', b === btn); });
        screen.dataset.src = btn.dataset.src;
        if (btn.dataset.poster) screen.style.backgroundImage = 'url(' + btn.dataset.poster + ')';
        load(screen, btn.dataset.src);
        open.href = btn.dataset.src;
        if (url) url.textContent = 'rohitabrahamgeorge.github.io' + btn.dataset.src;
      });
    });
  });
})();
