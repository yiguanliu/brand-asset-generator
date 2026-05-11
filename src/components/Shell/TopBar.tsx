import { motion } from 'framer-motion';
import { usePosterStore } from '@/store/posterStore';
import { useUIStore } from '@/store/uiStore';

export function TopBar() {
  const layout = usePosterStore((s) => s.layout);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  return (
    <header className="h-10 border-b border-edge flex items-stretch chrome-noselect bg-void z-10 relative">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className="w-10 flex items-center justify-center border-r border-edge hover:bg-char transition-colors"
        title="Toggle sidebar"
      >
        <span className="flex flex-col gap-[3px]">
          <span className={`block w-4 h-px transition-colors ${sidebarOpen ? 'bg-paper' : 'bg-ash'}`} />
          <span className={`block w-4 h-px transition-colors ${sidebarOpen ? 'bg-paper' : 'bg-ash'}`} />
          <span className={`block w-4 h-px transition-colors ${sidebarOpen ? 'bg-paper' : 'bg-ash'}`} />
        </span>
      </button>
      <div className="flex items-center gap-3 px-4 border-r border-edge">
        <span className="font-mono text-paper text-xs tracking-hud font-bold">
          CDG / HOMME PLUS
        </span>
        <span className="font-mono text-2xs text-ash tracking-hud">
          ASSET GENERATOR · v0.1
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 border-r border-edge">
        <motion.span
          className="block w-1.5 h-1.5 bg-blood"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span className="text-2xs tracking-hud uppercase text-ash">LIVE</span>
      </div>
      <div className="ml-auto flex items-center gap-4 px-4 border-r border-edge">
        <span className="text-2xs tracking-hud uppercase text-ash">
          CANVAS
        </span>
        <span className="text-2xs tracking-hud text-paper tabular-nums">
          {layout.width} × {layout.height} · {layout.aspect}
        </span>
      </div>
      <SettingsButton />
    </header>
  );
}

function SettingsButton() {
  const open = useUIStore((s) => s.settingsOpen);
  const setOpen = useUIStore((s) => s.setSettingsOpen);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label="Open settings"
      title="Settings · ,"
      className="w-10 flex items-center justify-center hover:bg-char transition-colors group"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={`text-paper transition-transform ${open ? 'rotate-45' : 'group-hover:rotate-45'} duration-300`}
        aria-hidden
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.31 16.96l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.31l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 19.69 7.04l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>
  );
}
