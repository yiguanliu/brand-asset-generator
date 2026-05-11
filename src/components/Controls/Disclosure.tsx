import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface DisclosureProps {
  title: string;
  code?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function Disclosure({
  title,
  code,
  defaultOpen = true,
  children,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={clsx('border-t border-edge', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-char transition-colors group"
      >
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'inline-block w-2 transition-transform',
              open ? 'rotate-90' : 'rotate-0',
            )}
          >
            ▸
          </span>
          <span className="text-xs tracking-hud uppercase text-paper">
            {title}
          </span>
        </div>
        {code && (
          <span className="text-3xs tracking-hud text-ash">{code}</span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 flex flex-col gap-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
