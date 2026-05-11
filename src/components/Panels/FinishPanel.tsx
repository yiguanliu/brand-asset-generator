import { Slider } from '@/components/Controls/Slider';
import { usePosterStore } from '@/store/posterStore';

export function FinishPanel() {
  const finish = usePosterStore((s) => s.finish);
  const patch = usePosterStore((s) => s.patchFinish);

  return (
    <div className="flex flex-col gap-3">
      <Slider label="GRAIN" value={finish.grainAmount} min={0} max={0.6} step={0.005} precision={3} onChange={(v) => patch({ grainAmount: v })} />
      <Slider label="GRAIN SIZE" value={finish.grainSize} min={1} max={8} step={1} onChange={(v) => patch({ grainSize: v })} />
      <Slider label="SCANLINES" value={finish.scanlines} min={0} max={0.6} step={0.005} precision={3} onChange={(v) => patch({ scanlines: v })} />
      <Slider label="SCAN SPACING" value={finish.scanSpacing} min={1} max={10} step={1} onChange={(v) => patch({ scanSpacing: v })} />
      <Slider label="VIGNETTE" value={finish.vignette} min={0} max={1} step={0.01} precision={2} onChange={(v) => patch({ vignette: v })} />
      <Slider label="HALFTONE" value={finish.halftoneAmount} min={0} max={1} step={0.01} precision={2} onChange={(v) => patch({ halftoneAmount: v })} />
      <Slider label="HALFTONE · R" value={finish.halftoneRadius} min={1} max={8} step={1} onChange={(v) => patch({ halftoneRadius: v })} />
    </div>
  );
}
