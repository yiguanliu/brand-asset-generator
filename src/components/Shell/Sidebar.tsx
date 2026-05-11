import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@/components/Controls/Disclosure';
import { SourcePanel } from '@/components/Panels/SourcePanel';
import { DitherPanel } from '@/components/Panels/DitherPanel';
import { ColorPanel } from '@/components/Panels/ColorPanel';
import { LayoutPanel } from '@/components/Panels/LayoutPanel';
import { TypographyPanel } from '@/components/Panels/TypographyPanel';
import { HUDPanel } from '@/components/Panels/HUDPanel';
import { FinishPanel } from '@/components/Panels/FinishPanel';
import { PresetPanel } from '@/components/Panels/PresetPanel';
import { ExportPanel } from '@/components/Panels/ExportPanel';
import { useUIStore } from '@/store/uiStore';

interface Props {
  getThumbnail: () => string;
  onExport: (ratio: number) => Promise<void>;
}

const COLLAPSED_W = 36;

export function Sidebar({ getThumbnail, onExport }: Props) {
  const open = useUIStore((s) => s.sidebarOpen);
  const width = useUIStore((s) => s.sidebarWidth);
  const setWidth = useUIStore((s) => s.setSidebarWidth);
  const toggle = useUIStore((s) => s.toggleSidebar);

  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startW: width };
      setDragging(true);
    },
    [width],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = e.clientX - dragRef.current.startX;
      setWidth(dragRef.current.startW + delta);
    };
    const onUp = () => {
      dragRef.current = null;
      setDragging(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, setWidth]);

  const effectiveWidth = open ? width : COLLAPSED_W;

  return (
    <motion.aside
      initial={false}
      animate={{ width: effectiveWidth }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      className="relative border-r border-edge bg-void flex-shrink-0 flex flex-col chrome-noselect"
      style={{ width: effectiveWidth }}
    >
      {/* Header / Toggle */}
      <div
        className={`flex items-center border-b border-edge ${
          open ? 'justify-between px-3 py-2' : 'justify-center py-2'
        }`}
      >
        {open && (
          <>
            <span className="text-2xs tracking-hud uppercase text-ash">
              CONTROL · 01
            </span>
            <span className="text-2xs tracking-hud uppercase text-paper">
              PARAMETERS
            </span>
          </>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          className={`inline-flex items-center justify-center border border-edge hover:border-paper hover:bg-char transition-colors ${
            open ? 'w-5 h-5 ml-2' : 'w-6 h-6'
          }`}
        >
          <span className="text-paper text-2xs leading-none">
            {open ? '‹' : '›'}
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            <Disclosure title="SOURCE" code="01" defaultOpen>
              <SourcePanel />
            </Disclosure>
            <Disclosure title="DITHER" code="02" defaultOpen>
              <DitherPanel />
            </Disclosure>
            <Disclosure title="COLOR" code="03" defaultOpen={false}>
              <ColorPanel />
            </Disclosure>
            <Disclosure title="LAYOUT" code="04" defaultOpen={false}>
              <LayoutPanel />
            </Disclosure>
            <Disclosure title="TYPOGRAPHY" code="05" defaultOpen={false}>
              <TypographyPanel />
            </Disclosure>
            <Disclosure title="HUD / ORNAMENTS" code="06" defaultOpen={false}>
              <HUDPanel />
            </Disclosure>
            <Disclosure title="FINISH" code="07" defaultOpen={false}>
              <FinishPanel />
            </Disclosure>
            <Disclosure title="PRESETS" code="08" defaultOpen>
              <PresetPanel getThumbnail={getThumbnail} />
            </Disclosure>
            <Disclosure title="EXPORT" code="09" defaultOpen>
              <ExportPanel onExport={onExport} />
            </Disclosure>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed-rail vertical wordmark */}
      {!open && (
        <div className="flex-1 flex flex-col items-center gap-4 pt-4 text-2xs tracking-hud uppercase text-ash">
          <span
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            CONTROL · PARAMETERS
          </span>
        </div>
      )}

      {/* Resize handle */}
      {open && (
        <div
          onMouseDown={onMouseDown}
          onDoubleClick={() => setWidth(320)}
          title="Drag to resize · Double-click to reset"
          className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize group ${
            dragging ? 'bg-paper/20' : 'hover:bg-paper/10'
          }`}
        >
          <div
            className={`absolute top-1/2 right-0 -translate-y-1/2 w-px h-8 transition-colors ${
              dragging ? 'bg-paper' : 'bg-edge group-hover:bg-paper'
            }`}
          />
        </div>
      )}
    </motion.aside>
  );
}
