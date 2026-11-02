/* =========================================================================
   MITGLIEDER-LOGOS  ·  «Sie arbeiten im Nowo» / «They work at Nowo»
   -------------------------------------------------------------------------
   Pflege: nur diese Liste bearbeiten. Reihenfolge = Anzeige-Reihenfolge.
   Pflichtfelder:
   - name:  Firmenname (wird auch als Alt-Text verwendet)
   - logo:  Dateiname im Ordner assets/logos/  (null = Name wird als Text
            gezeigt, bis die Logo-Datei vorliegt)
   - url:   Website der Firma (öffnet in neuem Tab)
   Optionale Felder:
   - scale:    optischer Ausgleich der Höhe, z. B. 1.25 für runde/quadratische
               Logos, 0.85 für sehr wuchtige (Standard 1)
   - plate:    "dark" = dunkle Fläche hinter dem Logo (für Logos mit weisser Schrift)
   - quote_de / quote_en / author: Testimonial, erscheint als Karte beim Hovern
   Eintrag entfernen (z. B. wenn ein Mitglied die Zustimmung zurückzieht):
   Zeile bzw. Block löschen, optional die Datei in assets/logos/ ebenfalls löschen.
   ========================================================================= */
var NOWO_MEMBER_LOGOS = [
  { name: "AdVision",          logo: "advision.svg",         url: "https://advision.swiss" },
  { name: "Hechenbros",        logo: "hechenbros.svg",       url: "https://hechenbros.ch",
    author: "Klemens",
    quote_de: "Das Nowo ist für mich der ideale Mix aus professionellem Arbeitsplatz und entspannter Atmosphäre: schnelle Verbindung, gute Arbeitsplätze, genügend Parkplätze, Rückzugsmöglichkeiten für Calls und Kaffee, der den Namen verdient. Dazu kommen Leute, von denen man nebenbei noch etwas lernt.",
    quote_en: "For me, Nowo is the ideal mix of a professional workplace and a relaxed atmosphere: a fast connection, good desks, plenty of parking, quiet spots for calls and coffee worthy of the name. Plus people you learn something from along the way." },
  { name: "assopersonal",      logo: "assopersonal.png",     url: "https://www.assopersonal.ch" },
  { name: "5th Era",           logo: "5th-era.png",          url: "https://5th-era.nl/HOME/", scale: 1.3,
    author: "Julian",
    quote_de: "Wenn ich in der Schweiz bin, komme ich immer gerne zu Nowo. Freundliche Führung, vielseitige Nutzungsmöglichkeiten und hilfsbereite Coworker, die gerne mitdenken und unterstützen. Eine rundum angenehme Atmosphäre!",
    quote_en: "Whenever I'm in Switzerland, I always enjoy coming to Nowo. Friendly management, lots of ways to use the space and helpful coworkers who are happy to think along and lend a hand. A thoroughly pleasant atmosphere!" },
  { name: "oceanleaf",         logo: "oceanleaf.png",        url: "https://oceanleaf.ch" },
  { name: "SXP Consulting",    logo: "sxp-consulting.svg",   url: "https://sxp-consulting.ch/", scale: 0.9 },
  { name: "baseVISION",        logo: "basevision.png",       url: "https://www.basevision.ch" },
  { name: "NDynamics",         logo: null,                   url: "https://www.ndynamics.ch",
    author: "Nando",
    quote_de: "Wer auf moderne Einrichtung steht, ist im Nowo bestens bedient. Offene Menschen, eine tolle Atmosphäre und dank CleverKey rund um die Uhr Zugang, das schätze ich besonders. Ein Tipp für jedermann.",
    quote_en: "If you like modern interiors, Nowo is the place for you. Open-minded people, a great atmosphere and round-the-clock access thanks to CleverKey, which I particularly appreciate. A tip for everyone." },
  { name: "Swiss Life Select", logo: "swisslife-select.png", url: "https://www.swisslife-select.ch" },
  { name: "Studio Paolo Vaccariello", logo: null,            url: "https://www.paolovaccariello.com" },
  { name: "TC Training",       logo: "tc-training.png",      url: "https://tc-training.fit", plate: "dark" },
  { name: "Netzwerk Rheintal", logo: "netzwerk-rheintal.png", url: "https://netzwerk-rheintal.ch/", scale: 1.15 }
];

