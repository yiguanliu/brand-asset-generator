import { create } from 'zustand';

export type ThemeKey = 'void' | 'paper' | 'ink' | 'blood';
export type UIFontKey = 'mono' | 'sans' | 'body';

export interface ThemeTokens {
  void: string;   // background
  paper: string;  // foreground
  ash: string;    // muted
  edge: string;   // border
  char: string;   // elevation 1
  smoke: string;  // elevation 2
  ink: string;    // hard contrast
  gauze: string;  // soft contrast
}

export interface ThemeDef {
  key: ThemeKey;
  name: string;
  blurb: string;
  tokens: ThemeTokens;
}

// Each color value is "R G B" so `rgb(var(--c-X) / <alpha>)` works.
export const THEMES: ThemeDef[] = [
  {
    key: 'void',
    name: 'VOID',
    blurb: 'WARM NEAR-BLACK · BONE TYPE',
    tokens: {
      void: '10 9 8',
      paper: '239 234 224',
      ash: '122 119 111',
      edge: '42 39 34',
      char: '21 19 15',
      smoke: '31 28 24',
      ink: '0 0 0',
      gauze: '214 209 196',
    },
  },
  {
    key: 'ink',
    name: 'INK',
    blurb: 'TRUE BLACK · HIGH CONTRAST',
    tokens: {
      void: '0 0 0',
      paper: '245 245 245',
      ash: '120 120 120',
      edge: '60 60 60',
      char: '12 12 12',
      smoke: '22 22 22',
      ink: '0 0 0',
      gauze: '200 200 200',
    },
  },
  {
    key: 'blood',
    name: 'BLOOD',
    blurb: 'RED-TINGED DARK',
    tokens: {
      void: '24 8 10',
      paper: '245 230 230',
      ash: '140 100 105',
      edge: '60 28 32',
      char: '34 12 14',
      smoke: '46 20 22',
      ink: '12 4 6',
      gauze: '210 175 175',
    },
  },
  {
    key: 'paper',
    name: 'PAPER',
    blurb: 'INVERTED · LIGHT BACKGROUND',
    tokens: {
      void: '239 234 224',
      paper: '10 9 8',
      ash: '110 105 95',
      edge: '200 192 178',
      char: '228 222 210',
      smoke: '218 210 196',
      ink: '0 0 0',
      gauze: '40 36 30',
    },
  },
];

export const ACCENTS: { name: string; value: string; rgb: string }[] = [
  { name: 'BLOOD',   value: '#A8202C', rgb: '168 32 44' },
  { name: 'LIME',    value: '#BFFF3F', rgb: '191 255 63' },
  { name: 'CYAN',    value: '#5CE1E6', rgb: '92 225 230' },
  { name: 'AMBER',   value: '#FFB020', rgb: '255 176 32' },
  { name: 'MAGENTA', value: '#E63990', rgb: '230 57 144' },
  { name: 'PAPER',   value: '#EFEAE0', rgb: '239 234 224' },
];

export const UI_FONTS: { key: UIFontKey; name: string; cssVar: string }[] = [
  { key: 'mono', name: 'JETBRAINS MONO', cssVar: 'var(--ui-font-mono)' },
  { key: 'sans', name: 'INTER TIGHT',    cssVar: 'var(--ui-font-sans)' },
  { key: 'body', name: 'DM MONO',        cssVar: 'var(--ui-font-body)' },
];

interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  settingsOpen: boolean;
  theme: ThemeKey;
  accent: string;       // hex
  accentRgb: string;    // "R G B"
  fontScale: number;    // 0.85 – 1.4
  uiFont: UIFontKey;

  toggleSidebar: () => void;
  setSidebarWidth: (w: number) => void;
  setSettingsOpen: (v: boolean) => void;
  setTheme: (k: ThemeKey) => void;
  setAccent: (hex: string, rgb: string) => void;
  setFontScale: (s: number) => void;
  setUIFont: (f: UIFontKey) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = 'cdg-ui';

interface Persisted {
  sidebarOpen: boolean;
  sidebarWidth: number;
  theme: ThemeKey;
  accent: string;
  accentRgb: string;
  fontScale: number;
  uiFont: UIFontKey;
}

