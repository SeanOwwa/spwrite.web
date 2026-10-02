// Set current year in footer
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav: hamburger toggles the links dropdown
(function navToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  function close() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function open() {
    links.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (links.classList.contains("open")) close();
    else open();
  });

  // Close when a menu link is tapped
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") close();
  });

  // Close when tapping outside the nav
  document.addEventListener("click", function (e) {
    if (links.classList.contains("open") && !e.target.closest(".nav-inner")) close();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();

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
