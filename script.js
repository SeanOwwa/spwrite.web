// Set current year in footer
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal: fade + rise elements in as they enter the viewport
(function scrollReveal() {
  var targets = document.querySelectorAll(
    ".card, .dl-card, .faq-item, .guide-step, .open-guide, .beta-note, .section > .container > h2, .section > .container > .section-sub"
  );
  if (!targets.length) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("reveal", "is-visible"); });
    return;
  }

  targets.forEach(function (el) { el.classList.add("reveal"); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(function (el) { observer.observe(el); });
})();

// Detect the visitor's OS and highlight the matching download card
(function detectOS() {
  const ua = navigator.userAgent;
  const platform = navigator.platform || "";
  let os = null;
  let label = null;

  if (/Mac|iPhone|iPad|iPod/.test(platform) || /Mac OS X/.test(ua)) {
    os = "mac";
    label = "macOS";
  } else if (/Win/.test(platform) || /Windows/.test(ua)) {
    os = "windows";
    label = "Windows";
  } else if (/Linux/.test(platform) || /Linux/.test(ua)) {
    os = "linux";
    label = "Linux";
  }

  if (os) {
    const card = document.querySelector('.dl-card[data-os="' + os + '"]');
    if (card) card.classList.add("highlight");

    const detected = document.getElementById("detected");
    if (detected && label) {
      detected.innerHTML =
        'Looks like you\u2019re on <strong>' + label + '</strong> — <a href="#download">get the ' + label + ' instructions</a>.';
    }
  }
})();
