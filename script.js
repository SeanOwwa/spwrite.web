// Set current year in footer
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav: hamburger toggles the links dropdown
function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (!toggle || !links) return;
  if (toggle.dataset.bound === "1") return; // avoid double-binding
  toggle.dataset.bound = "1";

  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    links.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  // Use the button's click (fires for taps and clicks on the inner bars too)
  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (links.classList.contains("open")) closeMenu();
    else openMenu();
  });

  // Close when a menu link is tapped
  links.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest("a")) closeMenu();
  });

  // Close when tapping/clicking outside the nav
  document.addEventListener("click", function (e) {
    if (!links.classList.contains("open")) return;
    if (!e.target.closest || !e.target.closest(".nav-inner")) closeMenu();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
}

// Run now if the DOM is ready, otherwise wait for it.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavToggle);
} else {
  initNavToggle();
}

// Is the visitor on a phone or tablet? Spwrite is a desktop-only app.
function isMobileDevice() {
  var ua = navigator.userAgent || "";
  // iPadOS 13+ reports as "Mac" but has touch — catch it via maxTouchPoints.
  var iPadOS = /Mac/.test(ua) && navigator.maxTouchPoints > 1;
  return iPadOS || /Android|iPhone|iPad|iPod|Mobile|Tablet|BlackBerry|IEMobile|Opera Mini|webOS/i.test(ua);
}

// On mobile: hide the download grid and show a "desktop app" notice.
// Visitors can still reveal the downloads if they insist.
(function mobileGate() {
  var notice = document.getElementById("mobile-notice");
  var grid = document.getElementById("download-grid");
  var showBtn = document.getElementById("show-downloads-anyway");
  if (!notice || !grid) return;

  if (isMobileDevice()) {
    grid.hidden = true;
    notice.hidden = false;

    if (showBtn) {
      showBtn.addEventListener("click", function () {
        grid.hidden = false;
        notice.hidden = true;
      });
    }
  }
})();

// Detect the visitor's OS and highlight the matching download card (desktop only)
(function detectOS() {
  if (isMobileDevice()) return;

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
