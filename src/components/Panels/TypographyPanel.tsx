import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/Controls/Slider';
import { Select } from '@/components/Controls/Select';
import { Toggle } from '@/components/Controls/Toggle';
import { TextField } from '@/components/Controls/TextField';
import { Swatch } from '@/components/Controls/Swatch';
import { usePosterStore } from '@/store/posterStore';
import type { FontFamilyKey, TextAlign } from '@/types/poster';

const FONT_OPTIONS: { value: FontFamilyKey; label: string }[] = [
  { value: 'mono', label: 'JETBRAINS MONO' },
  { value: 'body', label: 'DM MONO' },
  { value: 'ui', label: 'INTER TIGHT' },
  { value: 'jp-serif', label: 'NOTO SERIF JP' },
  { value: 'jp-sans', label: 'NOTO SANS JP' },
];

const ALIGN_OPTIONS: { value: TextAlign; label: string }[] = [
  { value: 'left', label: 'LEFT' },
  { value: 'center', label: 'CENTER' },
  { value: 'right', label: 'RIGHT' },
];

export function TypographyPanel() {
  const blocks = usePosterStore((s) => s.text);
  const addText = usePosterStore((s) => s.addText);
  const removeText = usePosterStore((s) => s.removeText);
  const dup = usePosterStore((s) => s.duplicateText);
  const update = usePosterStore((s) => s.updateText);
  const [openId, setOpenId] = useState<string | null>(blocks[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b, i) => (
        <div key={b.id} className="border border-edge">
          <button
            type="button"
            onClick={() => setOpenId(openId === b.id ? null : b.id)}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-char transition-colors"
          >
            <span className="text-3xs tracking-hud uppercase text-ash">
              {String(i + 1).padStart(2, '0')} ·
            </span>
            <span className="flex-1 ml-2 text-2xs text-paper truncate text-left">
              {b.content || 'EMPTY'}
            </span>
            <span className="text-3xs text-ash ml-2">
              {openId === b.id ? '−' : '+'}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openId === b.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
                className="overflow-hidden"
              >
                <div className="p-2 flex flex-col gap-2 bg-char">
                  <TextField value={b.content} onChange={(v) => update(b.id, { content: v })} placeholder="TEXT" />
                  <Select<FontFamilyKey>
                    label="FONT"
                    value={b.font}
                    options={FONT_OPTIONS}
                    onChange={(v) => update(b.id, { font: v })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Slider label="SIZE" value={b.size} min={6} max={200} step={1} onChange={(v) => update(b.id, { size: v })} />
                    <Select<string>
                      label="WEIGHT"
                      value={String(b.weight)}
                      options={[
                        { value: '400', label: 'REGULAR' },
                        { value: '500', label: 'MEDIUM' },
                        { value: '700', label: 'BOLD' },
                      ]}
                      onChange={(v) => update(b.id, { weight: Number(v) as 400 | 500 | 700 })}
                    />
                  </div>
                  <Slider label="TRACKING" value={b.tracking} min={-0.05} max={0.4} step={0.005} precision={3} onChange={(v) => update(b.id, { tracking: v })} />
                  <Slider label="LEADING" value={b.leading} min={0.8} max={2.5} step={0.05} precision={2} onChange={(v) => update(b.id, { leading: v })} />
                  <Select<TextAlign> label="ALIGN" value={b.align} options={ALIGN_OPTIONS} onChange={(v) => update(b.id, { align: v })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Slider label="X" value={b.x} min={0} max={1} step={0.005} precision={3} onChange={(v) => update(b.id, { x: v })} />
                    <Slider label="Y" value={b.y} min={0} max={1} step={0.005} precision={3} onChange={(v) => update(b.id, { y: v })} />
                  </div>
                  <Slider label="ROTATION" value={b.rotation} min={-180} max={180} step={1} unit="°" onChange={(v) => update(b.id, { rotation: v })} />
                  <Swatch label="COLOR" value={b.color} onChange={(v) => update(b.id, { color: v })} />
                  <Toggle label="UPPERCASE" value={b.upper} onChange={(v) => update(b.id, { upper: v })} />
                  <Toggle label="VISIBLE" value={b.visible} onChange={(v) => update(b.id, { visible: v })} />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => dup(b.id)}
                      className="flex-1 border border-edge hover:border-paper text-3xs tracking-hud uppercase py-1.5"
                    >
                      DUPLICATE
                    </button>
                    <button
                      type="button"
                      onClick={() => removeText(b.id)}
                      className="flex-1 border border-edge hover:border-blood hover:text-blood text-3xs tracking-hud uppercase py-1.5"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <button
        type="button"
        onClick={addText}
        className="border border-dashed border-edge hover:border-paper text-2xs tracking-hud uppercase py-2 transition-colors"
      >
        + ADD BLOCK
      </button>
    </div>
  );
}
