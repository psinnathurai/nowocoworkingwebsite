(function () {
  document.documentElement.classList.add('js');
  var isDE = (document.documentElement.lang || 'de').indexOf('de') === 0;

  // Feature reveal on scroll
  var feats = document.querySelectorAll('#warum .feature');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.2 });
    feats.forEach(function (el) { io.observe(el); });
  } else { feats.forEach(function (el) { el.classList.add('in-view'); }); }

  // Hero tagline replay
  var tag = document.querySelector('.hero-tagline');
  if (tag) tag.addEventListener('mouseenter', function () {
    tag.querySelectorAll('.tag-word').forEach(function (w) { w.classList.toggle('alt'); });
  });

  // Mobile menu
  var burger = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () { menu.setAttribute('hidden', ''); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Contact form -> mailto
  var form = document.querySelector('form.form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var subject = encodeURIComponent(isDE ? 'Anfrage über nowo.space' : 'Inquiry via nowo.space');
    var body = encodeURIComponent('Name: ' + form.name.value + '\n' + (isDE ? 'E-Mail' : 'Email') + ': ' + form.email.value + '\n\n' + form.message.value);
    window.location.href = 'mailto:hello@nowo.space?subject=' + subject + '&body=' + body;
  });

  // Live availability badge
  var badge = document.querySelector('.avail-badge');
  function render(d) {
    if (!badge || !d || typeof d.free !== 'number') return;
    var free = d.free > 0;
    badge.title = isDE ? (d.checked_in + ' von ' + d.total + ' belegt') : (d.checked_in + ' of ' + d.total + ' taken');
    badge.innerHTML = '<span class="avail-dot" style="background:' + (free ? '#2E7D46' : '#C0392B') + '"></span>' +
      '<span class="avail-text">' + (free ? d.free + (isDE ? ' Plätze frei' : ' desks free') : (isDE ? 'Ausgebucht' : 'Fully booked')) + '</span>';
  }
  function load() {
    fetch('https://nowocoworkingspace-dkcscqdjdsbnhveu.westeurope-01.azurewebsites.net/api/availability')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(render).catch(function () {});
  }
  if (badge) { load(); setInterval(load, 60000); }
})();
