import { Stage, Layer, Group, Line, Rect } from 'react-konva';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type Konva from 'konva';
import { usePosterStore } from '@/store/posterStore';
import { ImageLayer } from './ImageLayer';
import { TextLayer } from './TextLayer';
import { HUDLayer } from './HUDLayer';
import { FinishLayer } from './FinishLayer';

interface Props {
  className?: string;
}

export const PosterStage = forwardRef<Konva.Stage, Props>(function PosterStage(
  { className },
  ref,
) {
  const layout = usePosterStore((s) => s.layout);
  const color = usePosterStore((s) => s.color);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 800 });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setContainerSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute scale to fit the canvas inside the container while preserving aspect
  const PADDING = 48;
  const availW = Math.max(0, containerSize.w - PADDING * 2);
  const availH = Math.max(0, containerSize.h - PADDING * 2);
  const sx = availW / layout.width;
  const sy = availH / layout.height;
  const scale = Math.min(sx, sy, 1.4);
  const stageW = layout.width * scale;
  const stageH = layout.height * scale;

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%)`,
          width: stageW,
          height: stageH,
        }}
      >
        {/* Accent frame around the canvas — sits behind the stage and pokes out by FRAME_OFFSET */}
        <CanvasFrame />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            background: color.background,
            boxShadow:
              '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(var(--c-edge) / 0.8)',
          }}
        >
          <Stage
            ref={ref}
            width={layout.width}
            height={layout.height}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer listening={true}>
              {/* Clip everything that draws on the poster to the canvas rect */}
              <Group
                clipX={0}
                clipY={0}
                clipWidth={layout.width}
                clipHeight={layout.height}
              >
                <ImageLayer width={layout.width} height={layout.height} />
                <HUDLayer width={layout.width} height={layout.height} />
                <TextLayer
                  width={layout.width}
                  height={layout.height}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
                <FinishLayer width={layout.width} height={layout.height} />
              </Group>
              {/* Guides drawn over the clipped content (designer aids, never exported as borders) */}
              {layout.gridOverlay && (
                <GridOverlay width={layout.width} height={layout.height} />
              )}
              {layout.safeArea && (
                <SafeArea width={layout.width} height={layout.height} />
              )}
            </Layer>
          </Stage>
        </div>

        {/* Corner crosshair tags — sit on top of the frame so the user reads it as the canvas boundary */}
        <CanvasCornerTags w={stageW} h={stageH} />
      </div>
    </div>
  );
});

const FRAME_OFFSET = 6;
const FRAME_THICKNESS = 2;

function CanvasFrame() {
  // Accent-colored ring that sits OUTSIDE the canvas. Pure DOM, never exported.
  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -FRAME_OFFSET,
          left: -FRAME_OFFSET,
          right: -FRAME_OFFSET,
          bottom: -FRAME_OFFSET,
          border: `${FRAME_THICKNESS}px solid rgb(var(--c-blood))`,
          pointerEvents: 'none',
          boxShadow:
            '0 0 0 1px rgba(var(--c-blood) / 0.25), 0 0 24px 0 rgba(var(--c-blood) / 0.18)',
        }}
      />
    </>
  );
}

function CanvasCornerTags({ w, h }: { w: number; h: number }) {
  // L-shaped tick marks at all four corners + "CANVAS" caption above frame.
  const inset = -FRAME_OFFSET - 6;
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <CornerTick top={inset} left={inset} d="tl" />
      <CornerTick top={inset} right={inset} d="tr" />
      <CornerTick bottom={inset} left={inset} d="bl" />
      <CornerTick bottom={inset} right={inset} d="br" />

      <span
        style={{
          position: 'absolute',
          top: -22,
          left: 0,
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgb(var(--c-blood))',
          fontFamily: 'var(--ui-font-mono)',
        }}
      >
        CANVAS
      </span>
      <span
        style={{
          position: 'absolute',
          top: -22,
          right: 0,
          fontSize: '0.625rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgb(var(--c-ash))',
          fontFamily: 'var(--ui-font-mono)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(w)} × {Math.round(h)} · CROPPED OUTSIDE
      </span>
    </div>
  );
}

function CornerTick({
  d,
  top,
  left,
  right,
  bottom,
}: {
  d: 'tl' | 'tr' | 'bl' | 'br';
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}) {
  const len = 10;
  const thick = 2;
  const isLeft = d.endsWith('l');
  const isTop = d.startsWith('t');
  // Place the two strokes so they meet at the corner pointing INTO the canvas
  const hStyle: React.CSSProperties = {
    position: 'absolute',
    height: thick,
    width: len,
    background: 'rgb(var(--c-blood))',
    top: isTop ? 0 : 'auto',
    bottom: isTop ? 'auto' : 0,
    left: isLeft ? 0 : 'auto',
    right: isLeft ? 'auto' : 0,
  };
  const vStyle: React.CSSProperties = {
    position: 'absolute',
    width: thick,
    height: len,
    background: 'rgb(var(--c-blood))',
    top: isTop ? 0 : 'auto',
    bottom: isTop ? 'auto' : 0,
    left: isLeft ? 0 : 'auto',
    right: isLeft ? 'auto' : 0,
  };
  return (
    <span
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width: len,
        height: len,
        pointerEvents: 'none',
      }}
    >
      <span style={hStyle} />
      <span style={vStyle} />
    </span>
  );
}

function GridOverlay({ width, height }: { width: number; height: number }) {
  const lines = [];
  const cols = 8;
  const rows = 12;
  for (let i = 1; i < cols; i++) {
    const x = (i / cols) * width;
    lines.push(<Line key={`v${i}`} points={[x, 0, x, height]} stroke="#A8202C" strokeWidth={0.5} opacity={0.4} listening={false} />);
  }
  for (let i = 1; i < rows; i++) {
    const y = (i / rows) * height;
    lines.push(<Line key={`h${i}`} points={[0, y, width, y]} stroke="#A8202C" strokeWidth={0.5} opacity={0.4} listening={false} />);
  }
  return <>{lines}</>;
}

function SafeArea({ width, height }: { width: number; height: number }) {
  const inset = Math.min(width, height) * 0.06;
  return (
    <Rect
      x={inset}
      y={inset}
      width={width - inset * 2}
      height={height - inset * 2}
      stroke="#A8202C"
      strokeWidth={1}
      dash={[6, 6]}
      opacity={0.4}
      listening={false}
    />
  );
}
