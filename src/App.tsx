import { useCallback, useEffect, useRef } from 'react';
import type Konva from 'konva';
import { Analytics } from '@vercel/analytics/react';
import { TopBar } from '@/components/Shell/TopBar';
import { StatusBar } from '@/components/Shell/StatusBar';
import { Sidebar } from '@/components/Shell/Sidebar';
import { SettingsDrawer } from '@/components/Shell/SettingsDrawer';
import { PosterStage } from '@/components/Stage/PosterStage';
import { usePosterStore } from '@/store/posterStore';
import { useUIStore } from '@/store/uiStore';
import { useDither } from '@/hooks/useDither';
import { captureThumbnail, exportStageToPNG } from '@/lib/export/toPNG';

export default function App() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const layout = usePosterStore((s) => s.layout);
  const reset = usePosterStore((s) => s.reset);
  const { durationMs, busy } = useDither();

  const getThumbnail = useCallback(() => {
    if (!stageRef.current) return '';
    try {
      return captureThumbnail(stageRef.current);
    } catch {
      return '';
    }
  }, []);

  const onExport = useCallback(
    async (ratio: number) => {
      if (!stageRef.current) return;
      exportStageToPNG({
        stage: stageRef.current,
        pixelRatio: ratio,
        width: layout.width,
        height: layout.height,
        aspect: layout.aspect,
      });
    },
    [layout],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'r' || e.key === 'R') {
        reset();
      } else if (e.key === 'e' || e.key === 'E') {
        onExport(2);
      } else if (e.key === ',') {
        const ui = useUIStore.getState();
        ui.setSettingsOpen(!ui.settingsOpen);
      } else if (e.key === 'Escape') {
        const ui = useUIStore.getState();
        if (ui.settingsOpen) ui.setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reset, onExport]);

  return (
    <div className="h-full w-full flex flex-col bg-void text-paper">
      <Analytics />
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <Sidebar getThumbnail={getThumbnail} onExport={onExport} />
        <main className="flex-1 relative overflow-hidden bg-void">
          <PosterStage ref={stageRef} className="absolute inset-0" />
          <StageBackdrop />
        </main>
      </div>
      <StatusBar ditherMs={durationMs} busy={busy} />
      <SettingsDrawer />
    </div>
  );
}

function StageBackdrop() {
  return (
    <>
      <div className="pointer-events-none absolute top-4 left-4 right-4 flex justify-between text-3xs tracking-hud uppercase text-ash chrome-noselect">
        <span>VIEWPORT · 01</span>
        <span>FIT · AUTO</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-between text-3xs tracking-hud uppercase text-ash chrome-noselect">
        <span>STAGE / PREVIEW</span>
        <span>DRAG TEXT TO REPOSITION</span>
      </div>
    </>
  );
}
