// Release wiring
// Reads update/release.json and fills in download links, file names, sizes,
// dates, checksums, and version labels across the site. To publish a new build
// for a platform, drop the file in downloads/ and update that platform's entry
// in update/release.json — every page updates automatically.

(function wireRelease() {
  var manifestEls = document.querySelectorAll("[data-release]");
  var versionEls = document.querySelectorAll("[data-app-version], [data-platform-version]");
  if (!manifestEls.length && !versionEls.length) return;

  fetch("update/release.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("release.json " + res.status);
      return res.json();
    })
    .then(function (data) {
      applyVersionLabels(data.appVersion);
      applyPlatformVersions(data.platforms || {});
      manifestEls.forEach(function (el) {
        var os = el.getAttribute("data-release");
        var info = data.platforms && data.platforms[os];
        if (info) renderPlatform(el, os, info);
      });
    })
    .catch(function (err) {
      if (window.console) console.error("Release wiring failed:", err);
    });

  // Fill any element with [data-app-version] (e.g. hero beta tag) from the manifest.
  function applyVersionLabels(appVersion) {
    if (!appVersion) return;
    document.querySelectorAll("[data-app-version]").forEach(function (el) {
      el.textContent = appVersion;
    });
  }

  // Fill [data-platform-version="windows"] with that platform's own build version.
  function applyPlatformVersions(platforms) {
    document.querySelectorAll("[data-platform-version]").forEach(function (el) {
      var os = el.getAttribute("data-platform-version");
      var info = platforms[os];
      if (info && info.version) el.textContent = info.version;
    });
  }

  function humanSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes >= 1024 * 1024 * 1024) return (bytes / 1073741824).toFixed(1) + " GB";
    if (bytes >= 1024 * 1024) return (bytes / 1048576).toFixed(0) + " MB";
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + " KB";
    return bytes + " B";
  }

  function shortHash(hash) {
    return hash ? hash.slice(0, 12) : "";
  }

  // A download card on the home page: data-release="mac|windows|linux".
  // Expected children: .dl-btn (anchor) and optional .dl-meta (filled in).
  function renderPlatform(el, os, info) {
    var btn = el.querySelector(".dl-btn");
    var meta = el.querySelector(".dl-meta");

    if (!info.available) {
      if (btn) {
        btn.setAttribute("aria-disabled", "true");
        btn.setAttribute("tabindex", "-1");
        btn.removeAttribute("href");
        if (!btn.textContent.trim()) btn.textContent = "Coming soon";
      }
      return;
    }

    if (btn) {
      btn.setAttribute("href", info.file);
      btn.setAttribute("download", info.fileName);
    }

    if (meta) {
      var bits = [];
      if (info.version) bits.push('<span class="dl-ver">' + info.version + "</span>");
      var sub = [];
      if (info.size) sub.push(humanSize(info.size));
      if (info.date) sub.push(info.date);
      if (sub.length) bits.push('<span class="dl-sub">' + sub.join(" · ") + "</span>");
      if (info.sha256) {
        bits.push(
          '<span class="dl-hash" title="SHA-256: ' + info.sha256 + '">' +
          "SHA-256 " + shortHash(info.sha256) + "…</span>"
        );
      }
      meta.innerHTML = bits.join("");
    }
  }
})();
