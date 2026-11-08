(function () {
  'use strict';

  /* ----------------------------------------------------------
     Respect prefers-reduced-motion
     CSS handles the reduced case; JS bails early so observers
     and scroll handlers never run.
  ---------------------------------------------------------- */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ----------------------------------------------------------
     Scroll-reveal: single element (data-anim)
  ---------------------------------------------------------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  /* ----------------------------------------------------------
     Stagger children (data-anim-stagger)
     JS overrides the CSS nth-child delays so every child
     starts from 0 when the parent enters the viewport.
  ---------------------------------------------------------- */
  var staggerIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        Array.from(e.target.children).forEach(function (child, i) {
          setTimeout(function () {
            child.classList.add('is-visible');
          }, i * 85);
        });
        staggerIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('[data-anim]').forEach(function (el) {
    revealIO.observe(el);
  });
  document.querySelectorAll('[data-anim-stagger]').forEach(function (el) {
    staggerIO.observe(el);
  });

  /* ----------------------------------------------------------
     Header: show bottom border after scrolling past top
  ---------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ----------------------------------------------------------
     Hero image parallax (index page)
  ---------------------------------------------------------- */
  var heroImg = document.querySelector('.hero > img');
  if (heroImg) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = 'translateY(' + (scrollY * 0.18) + 'px)';
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Editorial section parallax (index page)
  ---------------------------------------------------------- */
  var editPhoto = document.querySelector('.editorial-photo img');
  if (editPhoto) {
    var editSection = editPhoto.closest('.editorial');
    var rafPending = false;
    var updateEditParallax = function () {
      rafPending = false;
      var rect = editSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var progress = 1 - (rect.top / window.innerHeight);
        editPhoto.style.transform = 'translateY(' + ((progress - 0.5) * -30) + 'px)';
      }
    };
    window.addEventListener('scroll', function () {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateEditParallax);
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     Page-transition fade-out before internal navigation
  ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) return;
    // Internal .html link
    e.preventDefault();
    document.body.style.transition = 'opacity 0.25s ease';
    document.body.style.opacity = '0';
    setTimeout(function () {
      window.location.href = href;
    }, 260);
  });

})();
