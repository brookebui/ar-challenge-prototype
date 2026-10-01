# AR Couch Placement

Minimal mobile web app for placing a real-scale couch in your room with AR.

On an AR-capable phone, the page opens placement as soon as the model loads. The only control is **Place couch** if auto-start is blocked.

## Requirements

- **Android:** Chrome on an ARCore device
- **iOS:** Safari on a device with ARKit (Quick Look)
- HTTPS (required for WebXR / camera AR)

Desktop browsers can load the page but will show “Open on a phone with AR support.”

## Run locally

```bash
npm install
npm run dev
```

Vite serves over **HTTPS** and binds to your LAN (`--host`).

1. Note the Local / Network URLs printed in the terminal (e.g. `https://192.168.x.x:5173`).
2. On your phone (same Wi‑Fi), open that **Network** URL in Chrome (Android) or Safari (iOS).
3. Accept the self-signed certificate warning if prompted.
4. Allow camera access when asked, then place the couch on the floor.

### Build / preview

```bash
npm run build
npm run preview
```

## Notes

- Couch model: `public/models/couch.glb` (~2.2 m wide, floor at y = 0). Regenerate with `node scripts/generate-couch.mjs` (needs `three` installed).
- Scale is fixed in AR (`ar-scale="fixed"`) so size matches the real world.
- Placement is floor-only (`ar-placement="floor"`).
