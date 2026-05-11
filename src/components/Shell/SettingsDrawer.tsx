import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import {
  ACCENTS,
  THEMES,
  UI_FONTS,
  useUIStore,
  type ThemeKey,
  type UIFontKey,
} from '@/store/uiStore';
import { Slider } from '@/components/Controls/Slider';

export function SettingsDrawer() {
  const open = useUIStore((s) => s.settingsOpen);
  const close = () => useUIStore.getState().setSettingsOpen(false);

  const theme = useUIStore((s) => s.theme);
  const accent = useUIStore((s) => s.accent);
  const accentRgb = useUIStore((s) => s.accentRgb);
  const fontScale = useUIStore((s) => s.fontScale);
  const uiFont = useUIStore((s) => s.uiFont);

  const setTheme = useUIStore((s) => s.setTheme);
  const setAccent = useUIStore((s) => s.setAccent);
  const setFontScale = useUIStore((s) => s.setFontScale);
  const setUIFont = useUIStore((s) => s.setUIFont);
  const reset = useUIStore((s) => s.resetSettings);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            className="fixed top-0 right-0 h-full w-[360px] z-50 bg-void border-l border-edge flex flex-col chrome-noselect"
          >
            {/* Header */}
            <div className="h-10 border-b border-edge flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <span className="text-2xs tracking-hud uppercase text-ash">
                  PANEL · 00
                </span>
                <span className="text-2xs tracking-hud uppercase text-paper font-bold">
                  SETTINGS
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close settings"
                className="w-6 h-6 border border-edge hover:border-paper text-paper flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
              {/* THEME */}
              <Section title="THEME" code="01">
                <div className="grid grid-cols-2 gap-1.5">
                  {THEMES.map((t) => (
                    <ThemeCard
                      key={t.key}
                      themeKey={t.key}
                      name={t.name}
                      blurb={t.blurb}
                      bg={t.tokens.void}
                      fg={t.tokens.paper}
                      muted={t.tokens.ash}
                      active={theme === t.key}
                      onPick={setTheme}
                    />
                  ))}
                </div>
              </Section>

              {/* ACCENT */}
              <Section title="ACCENT" code="02">
                <div className="grid grid-cols-3 gap-1.5">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => setAccent(a.value, a.rgb)}
                      className={clsx(
                        'border flex flex-col items-stretch transition-all',
                        accent.toLowerCase() === a.value.toLowerCase()
                          ? 'border-paper'
                          : 'border-edge hover:border-ash',
                      )}
                    >
                      <div className="h-7" style={{ background: a.value }} />
                      <div className="px-2 py-1 bg-void text-2xs tracking-hud uppercase text-paper truncate text-left">
                        {a.name}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="hud-label">CUSTOM</span>
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => {
                      const hex = e.target.value;
                      const rgb = hexToRgbStr(hex);
                      setAccent(hex, rgb);
                    }}
                    className="w-7 h-7 cursor-pointer bg-transparent border border-edge p-0"
                    aria-label="Custom accent"
                  />
                  <span className="text-2xs tracking-hud uppercase text-paper tabular-nums">
                    {accent.toUpperCase()}
                  </span>
                  <span
                    className="ml-auto block w-3 h-3 border border-edge"
                    style={{ background: `rgb(${accentRgb})` }}
                  />
                </div>
              </Section>

              {/* FONT SIZE */}
              <Section title="FONT SIZE" code="03">
                <Slider
                  label="UI SCALE"
                  value={fontScale}
                  min={0.85}
                  max={1.4}
                  step={0.01}
                  precision={2}
                  unit="×"
                  onChange={setFontScale}
                />
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'S', v: 0.9 },
                    { label: 'M', v: 1 },
                    { label: 'L', v: 1.15 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFontScale(p.v)}
                      className={clsx(
                        'border text-2xs tracking-hud uppercase py-2 transition-colors',
                        Math.abs(fontScale - p.v) < 0.001
                          ? 'border-paper text-paper'
                          : 'border-edge text-ash hover:border-ash hover:text-paper',
                      )}
                    >
                      {p.label} · {p.v.toFixed(2)}×
                    </button>
                  ))}
                </div>
              </Section>

              {/* FONT TYPE */}
              <Section title="FONT TYPE" code="04">
                <div className="flex flex-col gap-1.5">
                  {UI_FONTS.map((f) => (
                    <FontCard
                      key={f.key}
                      fontKey={f.key}
                      name={f.name}
                      cssVar={f.cssVar}
                      active={uiFont === f.key}
                      onPick={setUIFont}
                    />
                  ))}
                </div>
              </Section>

              {/* RESET */}
              <button
                type="button"
                onClick={reset}
                className="mt-2 border border-edge hover:border-blood hover:text-blood text-2xs tracking-hud uppercase py-2.5 transition-colors"
              >
                ↺ RESET ALL SETTINGS
              </button>
            </div>

            <div className="border-t border-edge px-3 py-2 flex items-center justify-between">
              <span className="text-2xs tracking-hud uppercase text-ash">
                AUTOSAVED · LOCAL
              </span>
              <span className="text-2xs tracking-hud uppercase text-paper">
                ESC TO CLOSE
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-edge pb-1.5">
        <span className="text-2xs tracking-hud uppercase text-paper font-bold">
          {title}
        </span>
        <span className="text-2xs tracking-hud uppercase text-ash">{code}</span>
      </div>
      {children}
    </section>
  );
}

function ThemeCard({
  themeKey,
  name,
  blurb,
  bg,
  fg,
  muted,
  active,
  onPick,
}: {
  themeKey: ThemeKey;
  name: string;
  blurb: string;
  bg: string;
  fg: string;
  muted: string;
  active: boolean;
  onPick: (k: ThemeKey) => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={() => onPick(themeKey)}
      className={clsx(
        'border text-left overflow-hidden transition-all',
        active ? 'border-paper' : 'border-edge hover:border-ash',
      )}
    >
      <div
        className="h-12 relative"
        style={{ background: `rgb(${bg})` }}
      >
        <span
          className="absolute top-1.5 left-1.5 text-[0.625rem] tracking-[0.18em] uppercase"
          style={{ color: `rgb(${muted})` }}
        >
          {name}
        </span>
        <span
          className="absolute bottom-1.5 left-1.5 right-1.5 h-px"
          style={{ background: `rgb(${fg})`, opacity: 0.55 }}
        />
        <span
          className="absolute bottom-2.5 right-1.5 text-[0.625rem] tracking-[0.18em] uppercase"
          style={{ color: `rgb(${fg})`, opacity: 0.7 }}
        >
          +
        </span>
      </div>
      <div className="px-2 py-1.5 bg-void">
        <div className="text-2xs tracking-wide2 uppercase text-paper truncate">
          {name}
        </div>
        <div className="text-2xs tracking-hud uppercase text-ash truncate">
          {blurb}
        </div>
      </div>
    </motion.button>
  );
}

function FontCard({
  fontKey,
  name,
  cssVar,
  active,
  onPick,
}: {
  fontKey: UIFontKey;
  name: string;
  cssVar: string;
  active: boolean;
  onPick: (k: UIFontKey) => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => onPick(fontKey)}
      className={clsx(
        'border text-left p-2 flex items-baseline justify-between gap-2 transition-all',
        active ? 'border-paper' : 'border-edge hover:border-ash',
      )}
      style={{ fontFamily: cssVar }}
    >
      <span className="text-paper text-sm tracking-wide2">
        Aa · 0123 · 川久保
      </span>
      <span className="text-2xs tracking-hud uppercase text-ash">{name}</span>
    </motion.button>
  );
}

function hexToRgbStr(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
