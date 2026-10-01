// Changelog loader
// Reads update/versions.json (a list of version entries), fetches each markdown
// file from the update/ folder, and renders it. To publish a new release, add a
// markdown file to update/ and add an entry to update/versions.json.

(function loadChangelog() {
  var container = document.getElementById("changelog");
  if (!container) return;

  fetch("update/versions.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("Could not load versions.json (" + res.status + ")");
      return res.json();
    })
    .then(function (data) {
      var versions = (data && data.versions) || [];
      if (!versions.length) {
        container.innerHTML = '<p class="changelog-status">No releases yet. Check back soon.</p>';
        return;
      }
      // Fetch every version's markdown in parallel, keep original order.
      return Promise.all(
        versions.map(function (v) {
          return fetch("update/" + v.file, { cache: "no-store" })
            .then(function (res) {
              if (!res.ok) throw new Error("Missing " + v.file);
              return res.text();
            })
            .then(function (md) {
              return { meta: v, md: md };
            })
            .catch(function () {
              return { meta: v, md: null };
            });
        })
      ).then(function (entries) {
        renderEntries(container, entries);
      });
    })
    .catch(function (err) {
      container.innerHTML =
        '<p class="changelog-status">Couldn\u2019t load the changelog. ' +
        "If you're viewing this file directly, run a local server " +
        "(<code>python3 -m http.server</code>) \u2014 browsers block file reads otherwise.</p>";
      // Surface the real error in the console for debugging.
      if (window.console) console.error(err);
    });

  function renderEntries(root, entries) {
    root.innerHTML = "";
    entries.forEach(function (entry) {
      var el = document.createElement("article");
      el.className = "changelog-entry";

      var header = document.createElement("div");
      header.className = "changelog-head";

      var version = document.createElement("h2");
      version.className = "changelog-version";
      version.textContent = entry.meta.version || entry.meta.file;
      header.appendChild(version);

      if (entry.meta.date) {
        var date = document.createElement("span");
        date.className = "changelog-date";
        date.textContent = entry.meta.date;
        header.appendChild(date);
      }

      if (entry.meta.tag) {
        var tag = document.createElement("span");
        tag.className = "changelog-pill";
        tag.textContent = entry.meta.tag;
        header.appendChild(tag);
      }

      el.appendChild(header);

      var body = document.createElement("div");
      body.className = "changelog-body";
      if (entry.md == null) {
        body.innerHTML = '<p class="changelog-status">Notes for this version aren\u2019t available.</p>';
      } else {
        body.innerHTML = renderMarkdown(entry.md);
      }
      el.appendChild(body);

      root.appendChild(el);
    });
  }

  // Minimal, safe-ish Markdown renderer for changelog notes.
  // Supports: #/##/### headings, nested "-"/"*" bullet lists (by indentation),
  // **bold**, *italic*, `code`, [links](url), and paragraphs. Escapes HTML first.
  function renderMarkdown(src) {
    var lines = src.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var listDepth = 0; // number of currently-open <ul> levels

    function openTo(depth) {
      while (listDepth < depth) { html.push("<ul>"); listDepth++; }
    }
    function closeTo(depth) {
      while (listDepth > depth) { html.push("</ul>"); listDepth--; }
    }

    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/, "");
      if (!line.trim()) { closeTo(0); return; }

      var h = line.match(/^(#{1,3})\s+(.*)$/);
      if (h) {
        closeTo(0);
        var level = h[1].length;
        html.push("<h" + level + ">" + inline(h[2]) + "</h" + level + ">");
        return;
      }

      var li = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (li) {
        // Every 2 spaces of indent = one nesting level (depth starts at 1).
        var depth = Math.floor(li[1].replace(/\t/g, "  ").length / 2) + 1;
        if (depth > listDepth) openTo(depth);
        else if (depth < listDepth) closeTo(depth);
        html.push("<li>" + inline(li[2]) + "</li>");
        return;
      }

      closeTo(0);
      html.push("<p>" + inline(line.trim()) + "</p>");
    });

    closeTo(0);
    return html.join("\n");
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inline(text) {
    var s = escapeHtml(text);
    // `code`
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    // [label](url) — only allow http/https/relative, no javascript:
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
      if (/^\s*javascript:/i.test(url)) return label;
      var ext = /^https?:\/\//i.test(url);
      return (
        '<a href="' + url + '"' +
        (ext ? ' target="_blank" rel="noopener"' : "") +
        ">" + label + "</a>"
      );
    });
    // **bold**
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // *italic*
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return s;
  }
})();
