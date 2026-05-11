import { Group, Line, Rect, Text } from 'react-konva';
import { usePosterStore } from '@/store/posterStore';

interface Props {
  width: number;
  height: number;
}

const HUD_FONT = 'JetBrains Mono, IBM Plex Mono, ui-monospace, monospace';

export function HUDLayer({ width, height }: Props) {
  const hud = usePosterStore((s) => s.hud);
  const layout = usePosterStore((s) => s.layout);
  const color = usePosterStore((s) => s.color);

  const mt = layout.marginTop;
  const mr = layout.marginRight;
  const mb = layout.marginBottom;
  const ml = layout.marginLeft;

  const fg = color.foreground;
  const ash = color.foreground === '#EFEAE0' ? '#7A776F' : color.foreground;
  const accent = color.accent;

  return (
    <Group listening={false}>
      {/* Corner readouts */}
      {hud.corners.tl.enabled && (
        <CornerReadout
          x={ml}
          y={mt}
          anchor="tl"
          label={hud.corners.tl.label}
          value={hud.corners.tl.value}
          color={hud.corners.tl.accent ? accent : fg}
          mute={ash}
        />
      )}
      {hud.corners.tr.enabled && (
        <CornerReadout
          x={width - mr}
          y={mt}
          anchor="tr"
          label={hud.corners.tr.label}
          value={hud.corners.tr.value}
          color={hud.corners.tr.accent ? accent : fg}
          mute={ash}
        />
      )}
      {hud.corners.bl.enabled && (
        <CornerReadout
          x={ml}
          y={height - mb}
          anchor="bl"
          label={hud.corners.bl.label}
          value={hud.corners.bl.value}
          color={hud.corners.bl.accent ? accent : fg}
          mute={ash}
        />
      )}
      {hud.corners.br.enabled && (
        <CornerReadout
          x={width - mr}
          y={height - mb}
          anchor="br"
          label={hud.corners.br.label}
          value={hud.corners.br.value}
          color={hud.corners.br.accent ? accent : fg}
          mute={ash}
        />
      )}

      {/* Tick scrubber */}
      {hud.ticks.enabled && (
        <TickBar
          x={ml}
          y={hud.ticks.yPercent * height}
          w={width - ml - mr}
          count={hud.ticks.count}
          leftLabel={hud.ticks.leftLabel}
          rightLabel={hud.ticks.rightLabel}
          color={fg}
          mute={ash}
        />
      )}

      {/* Status checklist */}
      {hud.checklist.enabled && (
        <Checklist
          x={hud.checklist.xPercent * width}
          y={hud.checklist.yPercent * height}
          items={hud.checklist.items}
          color={fg}
        />
      )}

      {/* Pagination dots */}
      {hud.pagination.enabled && (
        <Pagination
          x={width / 2}
          y={height - mb / 2}
          count={hud.pagination.count}
          active={hud.pagination.active}
          color={fg}
          mute={ash}
        />
      )}

      {/* Plus mark */}
      {hud.plusMark.enabled && (
        <PlusMark
          x={width - mr}
          y={height - mb - hud.plusMark.size}
          size={hud.plusMark.size}
          color={fg}
        />
      )}

      {/* Barcode */}
      {hud.barcode.enabled && (
        <Barcode
          x={ml}
          y={height - mb - hud.barcode.height}
          w={hud.barcode.width}
          h={hud.barcode.height}
          color={fg}
        />
      )}

      {/* Frame border */}
      {hud.frame.enabled && (
        <Rect
          x={hud.frame.inset}
          y={hud.frame.inset}
          width={width - hud.frame.inset * 2}
          height={height - hud.frame.inset * 2}
          stroke={fg}
          strokeWidth={hud.frame.stroke}
          listening={false}
        />
      )}

      {/* Registration crosses (four corners) */}
      {hud.registration.enabled && (
        <>
          <Registration x={hud.registration.size * 2} y={hud.registration.size * 2} size={hud.registration.size} color={fg} />
          <Registration x={width - hud.registration.size * 2} y={hud.registration.size * 2} size={hud.registration.size} color={fg} />
          <Registration x={hud.registration.size * 2} y={height - hud.registration.size * 2} size={hud.registration.size} color={fg} />
          <Registration x={width - hud.registration.size * 2} y={height - hud.registration.size * 2} size={hud.registration.size} color={fg} />
        </>
      )}

      {/* Diagonal stripe blocks */}
      {hud.stripes.enabled && (
        <Stripes
          x={ml}
          y={height - mb - hud.stripes.height - 12}
          count={hud.stripes.count}
          w={hud.stripes.width}
          h={hud.stripes.height}
          angle={hud.stripes.angle}
          color={fg}
        />
      )}
    </Group>
  );
}

function CornerReadout({
  x,
  y,
  anchor,
  label,
  value,
  color,
  mute,
}: {
  x: number;
  y: number;
  anchor: 'tl' | 'tr' | 'bl' | 'br';
  label: string;
  value: string;
  color: string;
  mute: string;
}) {
  const right = anchor === 'tr' || anchor === 'br';
  const bottom = anchor === 'bl' || anchor === 'br';
  const align = right ? 'right' : 'left';
  const yLabel = bottom ? y - 22 : y;
  const yValue = bottom ? y - 10 : y + 12;
  // Provide enough width to render aligned text near the edge anchor
  const w = 200;
  const xText = right ? x - w : x;
  return (
    <Group listening={false}>
      <Text text={label.toUpperCase()} x={xText} y={yLabel} width={w} align={align} fontFamily={HUD_FONT} fontSize={9} fill={mute} letterSpacing={1.5} />
      <Text text={value.toUpperCase()} x={xText} y={yValue} width={w} align={align} fontFamily={HUD_FONT} fontSize={10} fill={color} letterSpacing={1} />
    </Group>
  );
}

