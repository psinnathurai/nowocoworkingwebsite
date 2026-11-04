/* =========================================================================
   REFERENZEN-SLIDER  ·  «Sie arbeiten im Nowo» / «They work at Nowo»
   -------------------------------------------------------------------------
   Pflege: nur diese Liste bearbeiten. Reihenfolge = Reihenfolge der Slides.
   Pflichtfelder:
   - name:  Firmenname (wird auch als Alt-Text verwendet)
   - logo:  Dateiname im Ordner assets/logos/  (null = Name wird als Text
            gezeigt, bis die Logo-Datei vorliegt)
   - url:   Website der Firma (öffnet in neuem Tab)
   Optionale Felder:
   - scale:    optischer Ausgleich der Höhe, z. B. 1.25 für runde/quadratische
               Logos, 0.85 für sehr breite (Standard 1)
   - plate:    "dark" = dunkle Fläche hinter dem Logo (für Logos mit weisser Schrift)
   - dim:      false = Logo immer in Originalfarbe (für sehr helle Logos)
   - quote_de / quote_en / author: Zitat, wird im Slide angezeigt
   Eintrag entfernen (z. B. wenn ein Mitglied die Zustimmung zurückzieht):
   Block löschen, optional die Datei in assets/logos/ ebenfalls löschen.
   ========================================================================= */
var NOWO_AUTOPLAY_MS = 5000; // Zeit pro Slide in Millisekunden

var NOWO_MEMBER_LOGOS = [
  { name: "Swiss Life Select", logo: "swisslife-select.png", url: "https://www.swisslife-select.ch" },
  { name: "Hechenbros",        logo: "hechenbros.svg",       url: "https://hechenbros.ch",
    author: "Klemens",
    quote_de: "Das Nowo ist für mich der ideale Mix aus professionellem Arbeitsplatz und entspannter Atmosphäre: schnelle Verbindung, gute Arbeitsplätze, genügend Parkplätze, Rückzugsmöglichkeiten für Calls und Kaffee, der den Namen verdient. Dazu kommen Leute, von denen man nebenbei noch etwas lernt.",
    quote_en: "For me, Nowo is the ideal mix of a professional workplace and a relaxed atmosphere: a fast connection, good desks, plenty of parking, quiet spots for calls and coffee worthy of the name. Plus people you learn something from along the way." },
  { name: "5th Era",           logo: "5th-era.png",          url: "https://5th-era.nl/HOME/", scale: 1.3,
    author: "Julian",
    quote_de: "Wenn ich in der Schweiz bin, komme ich immer gerne zu Nowo. Freundliche Führung, vielseitige Nutzungsmöglichkeiten und hilfsbereite Coworker, die gerne mitdenken und unterstützen. Eine rundum angenehme Atmosphäre!",
    quote_en: "Whenever I'm in Switzerland, I always enjoy coming to Nowo. Friendly management, lots of ways to use the space and helpful coworkers who are happy to think along and lend a hand. A thoroughly pleasant atmosphere!" },
  { name: "Studio Paolo Vaccariello", logo: null,            url: "https://paolovaccariello.ch",
    author: "Paolo Vaccariello",
    quote_de: "Als freischaffender Unternehmer finde ich im nowo Coworking Space in Widnau einen flexiblen, professionellen Arbeitsraum – rund um die Uhr und passend zu meinen Bedürfnissen.",
    quote_en: "As a freelance entrepreneur, I find a flexible, professional workspace at the nowo coworking space in Widnau – around the clock and suited to my needs." },
  { name: "Pixelliebe Studio", logo: "pixelliebe.png",       url: "https://pixelliebe.ch/", scale: 1.3,
    author: "Delia",
    quote_de: "Wunderbar, wenn man in der Umgebung ist und einen voll ausgestatteten Arbeitsplatz für zwischendurch oder langfristig sucht! Im NOWO findet man eine richtige Büroumgebung, in der es an nichts fehlt: von einer tollen Community, mit der man sich vernetzen kann, über Verpflegungsräume bis hin zu separaten Kabinen für wichtige Calls und Meetings ist alles vorhanden.",
    quote_en: "Wonderful if you're in the area and looking for a fully equipped workspace, whether for the odd day or the long term! At NOWO you'll find a proper office environment that lacks nothing: from a great community to network with, to kitchen and break areas, to separate booths for important calls and meetings, it's all there." },
  { name: "baseVISION",        logo: "basevision.png",       url: "https://www.basevision.ch" },
  { name: "SXP Consulting",    logo: "sxp-consulting.svg",   url: "https://sxp-consulting.ch/", scale: 0.9 },
  { name: "TC Training",       logo: "tc-training.png",      url: "https://tc-training.fit", plate: "dark" },
  { name: "NDynamics",         logo: null,                   url: "https://www.ndynamics.ch",
    author: "Nando",
    quote_de: "Wer auf moderne Einrichtung steht, ist im Nowo bestens bedient. Offene Menschen, eine tolle Atmosphäre und dank CleverKey rund um die Uhr Zugang, das schätze ich besonders. Ein Tipp für jedermann.",
    quote_en: "If you like modern interiors, Nowo is the place for you. Open-minded people, a great atmosphere and round-the-clock access thanks to CleverKey, which I particularly appreciate. A tip for everyone." },
  { name: "oceanleaf",         logo: "oceanleaf.png",        url: "https://oceanleaf.ch" },
  { name: "AdVision",          logo: "advision.svg",         url: "https://advision.swiss" },
  { name: "assopersonal",      logo: "assopersonal.png",     url: "https://www.assopersonal.ch" },
  { name: "Squaretech",        logo: "squaretech.png",       url: "https://squaretech.ch/", scale: 0.8 },
  { name: "EMTI Lifestyle GmbH", logo: "emti.png",          url: "https://emti-lifestyle.ch", scale: 0.85 },
  { name: "Netzwerk Rheintal", logo: "netzwerk-rheintal.png", url: "https://netzwerk-rheintal.ch/", scale: 1.15, dim: false }
];

