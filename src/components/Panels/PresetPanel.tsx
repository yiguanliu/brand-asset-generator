import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPresets } from '@/hooks/useUserPresets';
import { TextField } from '@/components/Controls/TextField';
import { PRESETS, type BuiltinPreset } from '@/lib/presets/library';

interface Props {
  getThumbnail: () => string;
}

interface Toast {
  kind: 'ok' | 'err';
  text: string;
}

export function PresetPanel({ getThumbnail }: Props) {
  const {
    presets,
    save,
    load,
    remove,
    resetToDefault,
    applyBuiltin,
    exportToFile,
    importFromFile,
  } = useUserPresets(getThumbnail);
  const [name, setName] = useState('');
  const [activeId, setActiveId] = useState<string>('homme-plus');
  const [toast, setToast] = useState<Toast | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const flash = (t: Toast) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleApply = (p: BuiltinPreset) => {
    applyBuiltin(p);
    setActiveId(p.id);
  };

  const handleSave = async (opts: { download: boolean }) => {
    const trimmed = name.trim();
    const p = await save(trimmed, opts);
    setName('');
    flash({
      kind: 'ok',
      text: opts.download ? `SAVED + EXPORTED · ${p.name}` : `SAVED · ${p.name}`,
    });
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const p = await importFromFile(file, true);
      flash({ kind: 'ok', text: `IMPORTED · ${p.name}` });
    } catch (err) {
      flash({
        kind: 'err',
        text: `IMPORT FAILED · ${(err as Error).message.toUpperCase()}`,
      });
    } finally {
      // reset so re-uploading same file fires onChange again
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* BUILTIN PRESETS */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="hud-label">PRESETS · {PRESETS.length}</span>
          <button
            type="button"
            onClick={resetToDefault}
            className="text-2xs tracking-hud uppercase text-ash hover:text-paper transition-colors"
          >
            ↺ RESET
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <PresetCard
              key={p.id}
              preset={p}
              active={activeId === p.id}
              onClick={() => handleApply(p)}
            />
          ))}
        </div>
      </div>

      {/* SAVE / IMPORT */}
      <div className="border border-edge p-2 flex flex-col gap-2">
        <TextField label="NEW PRESET NAME" value={name} onChange={setName} placeholder="MY LOOK" />
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleSave({ download: false })}
            className="border border-edge hover:border-paper text-2xs tracking-hud uppercase py-2 transition-colors"
            title="Save to this browser only"
          >
            + SAVE
          </button>
          <button
            type="button"
            onClick={() => handleSave({ download: true })}
            className="border border-edge hover:border-paper text-2xs tracking-hud uppercase py-2 transition-colors"
            title="Save and download .json"
          >
            + SAVE & EXPORT
          </button>
        </div>

        <div className="border-t border-edge mt-1 pt-2 flex flex-col gap-1.5">
          <span className="hud-label">IMPORT FROM FILE</span>
          <button
            type="button"
            onClick={handleImportClick}
            className="border border-dashed border-edge hover:border-paper text-2xs tracking-hud uppercase py-2 transition-colors"
          >
            ↑ UPLOAD .JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.text + toast.kind}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`text-2xs tracking-hud uppercase px-2 py-1.5 border ${
                toast.kind === 'ok'
                  ? 'border-paper text-paper'
                  : 'border-blood text-blood'
              }`}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* USER PRESETS */}
      <div className="flex flex-col gap-1.5">
        <div className="hud-label">SAVED · {presets.length}</div>
        <AnimatePresence initial={false}>
          {presets.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-edge p-2 flex gap-2 items-center">
                {p.thumbnail && (
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-10 h-12 object-cover border border-edge bg-void"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-2xs text-paper uppercase tracking-wide2 truncate">
                    {p.name}
                  </div>
                  <div className="text-2xs text-ash">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => load(p)}
                    className="text-2xs tracking-hud uppercase border border-edge hover:border-paper px-2 py-1"
                    title="Load preset"
                  >
                    LOAD
                  </button>
                  <button
                    type="button"
                    onClick={() => exportToFile(p)}
                    className="text-2xs tracking-hud uppercase border border-edge hover:border-paper px-2 py-1"
                    title="Download .json"
                  >
                    EXPORT
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="text-2xs tracking-hud uppercase border border-edge hover:border-blood hover:text-blood px-2 py-1"
                    title="Delete preset"
                  >
                    DEL
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {presets.length === 0 && (
          <div className="text-2xs text-ash tracking-wide2 uppercase border border-dashed border-edge p-3 text-center">
            NO USER PRESETS SAVED
          </div>
        )}
      </div>
    </div>
  );
}

function PresetCard({
  preset,
  active,
  onClick,
}: {
  preset: BuiltinPreset;
  active: boolean;
  onClick: () => void;
}) {
  const [bg, fg, accent] = preset.swatch;
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      title={preset.blurb}
      className={`relative border text-left transition-all overflow-hidden ${
        active ? 'border-paper' : 'border-edge hover:border-ash'
      }`}
    >
      <div className="h-14 flex" style={{ background: bg }}>
        <div className="flex-1 relative">
          <span
            className="absolute top-1 left-1 text-2xs tracking-[0.18em] uppercase"
            style={{ color: fg, opacity: 0.65 }}
          >
            {preset.code}
          </span>
          <span
            className="absolute top-1 right-1 block w-1.5 h-1.5"
            style={{ background: accent }}
          />
          <span
            className="absolute bottom-1 left-1 right-1 h-px"
            style={{ background: fg, opacity: 0.4 }}
          />
          <span
            className="absolute bottom-2 right-1 text-2xs tracking-[0.18em] uppercase"
            style={{ color: fg, opacity: 0.5 }}
          >
            +
          </span>
        </div>
        <div className="w-1" style={{ background: fg }} />
        <div className="w-1" style={{ background: accent }} />
      </div>
      <div className="px-2 py-1.5 bg-void">
        <div className="text-2xs tracking-wide2 uppercase truncate text-paper">
          {preset.name}
        </div>
        <div className="text-2xs text-ash uppercase tracking-hud truncate">
          {preset.blurb}
        </div>
      </div>
    </motion.button>
  );
}
