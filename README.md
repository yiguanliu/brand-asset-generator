# CDG / HOMME PLUS — Brand Asset Generator

A browser-based poster / brand-asset generator inspired by the visual world of **COMME des GARÇONS Homme Plus** — Rei Kawakubo's deconstructive minimalism fused with the "software tool aesthetic" of Teenage Engineering manuals, A24 marketing, and Linear / Vercel-era dev-tool brands.

Upload an image (or pick a starter), pass it through a tunable dithering pipeline, compose typography and HUD ornaments on top, and export print-ready PNGs.

![preview](public/samples/philip-martin-5aGUyCW_PJw-unsplash.jpg)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle locally
npm run typecheck
```

Node 18+ recommended.

---

## Feature surface

### Source
- 12 starter images (`public/samples/`) shown as a thumbnail gallery
- Drag-drop upload (PNG / JPG / WEBP / GIF)
- 3 one-click demos that bundle an image **+** a preset **+** tweaks (Editorial Portrait, Tokyo Night, Glitch Feed)
- **Fill Frame** (`cover`) and **Fit Inside** (`contain`) quick actions
- Manual fit mode, scale, offset X/Y, rotation

### Dither pipeline (Web Worker)
12 algorithms — None · Threshold · Bayer 2/4/8 · Random · Floyd-Steinberg · Atkinson · Jarvis-Judice-Ninke · Stucki · Burkes · Sierra. Plus:
- Pixel scale (1–32), threshold, levels, pre-blur
- Contrast, brightness, gamma, invert, serpentine pass

Algorithms run in [`src/lib/dither/worker.ts`](src/lib/dither/worker.ts) so the UI never blocks.

### Color
- Background / Foreground / Accent swatches with custom hex picker
- Mono · Duotone · Tritone color modes (with adjustable ramp)
- **Image overlay** — 16 blend modes (multiply, screen, overlay, soft/hard light, difference, luminosity, …) and opacity slider, so the background mixes through the dithered image

### Layout
- Aspect presets: 1:1 · 4:5 · 9:16 · custom (W×H)
- Per-side margins
- Grid overlay & social safe-area guides (designer aids — never exported)
- Visible accent-color **canvas frame** with corner ticks and dimensions label so the working area is unambiguous; Konva content is clipped so nothing bleeds past the canvas

### Typography
- Multi-block, click-to-edit and drag-to-position on the canvas
- 5 font stacks — JetBrains Mono, DM Mono, Inter Tight, Noto Serif JP, Noto Sans JP (mix Latin + 川久保 freely)
- Per-block size · weight · tracking · leading · color · alignment · rotation · uppercase
- Latin + Japanese fallback chain

### HUD / Ornaments
- 4 corner readouts (editable label/value pairs, optional accent)
- Tick scrubber bar, status checklist, diagonal stripe blocks
- Pagination dots, plus mark, procedural barcode, registration crosses, thin frame border

### Finish
- Film grain (amount + cell size)
- Scanlines (opacity + spacing)
- Vignette · halftone scaffolding

### Presets — 10 builtins
`HOMME PLUS` · `NOISE FLOOR` · `PAPER WHITE` · `TOKYO NIGHT` · `ARCHIVE 1994` · `BAYER 8×8` · `DECONSTRUCTED` · `TRITONE BLOOD` · `MINIMAL` · `GLITCH FEED`

Each preset reconfigures dither + color + blend + layout + typography + HUD as one unit.

**Save your own** — name + thumbnail snapshot persisted to IndexedDB:
- `+ SAVE` — local only
- `+ SAVE & EXPORT` — local + downloads a `.json`
- `↑ UPLOAD .JSON` — import a preset file from disk (with validation)
- Per-saved-preset `LOAD` / `EXPORT` / `DEL` actions

### Settings drawer
Theme the entire chrome (the poster artwork keeps its own CdG palette):

| Section | Options |
|---|---|
| Theme | VOID · INK · BLOOD · PAPER (4 cards, light/dark variants) |
| Accent | 6 presets (Blood / Lime / Cyan / Amber / Magenta / Paper) + custom hex |
| Font size | Slider 0.85×–1.4× + S/M/L chips (scales via `html { font-size }`) |
| Font type | JetBrains Mono · Inter Tight · DM Mono (live preview cards) |

Settings persist to `localStorage` under `cdg-ui` and are applied before first React paint (no flash of unstyled theme).

### Export
- PNG @ 1× (preview) · 2× (retina) · 4× (oversize)
- Filename pattern: `cdg-hp_<aspect>_<timestamp>_<ratio>x.png`

### Keyboard shortcuts
- `R` — reset to default
- `E` — export PNG @ 2×
- `,` — toggle settings drawer
- `Esc` — close settings drawer

---

## Tech stack

| Concern | Choice |
|---|---|
| Build | Vite 5 |
| Framework | React 18 + TypeScript (strict) |
| Composition | Konva.js via react-konva |
| Dithering | Custom algorithms in a dedicated Web Worker |
| State | Zustand (poster state + UI/chrome state, persisted separately) |
| Styling | Tailwind CSS (colors mapped to CSS variables for runtime theming) |
| Animation | Framer Motion |
| Fonts | `@fontsource` (self-hosted JetBrains Mono, Inter Tight, DM Mono, Noto Serif JP, Noto Sans JP) |
| Storage | IndexedDB via `idb-keyval` (presets + session) · `localStorage` (UI settings) |
| Upload | `react-dropzone` |
| Deploy | Vercel (`vercel.json` included) |

---

## Project layout

```
brand-asset-generator/
├── public/
│   └── samples/                 # 12 starter images
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles/
│   │   ├── globals.css          # tokens (CSS vars) + element resets
│   │   └── fonts.css
│   ├── store/
│   │   ├── posterStore.ts       # all poster parameters
│   │   └── uiStore.ts           # chrome theme / accent / font / sidebar
│   ├── types/
│   │   └── poster.ts            # PosterState, BlendMode, etc.
│   ├── lib/
│   │   ├── dither/
│   │   │   ├── index.ts         # algorithms + dispatcher
│   │   │   └── worker.ts        # Web Worker entry
│   │   ├── presets/
│   │   │   ├── default.ts       # base PosterState
│   │   │   ├── library.ts       # 10 builtin presets
│   │   │   └── userStore.ts     # IDB save/load + JSON file IO
│   │   ├── demos/
│   │   │   └── index.ts         # 3 demo configs (image + preset + tweaks)
│   │   ├── samples/
│   │   │   └── index.ts         # starter-image manifest + loader
│   │   └── export/
│   │       └── toPNG.ts         # Konva → dataURL @ pixelRatio
│   ├── hooks/
│   │   ├── useDither.ts         # debounced worker pipeline + recolor
│   │   └── useUserPresets.ts    # save / load / import / export
│   └── components/
│       ├── Stage/               # PosterStage + image / HUD / text / finish layers
│       ├── Panels/              # Source · Dither · Color · Layout · Typography · HUD · Finish · Preset · Export
│       ├── Controls/            # Slider · Toggle · Select · Swatch · TextField · Dropzone · Disclosure · gallery components
│       └── Shell/               # AppShell · TopBar · StatusBar · Sidebar · SettingsDrawer
├── tailwind.config.ts
├── vite.config.ts
├── vercel.json
└── package.json
```

---

## How the rendering pipeline works

1. **Source** — image dropped or picked → stored as `dataUrl` in `posterStore.source`
2. **Worker** — [`useDither`](src/hooks/useDither.ts) downsamples to `pixelScale`, posts an `ImageData` to the dither worker, recolors the returned grayscale to the active `fg`/`bg`/`accent` palette using mono / duo / tri mapping
3. **Stage** — [`PosterStage`](src/components/Stage/PosterStage.tsx) hosts a Konva `<Stage>` clipped to the canvas rect. Layers stack: background `<Rect>` → image (with blend mode + opacity) → HUD ornaments → text blocks → finish (grain / scanlines / vignette) → optional grid / safe-area guides on top
4. **Frame** — a DOM-level accent ring + corner ticks sits *outside* the Konva stage so it visually demarcates the canvas without polluting the export
5. **Export** — `stage.toDataURL({ pixelRatio })` at 1× / 2× / 4× downloads a hi-DPI PNG

---

## Preset JSON format

Saved by `+ SAVE & EXPORT` and per-preset `EXPORT` button. Round-trips through `↑ UPLOAD .JSON`.

```json
{
  "kind": "cdg-hp.preset",
  "version": 1,
  "preset": {
    "id": "8-char-id",
    "name": "MY LOOK",
    "createdAt": 1715472000000,
    "thumbnail": "data:image/jpeg;base64,...",
    "state": {
      "source": { "fitMode": "cover", "...": "..." },
      "dither": { "algorithm": "floyd-steinberg", "pixelScale": 8, "...": "..." },
      "color": { "background": "#0A0908", "blendMode": "soft-light", "...": "..." },
      "layout": { "aspect": "4:5", "...": "..." },
      "text": [ /* TextBlock[] */ ],
      "hud":  { /* HUDState */ },
      "finish": { /* FinishState */ }
    }
  }
}
```

The importer also accepts a bare `UserPreset` (no envelope) for hand-edited files.

---

## Deploy

```bash
vercel
```

`vercel.json` already configures the Vite framework, build command, and SPA rewrites. No env vars required — the app runs fully client-side.

---

## Credits

- Starter images: Unsplash (credits in [`src/lib/samples/index.ts`](src/lib/samples/index.ts))
- Brand reference: COMME des GARÇONS Homme Plus — for inspiration only, not affiliated.

---

## License

Personal / educational use. Brand references are aesthetic homage.
