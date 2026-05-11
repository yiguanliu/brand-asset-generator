import clsx from 'clsx';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}

export function Toggle({ label, value, onChange, className }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={clsx(
        'flex items-center justify-between w-full text-left group',
        className,
      )}
    >
      <span className="hud-label group-hover:text-paper transition-colors">
        {label}
      </span>
      <span
        className={clsx(
          'inline-flex items-center justify-center w-6 h-3 border transition-colors',
          value
            ? 'bg-paper border-paper'
            : 'bg-transparent border-edge group-hover:border-ash',
        )}
      >
        <span
          className={clsx(
            'w-1 h-1 transition-colors',
            value ? 'bg-void' : 'bg-transparent',
          )}
        />
      </span>
    </button>
  );
}
