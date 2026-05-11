import { Text } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { usePosterStore } from '@/store/posterStore';
import type { FontFamilyKey, TextBlock } from '@/types/poster';

const FONT_STACK: Record<FontFamilyKey, string> = {
  mono: 'JetBrains Mono, IBM Plex Mono, ui-monospace, monospace',
  ui: 'Inter Tight, system-ui, sans-serif',
  body: 'DM Mono, ui-monospace, monospace',
  'jp-serif': 'Noto Serif JP, serif',
  'jp-sans': 'Noto Sans JP, sans-serif',
};

function alignAnchor(align: TextBlock['align']): 'left' | 'center' | 'right' {
  return align;
}

interface TextLayerProps {
  width: number;
  height: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function TextLayer({ width, height, selectedId, onSelect }: TextLayerProps) {
  const blocks = usePosterStore((s) => s.text);
  const updateText = usePosterStore((s) => s.updateText);

  return (
    <>
      {blocks
        .filter((b) => b.visible)
        .map((b) => {
          const x = b.x * width;
          const y = b.y * height;
          const content = b.upper ? b.content.toUpperCase() : b.content;
          const align = alignAnchor(b.align);
          // Use offset to align around (x,y) anchor
          const onDrag = (e: KonvaEventObject<DragEvent>) => {
            updateText(b.id, {
              x: e.target.x() / width,
              y: e.target.y() / height,
            });
          };

          return (
            <Text
              key={b.id}
              text={content}
              x={x}
              y={y}
              draggable
              onDragEnd={onDrag}
              onClick={() => onSelect(b.id)}
              onTap={() => onSelect(b.id)}
              onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'move';
              }}
              onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
              }}
              fontFamily={FONT_STACK[b.font]}
              fontSize={b.size}
              fontStyle={b.weight === 700 ? 'bold' : b.weight === 500 ? '500' : 'normal'}
              fill={b.color}
              align={align}
              letterSpacing={b.size * b.tracking}
              lineHeight={b.leading}
              rotation={b.rotation}
              offsetX={
                align === 'center' ? 0.5 * fakeWidth(content, b.size) :
                align === 'right' ? fakeWidth(content, b.size) :
                0
              }
              listening
              perfectDrawEnabled={false}
              shadowEnabled={selectedId === b.id}
              shadowColor="#EFEAE0"
              shadowBlur={0}
              shadowOffsetX={0}
              shadowOffsetY={0}
              shadowOpacity={0}
            />
          );
        })}
    </>
  );
}

// Heuristic so right/center alignment anchors don't require measuring runs
function fakeWidth(text: string, size: number) {
  // average glyph width factor for monospace-ish content
  return text.length * size * 0.6;
}
