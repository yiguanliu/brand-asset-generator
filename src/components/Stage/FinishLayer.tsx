import { Group, Image as KonvaImage, Rect } from 'react-konva';
import { useEffect, useState } from 'react';
import { usePosterStore } from '@/store/posterStore';

interface Props {
  width: number;
  height: number;
}

export function FinishLayer({ width, height }: Props) {
  const finish = usePosterStore((s) => s.finish);
  const [grainCanvas, setGrainCanvas] = useState<HTMLCanvasElement | null>(null);
  const [scanlineCanvas, setScanlineCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (finish.grainAmount <= 0) {
      setGrainCanvas(null);
      return;
    }
    // Render at a smaller base then upscale via Konva — drastically less pixel work.
    const size = Math.max(1, finish.grainSize);
    const baseW = Math.max(64, Math.floor(width / (2 * size)));
    const baseH = Math.max(64, Math.floor(height / (2 * size)));
    const c = document.createElement('canvas');
    c.width = baseW;
    c.height = baseH;
    const ctx = c.getContext('2d')!;
    const id = ctx.createImageData(baseW, baseH);
    const a = Math.floor(255 * finish.grainAmount);
    const data = id.data;
    // One pass: per-pixel grain at base resolution. Konva scales to canvas size.
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() - 0.5;
      const gray = v > 0 ? 255 : 0;
      const alpha = Math.floor(Math.abs(v) * 2 * a);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
      data[i + 3] = alpha;
    }
    ctx.putImageData(id, 0, 0);
    setGrainCanvas(c);
  }, [finish.grainAmount, finish.grainSize, width, height]);

  useEffect(() => {
    if (finish.scanlines <= 0) {
      setScanlineCanvas(null);
      return;
    }
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = Math.max(2, Math.floor(finish.scanSpacing));
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = `rgba(0,0,0,${finish.scanlines})`;
    ctx.fillRect(0, 0, c.width, 1);
    setScanlineCanvas(c);
  }, [finish.scanlines, finish.scanSpacing]);

  return (
    <Group listening={false}>
      {grainCanvas && (
        <KonvaImage
          image={grainCanvas as unknown as HTMLImageElement}
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={1}
          listening={false}
        />
      )}
      {scanlineCanvas && (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fillPatternImage={scanlineCanvas as unknown as HTMLImageElement}
          fillPatternRepeat="repeat"
          listening={false}
        />
      )}
      {finish.vignette > 0 && (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fillRadialGradientStartPoint={{ x: width / 2, y: height / 2 }}
          fillRadialGradientStartRadius={Math.min(width, height) * 0.2}
          fillRadialGradientEndPoint={{ x: width / 2, y: height / 2 }}
          fillRadialGradientEndRadius={Math.max(width, height) * 0.7}
          fillRadialGradientColorStops={[0, 'rgba(0,0,0,0)', 1, `rgba(0,0,0,${finish.vignette})`]}
          listening={false}
        />
      )}
    </Group>
  );
}