const defaultPersisted: Persisted = {
  sidebarOpen: true,
  sidebarWidth: 320,
  theme: 'void',
  accent: '#A8202C',
  accentRgb: '168 32 44',
  fontScale: 1,
  uiFont: 'mono',
};

const loadPersisted = (): Persisted => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<Persisted>;
      return { ...defaultPersisted, ...v };
    }
  } catch {
    /* ignore */
  }
  return defaultPersisted;
};

const persist = (s: Persisted) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
};

const initial = loadPersisted();

export function applyTheme(theme: ThemeKey, accentRgb: string, fontScale: number, uiFont: UIFontKey) {
  const root = document.documentElement;
  const def = THEMES.find((t) => t.key === theme) ?? THEMES[0];
  const t = def.tokens;
  root.style.setProperty('--c-void', t.void);
  root.style.setProperty('--c-paper', t.paper);
  root.style.setProperty('--c-ash', t.ash);
  root.style.setProperty('--c-edge', t.edge);
  root.style.setProperty('--c-char', t.char);
  root.style.setProperty('--c-smoke', t.smoke);
  root.style.setProperty('--c-ink', t.ink);
  root.style.setProperty('--c-gauze', t.gauze);
  root.style.setProperty('--c-blood', accentRgb);
  root.style.setProperty('--ui-scale', String(fontScale));
  const fontVar = UI_FONTS.find((f) => f.key === uiFont)?.cssVar ?? 'var(--ui-font-mono)';
  root.style.setProperty('--ui-font-family', fontVar);
  root.style.setProperty('color-scheme', theme === 'paper' ? 'light' : 'dark');
}

// Apply immediately so first paint is correct.
if (typeof document !== 'undefined') {
  applyTheme(initial.theme, initial.accentRgb, initial.fontScale, initial.uiFont);
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: initial.sidebarOpen,
  sidebarWidth: initial.sidebarWidth,
  settingsOpen: false,
  theme: initial.theme,
  accent: initial.accent,
  accentRgb: initial.accentRgb,
  fontScale: initial.fontScale,
  uiFont: initial.uiFont,

  toggleSidebar: () =>
    set((s) => {
      const next = !s.sidebarOpen;
      persist({ ...snapshot(get()), sidebarOpen: next });
      return { sidebarOpen: next };
    }),
  setSidebarWidth: (w) => {
    const clamped = Math.max(260, Math.min(560, Math.round(w)));
    if (clamped === get().sidebarWidth) return;
    set({ sidebarWidth: clamped });
    persist({ ...snapshot(get()), sidebarWidth: clamped });
  },
  setSettingsOpen: (v) => set({ settingsOpen: v }),
  setTheme: (k) => {
    set({ theme: k });
    const s = get();
    applyTheme(k, s.accentRgb, s.fontScale, s.uiFont);
    persist(snapshot(get()));
  },
  setAccent: (hex, rgb) => {
    set({ accent: hex, accentRgb: rgb });
    const s = get();
    applyTheme(s.theme, rgb, s.fontScale, s.uiFont);
    persist(snapshot(get()));
  },
  setFontScale: (scale) => {
    const clamped = Math.max(0.85, Math.min(1.4, scale));
    set({ fontScale: clamped });
    const s = get();
    applyTheme(s.theme, s.accentRgb, clamped, s.uiFont);
    persist(snapshot(get()));
  },
  setUIFont: (f) => {
    set({ uiFont: f });
    const s = get();
    applyTheme(s.theme, s.accentRgb, s.fontScale, f);
    persist(snapshot(get()));
  },
  resetSettings: () => {
    set({
      theme: defaultPersisted.theme,
      accent: defaultPersisted.accent,
      accentRgb: defaultPersisted.accentRgb,
      fontScale: defaultPersisted.fontScale,
      uiFont: defaultPersisted.uiFont,
    });
    applyTheme(
      defaultPersisted.theme,
      defaultPersisted.accentRgb,
      defaultPersisted.fontScale,
      defaultPersisted.uiFont,
    );
    persist(snapshot(get()));
  },
}));

function snapshot(s: UIState): Persisted {
  return {
    sidebarOpen: s.sidebarOpen,
    sidebarWidth: s.sidebarWidth,
    theme: s.theme,
    accent: s.accent,
    accentRgb: s.accentRgb,
    fontScale: s.fontScale,
    uiFont: s.uiFont,
  };
}
