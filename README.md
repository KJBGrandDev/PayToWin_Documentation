# Dusk of Morning Star — Documentation Site (`docs-site`)

Static web documentation (Game Design Document, Technical Reference, and Project Record) for **Dusk of Morning Star** (*PAY TO WIN*).

- **Repository**: https://github.com/KJBGrandDev/PayToWin_Documentation

## Deploying to GitHub Pages

This folder is zero-build static HTML/CSS/JS with `.nojekyll` included.

1. Push the contents of `docs-site/` to your GitHub repository (`PayToWin_Documentation`), either at the repository root (`main` branch) or inside `/docs`.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)` (or `/docs`), then click **Save**.

## Local Preview

Open `index.html` directly in any browser or serve locally:

```bash
python -m http.server 8080
```
