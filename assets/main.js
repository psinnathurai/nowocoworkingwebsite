(function () {
  var doc = document.documentElement;
  var isEN = (doc.lang || "").indexOf("en") === 0;

  var toggle = document.querySelector(".hamburger");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };
    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  var feats = document.querySelectorAll(".feature");
  if ("IntersectionObserver" in window && feats.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    feats.forEach(function (el) { io.observe(el); });
  } else {
    feats.forEach(function (el) { el.classList.add("in-view"); });
  }

  var tag = document.querySelector(".hero-tagline");
  if (tag) {
    tag.addEventListener("mouseenter", function () {
      tag.querySelectorAll(".tag-word").forEach(function (w) { w.classList.toggle("alt"); });
    });
  }

  var badge = document.getElementById("avail-badge");
  if (badge) {
    var render = function (d) {
      var free = d.free > 0;
      badge.title = isEN ? (d.checked_in + " of " + d.total + " occupied") : (d.checked_in + " von " + d.total + " belegt");
      badge.innerHTML = '<span class="avail-dot" style="background:' + (free ? "#2E7D46" : "#C0392B") + '"></span><span class="avail-text">' +
        (free ? d.free + (isEN ? " desks free" : " Plätze frei") : (isEN ? "Fully booked" : "Ausgebucht")) + "</span>";
    };
    var load = function () {
      fetch("https://nowocoworkingspace-dkcscqdjdsbnhveu.westeurope-01.azurewebsites.net/api/availability")
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function (d) { if (d && typeof d.free === "number") render(d); })
        .catch(function () {});
    };
    load();
    setInterval(load, 60000);
  }
})();

/* Cookie-Hinweis */
(function () {
  var KEY = 'nowo-consent';
  var en = (document.documentElement.lang || '').indexOf('en') === 0;
  var priv = en ? '../datenschutz.html#ga' : 'datenschutz.html#ga';
  if (/\/(impressum|datenschutz)\.html$/.test(location.pathname)) priv = 'datenschutz.html#ga';
  var T = en
    ? { text: 'We use Google Analytics to improve this website. It only runs if you accept.', more: 'Privacy policy', yes: 'Accept', no: 'Decline' }
    : { text: 'Wir nutzen Google Analytics, um die Website zu verbessern. Es läuft nur, wenn du zustimmst.', more: 'Datenschutz', yes: 'Akzeptieren', no: 'Ablehnen' };
  var bar;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function hide() { if (bar) { bar.remove(); bar = null; } }
  function show() {
    if (bar) return;
    bar = document.createElement('div');
    bar.className = 'consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', en ? 'Cookie notice' : 'Cookie-Hinweis');
    bar.innerHTML = '<p class="consent-text">' + T.text + ' <a href="' + priv + '">' + T.more + '</a></p>' +
      '<div class="consent-actions"><button type="button" class="btn btn-primary" data-c="granted">' + T.yes + '</button>' +
      '<button type="button" class="btn btn-secondary" data-c="denied">' + T.no + '</button></div>';
    bar.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-c');
      if (!v) return;
      var was = get();
      set(v); hide();
      if (v === 'denied' && window.nowoResetMaps) window.nowoResetMaps();
      if (v === 'granted' && window.nowoLoadGA) window.nowoLoadGA();
      if (v === 'denied' && was === 'granted') location.reload();
    });
    document.body.appendChild(bar);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-consent-open]')) { e.preventDefault(); show(); }
  });
  if (!get()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
  }
})();

/* Google-Maps-Freigabe */
(function () {
  var KEY = 'nowo-maps';
  function load(g) {
    var f = document.createElement('iframe');
    f.className = 'loc-map'; f.title = g.getAttribute('data-map-title') || 'Google Maps';
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = g.getAttribute('data-map-src');
    g.replaceWith(f);
  }
  function all() { document.querySelectorAll('.map-gate').forEach(load); }
  try { if (localStorage.getItem(KEY) === 'granted') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all(); } } catch (e) {}
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-map-load]');
    if (!b) return;
    if (b.getAttribute('data-map-load') === 'always') { try { localStorage.setItem(KEY, 'granted'); } catch (x) {} }
    var g = b.closest('.map-gate'); if (g) load(g);
  });
  window.nowoResetMaps = function () { try { localStorage.removeItem(KEY); } catch (e) {} };
})();

