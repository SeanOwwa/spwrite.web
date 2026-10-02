# Spwrite — landing page

A static GitHub Pages landing page for **Spwrite**, a calm, distraction-free
writing app built with Flutter. The site introduces the app, explains why it
exists and who makes it, points writers to a community, and lets them download
the ready-to-run app for their platform.

Spwrite is currently at **Beta v1.2.3**, free to use for every writer, and a new
build ships roughly **every two weeks**.

## Pages

- `index.html` — home (hero, features, download grid, community, support)
- `about.html` — why Spwrite exists, who builds it, and the free-to-use promise
- `mac.html` — step-by-step macOS install guide
- `windows.html` — step-by-step Windows install guide
- `styles.css` — navy + dark-cyan theme matching the app
- `script.js` — OS detection (highlights your platform's card) + footer year
- `assets/` — logo and favicon (`spwrite_logo.png` / `.jpeg`)
- `downloads/` — the actual app files served to visitors

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

### Updating the macOS download

`Spwrite.app` is a Flutter release build — a folder bundle, so it must be zipped
before it can be served (browsers and GitHub Pages can't download a raw `.app`).
From the `spwrite` project:

```bash
flutter build macos --release
# the app lands at:
#   build/macos/Build/Products/Release/Spwrite.app
cd build/macos/Build/Products/Release
ditto -c -k --sequesterRsrc --keepParent Spwrite.app Spwrite-macOS-v1.2.2.zip
```

Copy the resulting zip into `downloads/`. Download files are versioned
(`Spwrite-macOS-v1.2.2.zip`), so on each release bump the version in the filename
and update the matching link + `download` attribute in `mac.html`.
`--keepParent` ensures writers get `Spwrite.app` back when they unzip — matching
the steps shown on `mac.html`.

### Updating the Windows download

`Spwrite-v1.0.0.exe` is a single self-contained file, so just drop the new build
into `downloads/`. No zipping needed. As with macOS, name it with the new version
and update the link in `windows.html`.

> Note: the raw `downloads/Spwrite.app/` bundle is ignored via `.gitignore` — only
> the zipped release (`Spwrite-macOS-v1.2.2.zip`) is committed and served.

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
