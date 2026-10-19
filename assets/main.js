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

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var subject = encodeURIComponent(isEN ? "Inquiry via nowo.space" : "Anfrage über nowo.space");
      var body = encodeURIComponent("Name: " + form.name.value + "\n" + (isEN ? "Email" : "E-Mail") + ": " + form.email.value + "\n\n" + form.message.value);
      window.location.href = "mailto:hello@nowo.space?subject=" + subject + "&body=" + body;
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

/* Firmenanfrage */
(function () {
  var f = document.getElementById('b2b-form');
  if (!f) return;
  var en = (document.documentElement.lang || '').indexOf('en') === 0;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var L = en ? ['Name', 'Company', 'Email', 'Phone', 'People', 'Needs'] : ['Name', 'Firma', 'E-Mail', 'Telefon', 'Personen', 'Bedarf'];
    var v = [f.name.value, f.company.value, f.email.value, f.phone.value, f.people.value, f.need.value];
    var body = L.map(function (k, i) { return k + ': ' + v[i]; }).join('\n');
    var subj = (en ? 'Company offer request: ' : 'Firmenanfrage: ') + f.company.value;
    window.location.href = 'mailto:hello@nowo.space?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });
})();
