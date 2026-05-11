import { Dropzone } from '@/components/Controls/Dropzone';
import { SampleGallery } from '@/components/Controls/SampleGallery';
import { DemoGallery } from '@/components/Controls/DemoGallery';
import { Slider } from '@/components/Controls/Slider';
import { Select } from '@/components/Controls/Select';
import { usePosterStore } from '@/store/posterStore';
import type { FitMode } from '@/types/poster';

export function SourcePanel() {
  const source = usePosterStore((s) => s.source);
  const patch = usePosterStore((s) => s.patchSource);

  const fillFrame = () => {
    patch({
      fitMode: 'cover',
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    });
  };

  const fitContain = () => {
    patch({
      fitMode: 'contain',
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <DemoGallery />
      <SampleGallery />
      <Dropzone />
      {source.imageDataUrl && (
        <>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={fillFrame}
              className="border border-edge hover:border-paper text-2xs tracking-hud uppercase py-2 transition-colors"
              title="Fill the canvas, preserve image ratio (crops overflow)"
            >
              ⤢ FILL FRAME
            </button>
            <button
              type="button"
              onClick={fitContain}
              className="border border-edge hover:border-paper text-2xs tracking-hud uppercase py-2 transition-colors"
              title="Fit inside the canvas, preserve image ratio (letterbox)"
            >
              ⤡ FIT INSIDE
            </button>
          </div>
          <Select<FitMode>
            label="FIT"
            value={source.fitMode}
            onChange={(v) => patch({ fitMode: v })}
            options={[
              { value: 'contain', label: 'CONTAIN' },
              { value: 'cover', label: 'COVER' },
              { value: 'native', label: 'NATIVE' },
            ]}
          />
          <Slider label="SCALE" value={source.scale} min={0.1} max={3} step={0.01} precision={2} onChange={(v) => patch({ scale: v })} />
          <Slider label="OFFSET · X" value={source.offsetX} min={-0.5} max={0.5} step={0.005} precision={3} onChange={(v) => patch({ offsetX: v })} />
          <Slider label="OFFSET · Y" value={source.offsetY} min={-0.5} max={0.5} step={0.005} precision={3} onChange={(v) => patch({ offsetY: v })} />
          <Slider label="ROTATION" value={source.rotation} min={-180} max={180} step={1} unit="°" onChange={(v) => patch({ rotation: v })} />
        </>
      )}
    </div>
  );
}
