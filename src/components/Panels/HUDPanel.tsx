import { Toggle } from '@/components/Controls/Toggle';
import { Slider } from '@/components/Controls/Slider';
import { TextField } from '@/components/Controls/TextField';
import { usePosterStore } from '@/store/posterStore';
import type { CornerReadout, HUDState } from '@/types/poster';

type CornerKey = keyof HUDState['corners'];
const CORNER_LABELS: Record<CornerKey, string> = {
  tl: 'TOP · LEFT',
  tr: 'TOP · RIGHT',
  bl: 'BOTTOM · LEFT',
  br: 'BOTTOM · RIGHT',
};

export function HUDPanel() {
  const hud = usePosterStore((s) => s.hud);
  const patchHUD = usePosterStore((s) => s.patchHUD);

  const updateCorner = (key: CornerKey, patch: Partial<CornerReadout>) =>
    patchHUD((h) => ({
      ...h,
      corners: { ...h.corners, [key]: { ...h.corners[key], ...patch } },
    }));

  return (
    <div className="flex flex-col gap-4">
      {/* CORNERS */}
      <div className="flex flex-col gap-2">
        <div className="hud-label">CORNERS</div>
        {(Object.keys(hud.corners) as CornerKey[]).map((k) => (
          <div key={k} className="border border-edge p-2 flex flex-col gap-1.5">
            <Toggle
              label={CORNER_LABELS[k]}
              value={hud.corners[k].enabled}
              onChange={(v) => updateCorner(k, { enabled: v })}
            />
            {hud.corners[k].enabled && (
              <>
                <TextField label="LABEL" value={hud.corners[k].label} onChange={(v) => updateCorner(k, { label: v })} />
                <TextField label="VALUE" value={hud.corners[k].value} onChange={(v) => updateCorner(k, { value: v })} />
                <Toggle label="ACCENT" value={hud.corners[k].accent} onChange={(v) => updateCorner(k, { accent: v })} />
              </>
            )}
          </div>
        ))}
      </div>

      {/* TICKS */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="TICK SCRUBBER" value={hud.ticks.enabled} onChange={(v) => patchHUD((h) => ({ ...h, ticks: { ...h.ticks, enabled: v } }))} />
        {hud.ticks.enabled && (
          <>
            <Slider label="COUNT" value={hud.ticks.count} min={10} max={200} step={1} onChange={(v) => patchHUD((h) => ({ ...h, ticks: { ...h.ticks, count: v } }))} />
            <Slider label="Y POSITION" value={hud.ticks.yPercent} min={0.05} max={0.95} step={0.01} precision={2} onChange={(v) => patchHUD((h) => ({ ...h, ticks: { ...h.ticks, yPercent: v } }))} />
            <TextField label="LEFT" value={hud.ticks.leftLabel} onChange={(v) => patchHUD((h) => ({ ...h, ticks: { ...h.ticks, leftLabel: v } }))} />
            <TextField label="RIGHT" value={hud.ticks.rightLabel} onChange={(v) => patchHUD((h) => ({ ...h, ticks: { ...h.ticks, rightLabel: v } }))} />
          </>
        )}
      </div>

      {/* CHECKLIST */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="CHECKLIST" value={hud.checklist.enabled} onChange={(v) => patchHUD((h) => ({ ...h, checklist: { ...h.checklist, enabled: v } }))} />
        {hud.checklist.enabled && (
          <>
            <Slider label="X POSITION" value={hud.checklist.xPercent} min={0} max={1} step={0.01} precision={2} onChange={(v) => patchHUD((h) => ({ ...h, checklist: { ...h.checklist, xPercent: v } }))} />
            <Slider label="Y POSITION" value={hud.checklist.yPercent} min={0} max={1} step={0.01} precision={2} onChange={(v) => patchHUD((h) => ({ ...h, checklist: { ...h.checklist, yPercent: v } }))} />
            <textarea
              value={hud.checklist.items.join('\n')}
              onChange={(e) => patchHUD((h) => ({ ...h, checklist: { ...h.checklist, items: e.target.value.split('\n') } }))}
              className="input-bare w-full min-h-[88px] resize-none"
              spellCheck={false}
            />
          </>
        )}
      </div>

      {/* STRIPES */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="STRIPE BLOCKS" value={hud.stripes.enabled} onChange={(v) => patchHUD((h) => ({ ...h, stripes: { ...h.stripes, enabled: v } }))} />
        {hud.stripes.enabled && (
          <>
            <Slider label="COUNT" value={hud.stripes.count} min={1} max={6} step={1} onChange={(v) => patchHUD((h) => ({ ...h, stripes: { ...h.stripes, count: v } }))} />
            <Slider label="WIDTH" value={hud.stripes.width} min={20} max={300} step={4} onChange={(v) => patchHUD((h) => ({ ...h, stripes: { ...h.stripes, width: v } }))} />
            <Slider label="HEIGHT" value={hud.stripes.height} min={10} max={200} step={2} onChange={(v) => patchHUD((h) => ({ ...h, stripes: { ...h.stripes, height: v } }))} />
            <Slider label="ANGLE" value={hud.stripes.angle} min={-90} max={90} step={1} unit="°" onChange={(v) => patchHUD((h) => ({ ...h, stripes: { ...h.stripes, angle: v } }))} />
          </>
        )}
      </div>

      {/* PAGINATION */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="PAGINATION" value={hud.pagination.enabled} onChange={(v) => patchHUD((h) => ({ ...h, pagination: { ...h.pagination, enabled: v } }))} />
        {hud.pagination.enabled && (
          <>
            <Slider label="COUNT" value={hud.pagination.count} min={2} max={40} step={1} onChange={(v) => patchHUD((h) => ({ ...h, pagination: { ...h.pagination, count: v } }))} />
            <Slider label="ACTIVE" value={hud.pagination.active} min={0} max={Math.max(0, hud.pagination.count - 1)} step={1} onChange={(v) => patchHUD((h) => ({ ...h, pagination: { ...h.pagination, active: v } }))} />
          </>
        )}
      </div>

      {/* PLUS MARK */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="PLUS MARK" value={hud.plusMark.enabled} onChange={(v) => patchHUD((h) => ({ ...h, plusMark: { ...h.plusMark, enabled: v } }))} />
        {hud.plusMark.enabled && (
          <Slider label="SIZE" value={hud.plusMark.size} min={8} max={80} step={1} onChange={(v) => patchHUD((h) => ({ ...h, plusMark: { ...h.plusMark, size: v } }))} />
        )}
      </div>

      {/* BARCODE */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="BARCODE" value={hud.barcode.enabled} onChange={(v) => patchHUD((h) => ({ ...h, barcode: { ...h.barcode, enabled: v } }))} />
        {hud.barcode.enabled && (
          <>
            <Slider label="WIDTH" value={hud.barcode.width} min={40} max={400} step={4} onChange={(v) => patchHUD((h) => ({ ...h, barcode: { ...h.barcode, width: v } }))} />
            <Slider label="HEIGHT" value={hud.barcode.height} min={10} max={80} step={1} onChange={(v) => patchHUD((h) => ({ ...h, barcode: { ...h.barcode, height: v } }))} />
          </>
        )}
      </div>

      {/* REGISTRATION */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="REGISTRATION" value={hud.registration.enabled} onChange={(v) => patchHUD((h) => ({ ...h, registration: { ...h.registration, enabled: v } }))} />
        {hud.registration.enabled && (
          <Slider label="SIZE" value={hud.registration.size} min={6} max={40} step={1} onChange={(v) => patchHUD((h) => ({ ...h, registration: { ...h.registration, size: v } }))} />
        )}
      </div>

      {/* FRAME */}
      <div className="border border-edge p-2 flex flex-col gap-1.5">
        <Toggle label="FRAME BORDER" value={hud.frame.enabled} onChange={(v) => patchHUD((h) => ({ ...h, frame: { ...h.frame, enabled: v } }))} />
        {hud.frame.enabled && (
          <>
            <Slider label="STROKE" value={hud.frame.stroke} min={0.5} max={6} step={0.5} precision={1} onChange={(v) => patchHUD((h) => ({ ...h, frame: { ...h.frame, stroke: v } }))} />
            <Slider label="INSET" value={hud.frame.inset} min={0} max={64} step={1} onChange={(v) => patchHUD((h) => ({ ...h, frame: { ...h.frame, inset: v } }))} />
          </>
        )}
      </div>
    </div>
  );
}
