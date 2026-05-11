import clsx from 'clsx';
import { SWATCHES } from '@/lib/presets/default';

interface SwatchProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function Swatch({ label, value, onChange, className }: SwatchProps) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <span className="hud-label">{label}</span>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => onChange(e.target.value)}
          className="input-bare w-20 text-right uppercase"
        />
      </div>
      <div className="flex gap-1">
        {SWATCHES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={clsx(
              'flex-1 h-5 border transition-all',
              value.toUpperCase() === s.toUpperCase()
                ? 'border-paper scale-y-[1.2]'
                : 'border-edge hover:border-ash',
            )}
            style={{ background: s }}
            aria-label={`Set color ${s}`}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-5 h-5 cursor-pointer bg-transparent border border-edge p-0"
          aria-label="Custom color"
        />
      </div>
    </div>
  );
}