/* Kontaktformular + Firmenanfrage → Backend (ALTCHA, Honeypot, Zeitstempel) */
(function () {
  var API = 'https://func-contact-nowo-prd-szn-01.azurewebsites.net/api/contact';
  var renderedAt = Date.now();
  var MIN_AGE = 3500; // Backend verwirft Challenges, die jünger als 3 s sind
  var MAIL = 'hello@nowo.space';
  var en = (document.documentElement.lang || '').indexOf('en') === 0;
  var T = en
    ? { ok: "Thanks for your message! We'll get back to you as soon as possible.",
        err: 'Your message could not be sent. Please try again or email us directly at ' }
    : { ok: 'Danke für deine Nachricht! Wir melden uns so schnell wie möglich.',
        err: 'Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut oder schreibe uns direkt an ' };

  function val(form, n) { var el = form.elements[n]; return el ? String(el.value || '') : ''; }

  function wire(form, buildMessage) {
    var btn = form.querySelector('button[type="submit"]');
    var widget = form.querySelector('altcha-widget');
    var status = form.querySelector('.form-status');
    var state = 'unverified', payload = '', verifyStart = Date.now(), busy = false;

    function sync() { if (btn) btn.disabled = busy || state !== 'verified'; }
    function clear() { if (status) { status.textContent = ''; status.className = 'form-status full'; } }
    function show(kind) {
      if (!status) return;
      clear();
      status.classList.add(kind === 'ok' ? 'is-ok' : 'is-err');
      if (kind === 'ok') { status.textContent = T.ok; return; }
      status.appendChild(document.createTextNode(T.err));
      var a = document.createElement('a'); a.href = 'mailto:' + MAIL; a.textContent = MAIL;
      status.appendChild(a);
      status.appendChild(document.createTextNode('.'));
    }
    function freshChallenge() {
      payload = ''; state = 'unverified'; sync();
      if (!widget) return;
      try {
        if (typeof widget.reset === 'function') widget.reset();
        if (typeof widget.verify === 'function') widget.verify(); // sofort neu lösen, kein Klick-Flow
      } catch (e) {}
    }

    sync();
    if (widget) {
      widget.addEventListener('statechange', function (ev) {
        var d = ev.detail || {};
        state = d.state || 'unverified';
        if (state === 'verifying') verifyStart = Date.now();
        if (state === 'verified') payload = d.payload || '';
        if (state === 'expired') { freshChallenge(); return; }
        if (state === 'error') show('err');
        sync();
      });
      if (window.customElements) {
        var t = setTimeout(function () { if (!customElements.get('altcha-widget')) show('err'); }, 10000);
        customElements.whenDefined('altcha-widget').then(function () { clearTimeout(t); });
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy || state !== 'verified') return;
      busy = true; sync(); clear();
      if (btn) btn.setAttribute('aria-busy', 'true');
      form.setAttribute('aria-busy', 'true');

      var hidden = form.querySelector('input[name="altcha"]');
      var data = {
        name: val(form, 'name').trim(),
        email: val(form, 'email').trim(),
        message: buildMessage(form).slice(0, 5000),
        lang: en ? 'en' : 'de',
        website: val(form, 'website'),
        formRenderedAt: renderedAt,
        altcha: (hidden && hidden.value) || payload
      };
      var wait = Math.max(0, verifyStart + MIN_AGE - Date.now());
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer;

      new Promise(function (r) { setTimeout(r, wait); })
        .then(function () {
          if (ctrl) timer = setTimeout(function () { ctrl.abort(); }, 20000);
          return fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'omit',
            signal: ctrl ? ctrl.signal : undefined
          });
        })
        .then(function (r) { return r.status === 200; }, function () { return false; })
        .then(function (ok) {
          clearTimeout(timer);
          busy = false;
          if (btn) btn.removeAttribute('aria-busy');
          form.removeAttribute('aria-busy');
          if (ok) form.reset();
          show(ok ? 'ok' : 'err');
          freshChallenge(); // jede Challenge ist nur einmal verwendbar
        });
    });
  }

  var contact = document.getElementById('contact-form');
  if (contact) wire(contact, function (f) { return val(f, 'message'); });

  var b2b = document.getElementById('b2b-form');
  if (b2b) wire(b2b, function (f) {
    return [
      'Firmenanfrage',
      'Firma: ' + val(f, 'company').trim(),
      'Telefon: ' + (val(f, 'phone').trim() || '-'),
      'Personen: ' + val(f, 'people'),
      'Bedarf: ' + (val(f, 'need').trim() || '-')
    ].join('\n');
  });
})();
