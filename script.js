// Set current year in footer
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
