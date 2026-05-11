import { useId } from 'react';
import clsx from 'clsx';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
  precision?: number;
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
  precision,
  className,
}: SliderProps) {
  const id = useId();
  const display =
    precision !== undefined ? value.toFixed(precision) : Math.round(value).toString();

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="hud-label">
          {label}
        </label>
        <div className="hud-value tabular-nums">
          {display}
          {unit && <span className="text-ash"> {unit}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
