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
