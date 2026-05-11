import { Slider } from '@/components/Controls/Slider';
import { Select } from '@/components/Controls/Select';
import { Toggle } from '@/components/Controls/Toggle';
import { usePosterStore } from '@/store/posterStore';
import type { AspectKey } from '@/types/poster';

export function LayoutPanel() {
  const layout = usePosterStore((s) => s.layout);
  const patch = usePosterStore((s) => s.patchLayout);
  const setAspect = usePosterStore((s) => s.setAspect);

  return (
    <div className="flex flex-col gap-3">
      <Select<AspectKey>
        label="ASPECT"
        value={layout.aspect}
        onChange={(v) => setAspect(v)}
        options={[
          { value: '1:1', label: 'SQUARE · 1:1' },
          { value: '4:5', label: 'PORTRAIT · 4:5' },
          { value: '9:16', label: 'STORY · 9:16' },
          { value: 'custom', label: 'CUSTOM' },
        ]}
      />
      {layout.aspect === 'custom' && (
        <div className="grid grid-cols-2 gap-2">
          <Slider label="WIDTH" value={layout.width} min={400} max={4000} step={20} onChange={(v) => patch({ width: v })} />
          <Slider label="HEIGHT" value={layout.height} min={400} max={4000} step={20} onChange={(v) => patch({ height: v })} />
        </div>
      )}
      <Slider label="MARGIN · TOP" value={layout.marginTop} min={0} max={200} step={2} onChange={(v) => patch({ marginTop: v })} />
      <Slider label="MARGIN · RIGHT" value={layout.marginRight} min={0} max={200} step={2} onChange={(v) => patch({ marginRight: v })} />
      <Slider label="MARGIN · BOTTOM" value={layout.marginBottom} min={0} max={200} step={2} onChange={(v) => patch({ marginBottom: v })} />
      <Slider label="MARGIN · LEFT" value={layout.marginLeft} min={0} max={200} step={2} onChange={(v) => patch({ marginLeft: v })} />
      <Slider label="ASYMMETRY" value={layout.asymmetry} min={0} max={1} step={0.01} precision={2} onChange={(v) => patch({ asymmetry: v })} />
      <Toggle label="GRID OVERLAY" value={layout.gridOverlay} onChange={(v) => patch({ gridOverlay: v })} />
      <Toggle label="SAFE AREA" value={layout.safeArea} onChange={(v) => patch({ safeArea: v })} />
    </div>
  );
}
