import { Swatch } from '@/components/Controls/Swatch';
import { Select } from '@/components/Controls/Select';
import { Slider } from '@/components/Controls/Slider';
import { usePosterStore } from '@/store/posterStore';
import type { BlendMode, ColorMode } from '@/types/poster';

const BLEND_OPTIONS: { value: BlendMode; label: string }[] = [
  { value: 'normal',      label: 'NORMAL' },
  { value: 'multiply',    label: 'MULTIPLY' },
  { value: 'screen',      label: 'SCREEN' },
  { value: 'overlay',     label: 'OVERLAY' },
  { value: 'soft-light',  label: 'SOFT LIGHT' },
  { value: 'hard-light',  label: 'HARD LIGHT' },
  { value: 'darken',      label: 'DARKEN' },
  { value: 'lighten',     label: 'LIGHTEN' },
  { value: 'color-dodge', label: 'COLOR DODGE' },
  { value: 'color-burn',  label: 'COLOR BURN' },
  { value: 'difference',  label: 'DIFFERENCE' },
  { value: 'exclusion',   label: 'EXCLUSION' },
  { value: 'hue',         label: 'HUE' },
  { value: 'saturation',  label: 'SATURATION' },
  { value: 'color',       label: 'COLOR' },
  { value: 'luminosity',  label: 'LUMINOSITY' },
];

export function ColorPanel() {
  const color = usePosterStore((s) => s.color);
  const patch = usePosterStore((s) => s.patchColor);

  return (
    <div className="flex flex-col gap-3">
      <Select<ColorMode>
        label="MODE"
        value={color.mode}
        onChange={(v) => patch({ mode: v })}
        options={[
          { value: 'mono', label: 'MONO' },
          { value: 'duo', label: 'DUOTONE' },
          { value: 'tri', label: 'TRITONE' },
        ]}
      />
      <Swatch label="BACKGROUND" value={color.background} onChange={(v) => patch({ background: v })} />
      <Swatch label="FOREGROUND" value={color.foreground} onChange={(v) => patch({ foreground: v })} />
      <Swatch label="ACCENT" value={color.accent} onChange={(v) => patch({ accent: v })} />
      {color.mode === 'tri' && (
        <Slider label="RAMP" value={color.duotoneRamp} min={0.05} max={0.95} step={0.01} precision={2} onChange={(v) => patch({ duotoneRamp: v })} />
      )}

      <div className="border-t border-edge pt-3 flex flex-col gap-3">
        <div className="hud-label">IMAGE OVERLAY</div>
        <Select<BlendMode>
          label="BLEND MODE"
          value={color.blendMode}
          onChange={(v) => patch({ blendMode: v })}
          options={BLEND_OPTIONS}
        />
        <Slider
          label="OPACITY"
          value={color.imageOpacity}
          min={0}
          max={1}
          step={0.01}
          precision={2}
          unit="×"
          onChange={(v) => patch({ imageOpacity: v })}
        />
        <BlendQuickPicks
          current={color.blendMode}
          onPick={(v) => patch({ blendMode: v })}
        />
      </div>
    </div>
  );
}

function BlendQuickPicks({
  current,
  onPick,
}: {
  current: BlendMode;
  onPick: (v: BlendMode) => void;
}) {
  const picks: BlendMode[] = ['normal', 'multiply', 'screen', 'soft-light', 'difference', 'luminosity'];
  return (
    <div className="grid grid-cols-3 gap-1">
      {picks.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPick(p)}
          className={`text-2xs tracking-hud uppercase py-1.5 border transition-colors ${
            current === p
              ? 'border-paper text-paper'
              : 'border-edge text-ash hover:border-ash hover:text-paper'
          }`}
          title={p}
        >
          {p === 'normal'      ? 'NRML' :
           p === 'multiply'    ? 'MULT' :
           p === 'screen'      ? 'SCRN' :
           p === 'soft-light'  ? 'SOFT' :
           p === 'difference'  ? 'DIFF' :
                                 'LUMA'}
        </button>
      ))}
    </div>
  );
}
