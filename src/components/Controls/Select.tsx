import { useId } from 'react';
import clsx from 'clsx';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  className?: string;
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SelectProps<T>) {
  const id = useId();
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="hud-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="appearance-none w-full bg-transparent border border-edge text-paper px-2 py-1.5 text-2xs tracking-wide2 uppercase focus:border-paper outline-none transition-colors cursor-pointer font-mono"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-void">
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ash text-2xs">
          ▾
        </span>
      </div>
    </div>
  );
}