function TickBar({
  x, y, w, count, leftLabel, rightLabel, color, mute,
}: { x: number; y: number; w: number; count: number; leftLabel: string; rightLabel: string; color: string; mute: string }) {
  const ticks: number[] = [];
  for (let i = 0; i < count; i++) ticks.push(i);
  const step = w / (count - 1);
  return (
    <Group listening={false}>
      <Line points={[x, y, x + w, y]} stroke={mute} strokeWidth={0.5} />
      {ticks.map((i) => {
        const isMajor = i % 5 === 0;
        const tx = x + i * step;
        const len = isMajor ? 6 : 3;
        return (
          <Line
            key={i}
            points={[tx, y, tx, y + len]}
            stroke={isMajor ? color : mute}
            strokeWidth={0.5}
          />
        );
      })}
      {/* Playhead triangle */}
      <Line
        points={[
          x + w * 0.62 - 4,
          y - 6,
          x + w * 0.62 + 4,
          y - 6,
          x + w * 0.62,
          y - 1,
        ]}
        closed
        fill={color}
      />
      <Text text={leftLabel.toUpperCase()} x={x} y={y + 12} fontFamily={HUD_FONT} fontSize={9} fill={mute} letterSpacing={1.5} />
      <Text
        text={rightLabel.toUpperCase()}
        x={x + w - 80}
        y={y + 12}
        width={80}
        align="right"
        fontFamily={HUD_FONT}
        fontSize={9}
        fill={mute}
        letterSpacing={1.5}
      />
    </Group>
  );
}

function Checklist({
  x, y, items, color,
}: { x: number; y: number; items: string[]; color: string }) {
  return (
    <Group listening={false}>
      {items.map((it, i) => (
        <Text
          key={i}
          text={it.toUpperCase()}
          x={x}
          y={y + i * 13}
          fontFamily={HUD_FONT}
          fontSize={9}
          fill={color}
          letterSpacing={1.5}
        />
      ))}
    </Group>
  );
}

function Pagination({
  x, y, count, active, color, mute,
}: { x: number; y: number; count: number; active: number; color: string; mute: string }) {
  const gap = 10;
  const totalW = (count - 1) * gap;
  const start = x - totalW / 2;
  return (
    <Group listening={false}>
      {Array.from({ length: count }).map((_, i) => (
        <Rect
          key={i}
          x={start + i * gap - 1.5}
          y={y - 1.5}
          width={3}
          height={3}
          fill={i === active ? color : mute}
          cornerRadius={1.5}
        />
      ))}
    </Group>
  );
}

function PlusMark({
  x, y, size, color,
}: { x: number; y: number; size: number; color: string }) {
  const s = size / 2;
  return (
    <Group listening={false} x={x - size} y={y}>
      <Line points={[s, 0, s, size]} stroke={color} strokeWidth={1.4} />
      <Line points={[0, s, size, s]} stroke={color} strokeWidth={1.4} />
    </Group>
  );
}

function Barcode({
  x, y, w, h, color,
}: { x: number; y: number; w: number; h: number; color: string }) {
  const bars: { x: number; w: number }[] = [];
  let cursor = 0;
  let i = 0;
  // deterministic pseudo-random pattern
  const seed = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
  while (cursor < w) {
    const barW = 1 + Math.floor(seed(i) * 3);
    const gap = 1 + Math.floor(seed(i + 1) * 2);
    bars.push({ x: cursor, w: barW });
    cursor += barW + gap;
    i++;
  }
  return (
    <Group listening={false} x={x} y={y}>
      {bars.map((b, idx) => (
        <Rect key={idx} x={b.x} y={0} width={b.w} height={h} fill={color} />
      ))}
    </Group>
  );
}

function Registration({
  x, y, size, color,
}: { x: number; y: number; size: number; color: string }) {
  return (
    <Group listening={false} x={x} y={y}>
      <Line points={[-size, 0, size, 0]} stroke={color} strokeWidth={0.75} />
      <Line points={[0, -size, 0, size]} stroke={color} strokeWidth={0.75} />
      <Line
        points={[
          size * 0.6 * Math.cos(0), size * 0.6 * Math.sin(0),
          size * 0.6 * Math.cos(Math.PI * 2 / 16), size * 0.6 * Math.sin(Math.PI * 2 / 16),
        ]}
        stroke={color}
        strokeWidth={0.5}
      />
    </Group>
  );
}

function Stripes({
  x, y, count, w, h, angle, color,
}: { x: number; y: number; count: number; w: number; h: number; angle: number; color: string }) {
  const gap = 12;
  return (
    <Group listening={false}>
      {Array.from({ length: count }).map((_, i) => (
        <Group key={i} x={x + i * (w + gap)} y={y} clipFunc={(ctx) => { ctx.rect(0, 0, w, h); }}>
          <StripeFill w={w} h={h} angle={angle} color={color} />
        </Group>
      ))}
    </Group>
  );
}

function StripeFill({ w, h, angle, color }: { w: number; h: number; angle: number; color: string }) {
  const lines: number[][] = [];
  const span = Math.max(w, h) * 2;
  const step = 5;
  // rotate around top-left
  for (let i = -span; i < span; i += step) {
    lines.push([i, -span, i, span]);
  }
  return (
    <Group rotation={angle} offsetX={0} offsetY={0}>
      {lines.map((p, i) => (
        <Line key={i} points={p} stroke={color} strokeWidth={1} />
      ))}
    </Group>
  );
}
