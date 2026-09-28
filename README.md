# Spwrite — landing page

A static GitHub Pages landing page for **Spwrite**, a calm, distraction-free
writing app built with Flutter. The page describes the app and gives writers two
ways to get it per platform: a ready-to-run **installer** and a **source**
download. It also has a "Buy me a coffee" support button.

## Files

- `index.html` — the page (hero, features, download, support)
- `styles.css` — navy + dark-cyan theme matching the app
- `script.js` — OS detection + footer year
- `assets/` — logo and favicon

## How the download buttons work

Each platform card has two links.

**1. Download (ready-to-run app)** — points at the latest GitHub Release:

```
https://github.com/seanless/spwrite/releases/latest/download/Spwrite-macOS.zip
https://github.com/seanless/spwrite/releases/latest/download/Spwrite-Windows-Setup.exe
https://github.com/seanless/spwrite/releases/latest/download/Spwrite-Linux.AppImage
```

To make these work, build the app for each platform and attach the files to a
GitHub Release: **Releases → Draft a new release → tag it (e.g. `v1.0.0`) → drag
the files into "Attach binaries" → Publish**. The file names you upload **must
match** the names above, or edit the button URLs in `index.html` to match. The
`releases/latest/download/...` links always resolve to your newest release, so
you never have to touch the page again.

### Making the Mac download (`Spwrite-macOS.zip`)

`Spwrite.app` is a Flutter release build — a folder bundle, so it has to be
zipped before uploading (GitHub Releases can't take a raw `.app`). From the
`spwrite` project:

```bash
flutter build macos --release
# the app lands at:
#   build/macos/Build/Products/Release/Spwrite.app
cd build/macos/Build/Products/Release
zip -r -y Spwrite-macOS.zip Spwrite.app
```

Upload the resulting `Spwrite-macOS.zip` to the release. Writers download it,
double-click to unzip, and drag `Spwrite.app` into their Applications folder —
exactly the steps shown on the dedicated Mac install page (`mac.html`).

**2. Download source** — points at the repo's main-branch zip (GitHub builds
this automatically, nothing to upload):

```
https://github.com/seanless/spwrite/archive/refs/heads/main.zip
```

The coffee button points at `https://buymeacoffee.com/seanless`.

### 2. Publish with GitHub Pages

Option A — user site: push to a repo named `seanless.github.io`; it's served
at `https://seanless.github.io`.

```bash
git init
git add .
git commit -m "Add Spwrite landing page"
git branch -M main
git remote add origin https://github.com/seanless/seanless.github.io.git
git push -u origin main
```

Option B — any repo: push the files, then **Settings → Pages → Deploy from a
branch → main / root**.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Credits

- **Seanless** — product direction, requirements, and review.
- **Kiro** — implementation, tests, and tooling.
