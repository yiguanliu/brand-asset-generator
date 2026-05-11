import { Image as KonvaImage, Rect } from 'react-konva';
import { useMemo } from 'react';
import { useDither } from '@/hooks/useDither';
import { usePosterStore } from '@/store/posterStore';

interface ImageLayerProps {
  width: number;
  height: number;
}

export function ImageLayer({ width, height }: ImageLayerProps) {
  const { canvas } = useDither();
  const source = usePosterStore((s) => s.source);
  const background = usePosterStore((s) => s.color.background);
  const blendMode = usePosterStore((s) => s.color.blendMode);
  const imageOpacity = usePosterStore((s) => s.color.imageOpacity);

  const placement = useMemo(() => {
    if (!canvas) return null;
    const fit = source.fitMode;
    const iw = canvas.width;
    const ih = canvas.height;
    const ratio = iw / ih;
    const frame = width / height;
    let w: number, h: number;
    if (fit === 'native') {
      w = iw;
      h = ih;
    } else if (fit === 'contain' ? ratio > frame : ratio < frame) {
      w = width;
      h = width / ratio;
    } else {
      h = height;
      w = height * ratio;
    }
    w *= source.scale;
    h *= source.scale;
    const x = (width - w) / 2 + source.offsetX * width;
    const y = (height - h) / 2 + source.offsetY * height;
    return { x, y, w, h };
  }, [canvas, source.fitMode, source.scale, source.offsetX, source.offsetY, width, height]);

  return (
    <>
      <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
      {canvas && placement && (
        <KonvaImage
          image={canvas as unknown as HTMLImageElement}
          x={placement.x}
          y={placement.y}
          width={placement.w}
          height={placement.h}
          rotation={source.rotation}
          opacity={imageOpacity}
          globalCompositeOperation={
            blendMode === 'normal'
              ? 'source-over'
              : (blendMode as GlobalCompositeOperation)
          }
          listening={false}
        />
      )}
    </>
  );
}
