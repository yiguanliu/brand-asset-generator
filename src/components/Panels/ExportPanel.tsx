import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onExport: (pixelRatio: number) => Promise<void>;
}

export function ExportPanel({ onExport }: Props) {
  const [busy, setBusy] = useState<number | null>(null);

  const handle = async (ratio: number) => {
    setBusy(ratio);
    try {
      await onExport(ratio);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="hud-label">EXPORT PNG</div>
      {[
        { r: 1, label: 'PREVIEW · 1×' },
        { r: 2, label: 'RETINA · 2×' },
        { r: 4, label: 'OVERSIZE · 4×' },
      ].map((opt) => (
        <motion.button
          key={opt.r}
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => handle(opt.r)}
          disabled={busy !== null}
          className="border border-edge hover:border-paper hover:bg-char text-2xs tracking-hud uppercase py-2.5 transition-colors disabled:opacity-50 flex items-center justify-between px-3"
        >
          <span>{opt.label}</span>
          <span className="text-3xs text-ash">
            {busy === opt.r ? 'RENDERING' : '↓'}
          </span>
        </motion.button>
      ))}
      <div className="text-3xs text-ash tracking-wide2 uppercase mt-2 leading-relaxed">
        FILES SAVED LOCALLY · CDG-HP_[ASPECT]_[STAMP].PNG
      </div>
    </div>
  );
}
