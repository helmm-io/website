/* HELM MSP — motion layer.
   Restrained, on-brand movement: scroll-reveal (with per-element stagger),
   a hero load cascade and scroll-linked rotation of the helm-wheel motifs.
   No infinite loops.

   Robustness: the hidden/animated CSS states live under body.helm-anim,
   which we add ONLY after confirming requestAnimationFrame genuinely runs.
   Some embedded/preview iframes freeze the animation timeline (rAF never
   fires) even while reporting visibilityState:"visible" — there, CSS
   animations would stick at their first frame and strand content at
   opacity:0. By gating on a live rAF probe we guarantee content is always
   visible in those environments, and motion only engages where it can
   actually play. Fully disabled under prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    if (reduce) return;

    var engaged = false;
    requestAnimationFrame(function (t1) {
      requestAnimationFrame(function (t2) {
        if (engaged) return;
        if (t2 > t1) { engaged = true; enable(); }
      });
    });
  }

  function enable() {
    document.body.classList.add('helm-anim');

    var reveals = [];
    function scanReveals() {
      var nodes = document.querySelectorAll('[data-reveal]:not([data-reveal-bound])');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute('data-reveal-bound', '');
        reveals.push(nodes[i]);
      }
    }
    function revealCheck(frac) {
      if (!reveals.length) return;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var trigger = vh * frac;
      var groups = {};
      var remaining = [];
      for (var i = 0; i < reveals.length; i++) {
        var el = reveals[i];
        if (el.getBoundingClientRect().top < trigger) {
          el.classList.add('is-in');
          var g = el.getAttribute('data-reveal-group');
          if (g) groups[g] = true;
        } else {
          remaining.push(el);
        }
      }
      if (remaining.length) {
        var hasGroup = false;
        for (var k in groups) { hasGroup = true; break; }
        if (hasGroup) {
          var still = [];
          for (var j = 0; j < remaining.length; j++) {
            var e2 = remaining[j];
            var g2 = e2.getAttribute('data-reveal-group');
            if (g2 && groups[g2]) e2.classList.add('is-in');
            else still.push(e2);
          }
          remaining = still;
        }
      }
      reveals = remaining;
    }
    function revealAll() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var nodes = document.querySelectorAll('[data-reveal]:not(.helm-shown)');
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].getBoundingClientRect().top < vh) nodes[i].classList.add('helm-shown');
      }
      var hdr = document.querySelector('header[data-helm-header]');
      if (hdr) hdr.classList.add('helm-shown');
    }

    var wheels = [];
    function scanWheels() {
      wheels = Array.prototype.slice.call(document.querySelectorAll('[data-helm-wheel]'));
    }

    function rotateWheels() {
      var y = window.scrollY || window.pageYOffset || 0;
      for (var i = 0; i < wheels.length; i++) {
        var w = wheels[i];
        var base = w.getAttribute('data-wheel-base') || '';
        var speed = parseFloat(w.getAttribute('data-wheel-speed')) || 0.035;
        var rot = (y * speed) % 360;
        w.style.transform = (base ? base + ' ' : '') + 'rotate(' + rot.toFixed(2) + 'deg)';
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        revealCheck(0.72);
        rotateWheels();
        ticking = false;
      });
    }

    scanReveals();
    scanWheels();
    revealCheck(0.98);
    rotateWheels();

    var root = document.getElementById('root');
    if (root) {
      var mo = new MutationObserver(function () {
        scanReveals();
        scanWheels();
        revealCheck(0.98);
        rotateWheels();
      });
      mo.observe(root, { childList: true, subtree: true });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    rotateWheels();

    setTimeout(revealAll, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
