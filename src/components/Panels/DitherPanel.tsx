import { Slider } from '@/components/Controls/Slider';
import { Select } from '@/components/Controls/Select';
import { Toggle } from '@/components/Controls/Toggle';
import { usePosterStore } from '@/store/posterStore';
import { ALGO_LABELS } from '@/lib/dither';
import type { DitherAlgorithm } from '@/types/poster';

const ALGO_OPTIONS = (Object.keys(ALGO_LABELS) as DitherAlgorithm[]).map(
  (k) => ({ value: k, label: ALGO_LABELS[k] }),
);

export function DitherPanel() {
  const dither = usePosterStore((s) => s.dither);
  const patch = usePosterStore((s) => s.patchDither);
  const isDiffusion = ['floyd-steinberg', 'atkinson', 'jjn', 'stucki', 'burkes', 'sierra'].includes(
    dither.algorithm,
  );

  return (
    <div className="flex flex-col gap-3">
      <Select<DitherAlgorithm>
        label="ALGORITHM"
        value={dither.algorithm}
        onChange={(v) => patch({ algorithm: v })}
        options={ALGO_OPTIONS}
      />
      <Slider label="PIXEL SCALE" value={dither.pixelScale} min={1} max={32} step={1} onChange={(v) => patch({ pixelScale: v })} />
      {dither.algorithm === 'threshold' && (
        <Slider label="THRESHOLD" value={dither.threshold} min={0} max={255} step={1} onChange={(v) => patch({ threshold: v })} />
      )}
      {dither.algorithm !== 'threshold' && dither.algorithm !== 'none' && (
        <Slider label="LEVELS" value={dither.levels} min={2} max={16} step={1} onChange={(v) => patch({ levels: v })} />
      )}
      <Slider label="PRE-BLUR" value={dither.preBlur} min={0} max={10} step={0.5} precision={1} onChange={(v) => patch({ preBlur: v })} />
      <Slider label="CONTRAST" value={dither.contrast} min={0.2} max={3} step={0.01} precision={2} onChange={(v) => patch({ contrast: v })} />
      <Slider label="BRIGHTNESS" value={dither.brightness} min={-0.5} max={0.5} step={0.01} precision={2} onChange={(v) => patch({ brightness: v })} />
      <Slider label="GAMMA" value={dither.gamma} min={0.2} max={3} step={0.01} precision={2} onChange={(v) => patch({ gamma: v })} />
      <Toggle label="INVERT" value={dither.invert} onChange={(v) => patch({ invert: v })} />
      {isDiffusion && (
        <Toggle label="SERPENTINE" value={dither.serpentine} onChange={(v) => patch({ serpentine: v })} />
      )}
    </div>
  );
}
