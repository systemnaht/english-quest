# English Shift PWA

The trainer is installable as a Progressive Web App.

- `manifest.webmanifest` is the primary manifest.
- `app.webmanifest` mirrors it for compatibility with older links.
- `sw.js` caches the application shell and serves an offline fallback.
- AI-generated exercises still require an internet connection.

When updating the shell, bump the `english-shift-shell-v*` cache name in `sw.js` so installed clients receive the new version cleanly.