/* Ab hier nichts ändern. */
(function () {
  var script = document.currentScript;
  var base = new URL("logos/", script ? script.src : location.href).href;
  var lang = (document.documentElement.lang || "de").slice(0, 2) === "en" ? "en" : "de";
  var visitLabel = lang === "en" ? "Visit website" : "Website besuchen";
  var bubble = '<svg class="logos-hint" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var uid = 0;

  function quoteOf(m) { return m["quote_" + lang] || m.quote_de || null; }

  function item(m, idx, hidden, descId) {
    var li = document.createElement("li");
    li.className = "logos-item";
    var a = document.createElement("a");
    a.href = m.url; a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("data-idx", idx);
    if (m.scale) a.style.setProperty("--logo-scale", m.scale);
    if (hidden) a.tabIndex = -1;
    if (m.plate === "dark") a.classList.add("has-plate");
    if (m.logo) {
      var img = document.createElement("img");
      img.src = base + m.logo; img.alt = m.name; img.decoding = "async";
      a.appendChild(img);
    } else {
      a.classList.add("logos-text"); a.textContent = m.name;
    }
    if (quoteOf(m)) {
      a.classList.add("has-quote");
      a.insertAdjacentHTML("beforeend", bubble);
      if (descId) a.setAttribute("aria-describedby", descId);
    }
    li.appendChild(a);
    return li;
  }

  /* ---------- Testimonial-Karte (ausserhalb des Bandes, position: fixed) ---------- */
  function setupCard(root) {
    var card = document.createElement("div");
    card.className = "logos-card";
    card.setAttribute("role", "tooltip");
    card.id = "logos-card-" + (++uid);
    card.hidden = true;
    card.innerHTML = '<span class="logos-card-mark" aria-hidden="true">«</span><p class="logos-card-quote"></p>' +
      '<p class="logos-card-meta"></p><a class="logos-card-link" target="_blank" rel="noopener"></a><span class="logos-card-arrow" aria-hidden="true"></span>';
    document.body.appendChild(card);

    var current = null, closeT = null, hideT = null, lastPointer = "mouse";

    function place() {
      if (!current) return;
      var r = current.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
      var cw = card.offsetWidth, ch = card.offsetHeight, gap = 12, m = 12;
      var roomAbove = r.top - gap - m, roomBelow = vh - r.bottom - gap - m;
      var below = ch > roomAbove && (ch <= roomBelow || roomBelow > roomAbove);
      var top = below ? r.bottom + gap : r.top - ch - gap;
      var clamped = Math.max(m, Math.min(top, vh - ch - m));
      card.classList.toggle("is-clamped", clamped !== top);
      top = clamped;
      var cx = r.left + r.width / 2;
      var left = Math.min(Math.max(cx - cw / 2, m), vw - cw - m);
      card.style.left = left + "px"; card.style.top = top + "px";
      card.style.setProperty("--arrow-x", Math.min(Math.max(cx - left, 16), cw - 16) + "px");
      card.classList.toggle("is-below", below);
    }

    function open(a) {
      clearTimeout(closeT); clearTimeout(hideT);
      var m = NOWO_MEMBER_LOGOS[+a.getAttribute("data-idx")];
      if (current !== a) {
        card.querySelector(".logos-card-quote").textContent = quoteOf(m);
        card.querySelector(".logos-card-meta").textContent = m.author + " · " + m.name;
        var link = card.querySelector(".logos-card-link");
        link.href = m.url; link.textContent = visitLabel + " ↗";
      }
      current = a;
      root.classList.add("is-paused");
      card.hidden = false;
      place();
      requestAnimationFrame(function () { card.classList.add("is-open"); });
    }
    function close() {
      clearTimeout(closeT);
      if (!current) return;
      current = null;
      root.classList.remove("is-paused");
      card.classList.remove("is-open");
      hideT = setTimeout(function () { if (!current) card.hidden = true; }, 160);
    }
    function closeSoon() { clearTimeout(closeT); closeT = setTimeout(close, 250); }

    function quoteLink(e) {
      var a = e.target.closest && e.target.closest("a.has-quote");
      return a && root.contains(a) ? a : null;
    }

    root.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType || "mouse"; }, true);
    root.addEventListener("pointerover", function (e) {
      if (e.pointerType === "touch") return;
      var a = quoteLink(e); if (a) open(a);
    });
    root.addEventListener("pointerout", function (e) {
      if (e.pointerType === "touch") return;
      var a = quoteLink(e); if (a && !a.contains(e.relatedTarget)) closeSoon();
    });
    root.addEventListener("click", function (e) {
      var a = quoteLink(e);
      if (a && lastPointer !== "mouse" && current !== a) { e.preventDefault(); open(a); }
      lastPointer = "mouse";
    });
    root.addEventListener("focusin", function (e) { var a = quoteLink(e); if (a) open(a); });
    root.addEventListener("focusout", function (e) {
      if (!card.contains(e.relatedTarget) && quoteLink(e)) closeSoon();
    });
    card.addEventListener("pointerenter", function () { clearTimeout(closeT); });
    card.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") closeSoon(); });
    card.addEventListener("focusout", function (e) {
      if (!card.contains(e.relatedTarget) && e.relatedTarget !== current) closeSoon();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && current) { var a = current; close(); if (card.contains(document.activeElement)) a.focus(); }
    });
    document.addEventListener("pointerdown", function (e) {
      if (current && !card.contains(e.target) && !current.contains(e.target)) close();
    });
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return { close: close };
  }

  /* ---------- Band ---------- */
  function build(root) {
    if (root._card) root._card.close(); else root._card = setupCard(root);
    var vp = root.querySelector(".logos-viewport");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    vp.innerHTML = "";
    var track = document.createElement("div");
    track.className = "logos-track";
    vp.appendChild(track);

    // Zitate als Beschreibung für Screenreader (aria-describedby)
    var desc = document.createElement("div");
    desc.hidden = true;
    vp.appendChild(desc);
    var descIds = NOWO_MEMBER_LOGOS.map(function (m, i) {
      var q = quoteOf(m); if (!q) return null;
      var p = document.createElement("p");
      p.id = "logos-q-" + uid + "-" + i;
      p.textContent = "«" + q + "» " + m.author + " · " + m.name;
      desc.appendChild(p);
      return p.id;
    });

    var first = document.createElement("ul");
    first.className = "logos-set";
    track.appendChild(first);
    NOWO_MEMBER_LOGOS.forEach(function (m, i) { first.appendChild(item(m, i, false, descIds[i])); });
    if (reduce) { root.classList.add("is-static"); return; }
    root.classList.remove("is-static");

    var imgs = Array.prototype.slice.call(first.querySelectorAll("img"));
    Promise.all(imgs.map(function (i) { return i.decode ? i.decode().catch(function () {}) : null; }))
      .then(function () { fill(vp, track, first); });
  }

  function fill(vp, track, first) {
    // Liste wiederholen, bis eine Gruppe breiter als der Bildschirm ist, dann die
    // ganze Gruppe einmal duplizieren -> nahtlose Schleife bei -50 %.
    var guard = 0;
    while (first.scrollWidth < vp.clientWidth + 200 && guard++ < 10) {
      NOWO_MEMBER_LOGOS.forEach(function (m, i) { first.appendChild(item(m, i, true, null)); });
    }
    var copy = first.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("a").forEach(function (a) { a.tabIndex = -1; a.removeAttribute("aria-describedby"); });
    track.appendChild(copy);
    // Konstante Geschwindigkeit: 35 px pro Sekunde, unabhängig von der Anzahl Logos
    track.style.setProperty("--logos-dur", Math.max(20, first.scrollWidth / 35) + "s");
  }

  function init() {
    var roots = document.querySelectorAll("[data-member-logos]");
    roots.forEach(build);
    var w = window.innerWidth, t;
    window.addEventListener("resize", function () {
      if (window.innerWidth === w) return;
      w = window.innerWidth; clearTimeout(t);
      t = setTimeout(function () { roots.forEach(build); }, 200);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
