import { motion } from 'framer-motion';
import { usePosterStore } from '@/store/posterStore';

interface Props {
  ditherMs: number;
  busy: boolean;
}

export function StatusBar({ ditherMs, busy }: Props) {
  const algo = usePosterStore((s) => s.dither.algorithm);
  const pixel = usePosterStore((s) => s.dither.pixelScale);
  const source = usePosterStore((s) => s.source);

  return (
    <footer className="h-8 border-t border-edge flex items-stretch chrome-noselect bg-void">
      <div className="flex items-center gap-2 px-3 border-r border-edge">
        <motion.span
          className={`block w-1.5 h-1.5 ${busy ? 'bg-blood' : 'bg-paper'}`}
          animate={busy ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
          transition={{ duration: 0.6, repeat: busy ? Infinity : 0 }}
        />
        <span className="text-3xs tracking-hud uppercase text-ash">
          {busy ? 'PROCESSING' : 'READY'}
        </span>
      </div>
      <Cell label="DITHER" value={algo.toUpperCase()} />
      <Cell label="PIXEL" value={`${pixel}×`} />
      <Cell label="LAST" value={`${Math.round(ditherMs)}MS`} />
      <Cell label="SOURCE" value={source.imageName ? source.imageName : 'NONE'} />
      <div className="ml-auto flex items-center px-3 gap-2">
        <span className="text-3xs tracking-hud uppercase text-ash">
          KEYS
        </span>
        <kbd className="text-3xs tracking-hud uppercase text-paper border border-edge px-1.5 py-0.5">R</kbd>
        <span className="text-3xs text-ash">RESET</span>
        <kbd className="text-3xs tracking-hud uppercase text-paper border border-edge px-1.5 py-0.5">E</kbd>
        <span className="text-3xs text-ash">EXPORT</span>
        <kbd className="text-3xs tracking-hud uppercase text-paper border border-edge px-1.5 py-0.5">,</kbd>
        <span className="text-3xs text-ash">SETTINGS</span>
      </div>
    </footer>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 border-r border-edge max-w-[260px]">
      <span className="text-3xs tracking-hud uppercase text-ash">{label}</span>
      <span className="text-3xs tracking-wide2 uppercase text-paper truncate" title={value}>
        {value}
      </span>
    </div>
  );
}
