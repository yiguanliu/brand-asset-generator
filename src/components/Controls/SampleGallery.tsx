import { useState } from 'react';
import clsx from 'clsx';
import { usePosterStore } from '@/store/posterStore';
import { SAMPLES, loadSampleIntoStore, type SampleImage } from '@/lib/samples';

export function SampleGallery() {
  const setImage = usePosterStore((s) => s.setImage);
  const currentName = usePosterStore((s) => s.source.imageName);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pick = async (s: SampleImage) => {
    setLoadingId(s.id);
    try {
      await loadSampleIntoStore(s, setImage);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="hud-label">STARTERS · {SAMPLES.length}</span>
        <span className="text-2xs text-ash tracking-hud uppercase">CLICK TO LOAD</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {SAMPLES.map((s) => {
          const active = currentName === s.label;
          const loading = loadingId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s)}
              title={`${s.label} — ${s.credit}`}
              className={clsx(
                'relative aspect-[3/4] overflow-hidden border transition-all bg-char group',
                active
                  ? 'border-paper'
                  : 'border-edge hover:border-ash',
                loading && 'opacity-50',
              )}
            >
              <img
                src={s.file}
                alt={s.label}
                loading="lazy"
                className={clsx(
                  'absolute inset-0 w-full h-full object-cover transition-all',
                  active ? 'grayscale-0' : 'grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0',
                )}
              />
              <span
                className={clsx(
                  'absolute bottom-0 left-0 right-0 text-2xs tracking-hud uppercase px-1 py-0.5 text-paper',
                  'bg-gradient-to-t from-void/90 via-void/40 to-transparent',
                )}
              >
                {s.id}
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center text-paper text-2xs tracking-hud bg-void/60">
                  LOADING
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
