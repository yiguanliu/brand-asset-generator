import { useId } from 'react';
import clsx from 'clsx';

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className,
}: TextFieldProps) {
  const id = useId();
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="hud-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-bare w-full"
      />
    </div>
  );
}
