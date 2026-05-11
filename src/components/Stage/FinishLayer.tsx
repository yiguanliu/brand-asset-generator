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
    const c = document.createElement('canvas');
    c.width = Math.max(64, Math.floor(width / 2));
    c.height = Math.max(64, Math.floor(height / 2));
    const ctx = c.getContext('2d')!;
    const id = ctx.createImageData(c.width, c.height);
    const a = Math.floor(255 * finish.grainAmount);
    const size = Math.max(1, finish.grainSize);
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const cellY = Math.floor(y / size);
        const cellX = Math.floor(x / size);
        const cellIdx = (cellY * c.width + cellX) * 4;
        if (x % size === 0 && y % size === 0) {
          const v = (Math.random() - 0.5) * 2;
          const gray = v > 0 ? 255 : 0;
          const alpha = Math.floor(Math.abs(v) * a);
          id.data[cellIdx] = gray;
          id.data[cellIdx + 1] = gray;
          id.data[cellIdx + 2] = gray;
          id.data[cellIdx + 3] = alpha;
        }
        const i = (y * c.width + x) * 4;
        if (i !== cellIdx) {
          // copy from cell
          id.data[i] = id.data[cellIdx];
          id.data[i + 1] = id.data[cellIdx + 1];
          id.data[i + 2] = id.data[cellIdx + 2];
          id.data[i + 3] = id.data[cellIdx + 3];
        }
      }
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
