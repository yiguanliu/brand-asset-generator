import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePosterStore } from '@/store/posterStore';
import { DEMOS, resolveDemo, type DemoConfig } from '@/lib/demos';
import { loadSampleIntoStore } from '@/lib/samples';

export function DemoGallery() {
  const loadState = usePosterStore((s) => s.loadState);
  const setImage = usePosterStore((s) => s.setImage);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const launch = async (demo: DemoConfig) => {
    setLoadingId(demo.id);
    try {
      const resolved = resolveDemo(demo);
      if (!resolved) return;
      const { preset, sample } = resolved;
      // Load image first so its dimensions land in the store, then apply preset state
      await loadSampleIntoStore(sample, setImage);
      // Apply preset but keep the source we just set
      const cur = usePosterStore.getState().source;
      loadState({ ...preset, source: { ...cur, fitMode: preset.source.fitMode } });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="hud-label">DEMOS · {DEMOS.length}</span>
        <span className="text-2xs text-ash tracking-hud uppercase">
          IMAGE + PRESET
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {DEMOS.map((d) => (
          <DemoCard
            key={d.id}
            demo={d}
            loading={loadingId === d.id}
            onClick={() => launch(d)}
          />
        ))}
      </div>
    </div>
  );
}

function DemoCard({
  demo,
  loading,
  onClick,
}: {
  demo: DemoConfig;
  loading: boolean;
  onClick: () => void;
}) {
  const [bg, fg, accent] = demo.swatch;
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      title={demo.blurb}
      className="relative border border-edge hover:border-paper text-left transition-all overflow-hidden bg-void disabled:opacity-50"
    >
      <div
        className="h-14 relative flex items-stretch"
        style={{ background: bg }}
      >
        <div className="flex-1 relative">
          <span
            className="absolute top-1 left-1 text-2xs tracking-[0.18em] uppercase"
            style={{ color: fg, opacity: 0.75 }}
          >
            DEMO {demo.code}
          </span>
          <span
            className="absolute top-1 right-1 block w-1.5 h-1.5"
            style={{ background: accent }}
          />
          <span
            className="absolute bottom-1 left-1 right-2 h-px"
            style={{ background: fg, opacity: 0.45 }}
          />
          <span
            className="absolute bottom-1 right-1 text-2xs tracking-[0.18em] uppercase"
            style={{ color: fg, opacity: 0.6 }}
          >
            ▸
          </span>
        </div>
        <div className="w-1" style={{ background: fg }} />
        <div className="w-1" style={{ background: accent }} />
      </div>
      <div className="px-1.5 py-1.5 bg-void">
        <div className="text-2xs tracking-wide2 uppercase text-paper truncate">
          {demo.name}
        </div>
        <div className="text-2xs text-ash tracking-hud uppercase truncate">
          {demo.blurb}
        </div>
      </div>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center text-paper text-2xs tracking-hud bg-void/60">
          LOADING
        </span>
      )}
    </motion.button>
  );
}
