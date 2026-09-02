/* =========================================================================
   May & May Law Firm PLLC — site behaviour
   -------------------------------------------------------------------------
   Loaded synchronously in <head> so the language is resolved before first
   paint (no flash of the wrong language). Everything that touches the DOM
   tree waits for DOMContentLoaded.

   The site is fully usable with JavaScript disabled: it stays in English,
   the navigation falls back to a plain list, and no content is hidden.
   ========================================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'mm-lang';
  var SUPPORTED = ['en', 'es'];
  var root = document.documentElement;

  /* --- 1. Language resolution (runs immediately) ------------------------ */
  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  function resolveLang() {
    var fromQuery = null;
    try {
      fromQuery = new URLSearchParams(window.location.search).get('lang');
    } catch (e) { /* very old browser */ }

    var candidates = [
      fromQuery,
      safeGet(STORAGE_KEY),
      (navigator.language || '').slice(0, 2).toLowerCase()
    ];

    for (var i = 0; i < candidates.length; i++) {
      var c = (candidates[i] || '').toLowerCase();
      if (SUPPORTED.indexOf(c) !== -1) return c;
    }
    return 'en';
  }

  function applyLang(lang, persist) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    if (persist) safeSet(STORAGE_KEY, lang);

    // Swap the document title, which lives outside the visible DOM.
    var titleEl = document.querySelector('title');
    if (titleEl) {
      var alt = titleEl.getAttribute('data-title-' + lang);
      if (alt) titleEl.textContent = alt;
    }

    // Swap the meta description so search results match the language.
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      var altDesc = desc.getAttribute('data-content-' + lang);
      if (altDesc) desc.setAttribute('content', altDesc);
    }

    // Attributes cannot hold paired <span>s, so alt / aria-label / placeholder
    // text ships as data-alt-*, data-label-* and data-ph-* twins.
    var ATTR_TWINS = { alt: 'alt', label: 'aria-label', ph: 'placeholder' };
    Object.keys(ATTR_TWINS).forEach(function (key) {
      var nodes = document.querySelectorAll('[data-' + key + '-' + lang + ']');
      for (var n = 0; n < nodes.length; n++) {
        nodes[n].setAttribute(ATTR_TWINS[key], nodes[n].getAttribute('data-' + key + '-' + lang));
      }
    });

    // Keep the toggle's pressed state in sync.
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        'aria-pressed',
        buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false'
      );
    }
  }

  root.classList.add('js');
  applyLang(resolveLang(), false);

  /* --- 2. Everything else ----------------------------------------------- */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    applyLang(root.getAttribute('data-lang') || 'en', false);

    /* Language toggle ---------------------------------------------------- */
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var trigger = target.closest('[data-set-lang]');
      if (!trigger) return;
      event.preventDefault();
      applyLang(trigger.getAttribute('data-set-lang'), true);
    });

    /* Mobile navigation -------------------------------------------------- */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');

    function setNav(open) {
      if (!toggle || !nav) return;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.setAttribute('data-open', open ? 'true' : 'false');
      document.body.setAttribute('data-nav-open', open ? 'true' : 'false');
    }

    if (toggle && nav) {
      setNav(false);

      toggle.addEventListener('click', function () {
        setNav(toggle.getAttribute('aria-expanded') !== 'true');
      });

      nav.addEventListener('click', function (event) {
        var target = event.target;
        if (target && target.closest && target.closest('a')) setNav(false);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          setNav(false);
          toggle.focus();
        }
      });

      var wide = window.matchMedia('(min-width: 1041px)');
      var onWide = function (mq) { if (mq.matches) setNav(false); };
      if (wide.addEventListener) wide.addEventListener('change', onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }

    /* Sticky header shadow ----------------------------------------------- */
    var header = document.querySelector('.site-header');
    if (header) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
      document.body.insertBefore(sentinel, document.body.firstChild);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          header.setAttribute('data-stuck', entries[0].isIntersecting ? 'false' : 'true');
        }).observe(sentinel);
      }
    }

    /* Scroll reveal ------------------------------------------------------ */
    var reveals = document.querySelectorAll('.reveal');

    function revealAll() {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-visible'); });
    }

    if (reveals.length && 'IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });

      Array.prototype.forEach.call(reveals, function (el) { revealObserver.observe(el); });

      // Failsafe. This animation is decoration; text on a law firm's website is
      // not. If the observer never fires for any reason, show everything anyway
      // rather than leave a section permanently blank.
      window.setTimeout(revealAll, 4000);
    } else {
      revealAll();
    }

    /* Current year in the footer ----------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    /* Contact form ------------------------------------------------------- *
     * The form posts to whatever endpoint is set in its `action` attribute.
     * Until an endpoint is configured (see README.md) the form short-circuits
     * to a pre-filled email so no enquiry is ever silently lost.            */
    var form = document.querySelector('[data-contact-form]');
    if (form) {
      form.addEventListener('submit', function (event) {
        var action = form.getAttribute('action') || '';
        if (action && action.indexOf('REPLACE_WITH') === -1) return; // real endpoint

        event.preventDefault();
        var data = new FormData(form);
        var lang = root.getAttribute('data-lang') === 'es' ? 'es' : 'en';
        var subjectPrefix = lang === 'es' ? 'Consulta desde el sitio web' : 'Website enquiry';
        var body = [];
        data.forEach(function (value, key) {
          if (String(value).trim()) body.push(key + ': ' + value);
        });

        window.location.href =
          'mailto:' + (form.getAttribute('data-fallback-email') || '') +
          '?subject=' + encodeURIComponent(subjectPrefix) +
          '&body=' + encodeURIComponent(body.join('\n'));
      });
    }
  });
})();