/* Ab hier nichts ändern. */
(function () {
  var script = document.currentScript;
  var base = new URL("logos/", script ? script.src : location.href).href;
  var en = (document.documentElement.lang || "de").slice(0, 2) === "en";
  var T = en
    ? { visit: "Visit website", prev: "Previous reference", next: "Next reference", slide: "of", member: "Member of the Nowo community" }
    : { visit: "Website besuchen", prev: "Vorherige Referenz", next: "Nächste Referenz", slide: "von", member: "Mitglied der Nowo-Community" };
  var arrow = function (d) {
    return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="' +
      (d < 0 ? "M19 12H5M12 19l-7-7 7-7" : "M5 12h14M12 5l7 7-7 7") +
      '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>';
  };
  function quoteOf(m) { return (en ? m.quote_en : m.quote_de) || m.quote_de || null; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function slide(m, i, n) {
    var s = el("div", "refs-slide");
    s.setAttribute("role", "group");
    s.setAttribute("aria-roledescription", "slide");
    s.setAttribute("aria-label", (i + 1) + " " + T.slide + " " + n + ": " + m.name);

    var logo = el("a", "refs-logo");
    logo.href = m.url; logo.target = "_blank"; logo.rel = "noopener";
    if (m.scale) logo.style.setProperty("--logo-scale", m.scale);
    if (m.plate === "dark") logo.classList.add("has-plate");
    if (m.dim === false) logo.classList.add("no-dim");
    if (m.logo) {
      var img = el("img"); img.src = base + m.logo; img.alt = m.name; img.decoding = "async"; img.draggable = false;
      logo.appendChild(img);
    } else {
      logo.appendChild(el("span", "refs-logo-text", m.name));
    }
    s.appendChild(logo);

    var body = el("div", "refs-body");
    var q = quoteOf(m);
    if (q) {
      body.classList.add("has-quote");
      var bq = el("blockquote", "refs-quote");
      bq.appendChild(el("p", null, "«" + q + "»"));
      body.appendChild(bq);
      body.appendChild(el("p", "refs-meta", m.author + " · " + m.name));
    } else {
      body.appendChild(el("p", "refs-name", m.name));
      body.appendChild(el("p", "refs-meta", T.member));
    }
    var link = el("a", "refs-link", T.visit + " ↗");
    link.href = m.url; link.target = "_blank"; link.rel = "noopener";
    body.appendChild(link);
    s.appendChild(body);
    return s;
  }

  function build(root) {
    var list = NOWO_MEMBER_LOGOS, n = list.length;
    if (!n) { root.hidden = true; return; }
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("refs");
    root.setAttribute("aria-roledescription", "carousel");
    root.style.setProperty("--refs-ms", NOWO_AUTOPLAY_MS + "ms");

    // Steuerung im Kopf
    var head = root.querySelector(".logos-head");
    var headText = el("div", "logos-head-text");
    while (head.firstChild) headText.appendChild(head.firstChild);
    head.appendChild(headText);
    var ctrl = el("div", "refs-ctrl");
    var count = el("p", "refs-count"); count.setAttribute("aria-hidden", "true");
    var prev = el("button", "refs-btn"); prev.type = "button"; prev.innerHTML = arrow(-1); prev.setAttribute("aria-label", T.prev);
    var next = el("button", "refs-btn"); next.type = "button"; next.innerHTML = arrow(1); next.setAttribute("aria-label", T.next);
    ctrl.appendChild(count); ctrl.appendChild(prev); ctrl.appendChild(next);
    head.appendChild(ctrl);

    // Slides: Klon des letzten vorne, Klon des ersten hinten -> endlos ohne Sprung
    var vp = root.querySelector(".logos-viewport");
    vp.innerHTML = "";
    vp.setAttribute("aria-live", reduce ? "polite" : "off");
    var track = el("div", "refs-track");
    var real = list.map(function (m, i) { return slide(m, i, n); });
    var first = real[0].cloneNode(true), last = real[n - 1].cloneNode(true);
    [first, last].forEach(function (c) { c.setAttribute("aria-hidden", "true"); c.removeAttribute("role"); c.removeAttribute("aria-label"); c.removeAttribute("aria-roledescription"); });
    track.appendChild(last);
    real.forEach(function (s) { track.appendChild(s); });
    track.appendChild(first);
    vp.appendChild(track);
    var all = Array.prototype.slice.call(track.children);

    var bar = el("div", "refs-progress"); bar.setAttribute("aria-hidden", "true");
    var fillEl = el("span"); bar.appendChild(fillEl);
    root.appendChild(bar);
    if (reduce) bar.hidden = true;

    var pos = 1, busy = false;
    function setX(px, anim) {
      track.style.transition = anim && !reduce ? "" : "none";
      track.style.transform = "translate3d(calc(" + (-pos * 100) + "% + " + (px || 0) + "px),0,0)";
    }
    function sync() {
      var idx = ((pos - 1) % n + n) % n;
      count.textContent = pad(idx + 1) + " / " + pad(n);
      all.forEach(function (s, k) { var on = k === pos; s.inert = !on; s.classList.toggle("is-active", on); });
    }
    function go(p) {
      if (busy) return;
      pos = p; busy = !reduce;
      setX(0, true); sync();
      if (reduce) wrap();
    }
    function wrap() {
      busy = false;
      if (pos === 0) { pos = n; setX(0, false); sync(); }
      else if (pos === n + 1) { pos = 1; setX(0, false); sync(); }
    }
    track.addEventListener("transitionend", function (e) { if (e.target === track) wrap(); });

    // Autoplay
    var timer = null, hover = false, focus = false;
    function stop() { clearTimeout(timer); timer = null; root.classList.remove("is-playing"); }
    function start() {
      stop();
      if (reduce || hover || focus || document.hidden) return;
      void fillEl.offsetWidth; // Fortschrittsbalken neu starten
      root.classList.add("is-playing");
      timer = setTimeout(function () { go(pos + 1); start(); }, NOWO_AUTOPLAY_MS);
    }
    function manual(p) { go(p); start(); }
    prev.addEventListener("click", function () { manual(pos - 1); });
    next.addEventListener("click", function () { manual(pos + 1); });
    root.addEventListener("mouseenter", function () { hover = true; stop(); });
    root.addEventListener("mouseleave", function () { hover = false; start(); });
    root.addEventListener("focusin", function () { focus = true; stop(); });
    root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) { focus = false; start(); } });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    root.addEventListener("keydown", function (e) {
      if (e.target.closest(".refs-ctrl") || e.target.closest(".refs-slide")) {
        if (e.key === "ArrowLeft") { e.preventDefault(); manual(pos - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); manual(pos + 1); }
      }
    });

    // Wischen (Touch / Stift)
    var sx = 0, sy = 0, dx = 0, drag = false, moved = false, pid = null;
    vp.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" || busy) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0; drag = false; moved = false;
    });
    vp.addEventListener("pointermove", function (e) {
      if (e.pointerId !== pid) return;
      var mx = e.clientX - sx, my = e.clientY - sy;
      if (!drag && Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) { drag = true; moved = true; stop(); }
      if (drag) { dx = mx; setX(dx, false); }
    });
    function end(e) {
      if (e.pointerId !== pid) return;
      pid = null;
      if (!drag) return;
      drag = false;
      var th = Math.min(60, vp.clientWidth * 0.15);
      if (dx < -th) manual(pos + 1); else if (dx > th) manual(pos - 1); else { setX(0, true); start(); }
    }
    vp.addEventListener("pointerup", end);
    vp.addEventListener("pointercancel", end);
    vp.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);

    setX(0, false); sync(); start();
  }

  function init() { document.querySelectorAll("[data-member-logos]").forEach(build); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
