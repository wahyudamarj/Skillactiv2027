# Skillactiv website

Static site: plain HTML, CSS and JavaScript. No build step.

## Publish on GitHub Pages

1. Create a new repository and add everything in this folder at its root (`index.html` must sit at the top).
2. Settings → Pages → Build and deployment → Deploy from a branch → `main` and `/ (root)` → Save.
3. After about a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

The GitHub web uploader takes at most 100 files per upload, so add the site in the three parts from the `skillactiv-upload` folder, or use GitHub Desktop and add it all at once.

## Where to edit

- Text in English and Indonesian: `i18n.js`
- Client logos and hover text: `clients.js` (logo files in `logos/`)
- Programs and events: `programs.js` (photos in `photos/programs/`)
- Training sessions: `training.js` (photos in `photos/training/`)
- Look and layout: `styles.css`
- Learning content samples: `samples/`
