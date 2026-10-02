# Spwrite — landing page

A static GitHub Pages landing page for **Spwrite**, a calm, distraction-free
writing app built with Flutter. The site introduces the app, explains why it
exists and who makes it, points writers to a community, and lets them download
the ready-to-run app for their platform.

Spwrite is currently at **Beta v1.2.3**, free to use for every writer, and a new
build ships roughly **every two weeks**.

## Pages

- `index.html` — home (hero, features, on-device AI, download grid, community, support)
- `about.html` — why Spwrite exists, who builds it, and the free-to-use promise
- `mac.html` / `windows.html` / `linux.html` — step-by-step per-platform install guides
- `changelog.html` — release notes, rendered from `update/`
- `styles.css` — navy + dark-cyan theme matching the app
- `script.js` — OS detection, mobile nav toggle, mobile download gate, footer year
- `release.js` — fills download links/labels/sizes/checksums from `update/release.json`
- `changelog.js` — renders the changelog from `update/versions.json` + markdown files
- `assets/` — logo and favicon
- `downloads/` — the actual app files served to visitors
- `update/` — release manifest (`release.json`), changelog manifest (`versions.json`), and per-version notes

## How the downloads work

The app files are hosted **directly in this repo** under `downloads/`, so the
site serves them itself — no GitHub Release step required.

| Platform | Arch | File | Status |
| --- | --- | --- | --- |
| macOS | Apple Silicon (ARM64) | `downloads/Spwrite-macOS-v1.2.3.zip` | Available |
| Windows | Windows 11 · ARM64 | `downloads/Spwrite-Windows-v1.2.3.zip` | Available |
| Linux | Debian-based · ARM64 | `downloads/Spwrite-Linux-v1.2.3.zip` | Available |

All builds are **ARM64**. The home-page cards link to each platform's install
guide (`mac.html` / `windows.html` / `linux.html`), where the actual download
button lives. The single source of truth for versions, file names, sizes, and
checksums is `update/release.json` — update a platform's entry there (and drop the
file in `downloads/`) and every page updates automatically.

### Releasing a new build

Every platform ships as a **versioned `.zip`** (macOS `.app`, the Linux bundle,
and the Windows folder — which includes the Visual C++ runtime DLLs so it runs on
a fresh PC). Zip each with its parent folder so it unpacks cleanly:

```bash
ditto -c -k --sequesterRsrc --keepParent Spwrite.app  Spwrite-macOS-v1.2.3.zip
ditto -c -k --sequesterRsrc --keepParent Spwrite      Spwrite-Windows-v1.2.3.zip
ditto -c -k --sequesterRsrc --keepParent linux_app    Spwrite-Linux-v1.2.3.zip
```

Then, for each platform:

1. Drop the `.zip` in `downloads/`.
2. Get its size and checksum: `stat -f %z <file>` and `shasum -a 256 <file>`.
3. Update that platform's entry (version, date, file, fileName, size, sha256) in
   `update/release.json`, and bump `appVersion` if the whole app changed.
4. Add a changelog note in `update/` and list it in `update/versions.json`.

`update/release.json` is the single source of truth — `release.js` reads it and
updates every download link, version label, size, and checksum across the site.

> Note: raw build folders (`downloads/Spwrite.app/`, `linux_app/`, and the staged
> build folders) are ignored via `.gitignore` — only the zipped releases are
> committed and served.

## Analytics

The site uses [GoatCounter](https://seanless.goatcounter.com) for privacy-friendly,
cookie-free analytics. The counter script is included on every page, and download
buttons fire a GoatCounter **event** per platform/version (paths like
`download/mac/Beta-v1.2.3`), so download clicks can be tracked alongside page views.

- Dashboard: https://seanless.goatcounter.com
- GitHub Pages has no built-in analytics, so this is how views and downloads are measured.
- Counts come only from the **live site** (not local previews), and your own visits
  can be excluded via GoatCounter's ignore setting.

## Community & support

- **Discord** — https://discord.gg/KCWfmqGCNy (linked in the nav and footer, plus
  a "Join the community" section on the home page)
- **Coffee** — https://buymeacoffee.com/seanless (optional; never required and
  never unlocks anything — everything is free)

## Publish with GitHub Pages

Push the files, then **Settings → Pages → Deploy from a branch → main / root**.
The site redeploys automatically on every push to `main`.

```bash
git add .
git commit -m "Update landing page"
git push
```

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Credits

- **Seanless** — product direction, requirements, and review.
- **Kiro** — implementation and tooling.
