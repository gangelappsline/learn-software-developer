import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  children: ReactNode;
  label: string;
  onClose?: () => void;
  className?: string;
  blocking?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  children,
  label,
  onClose,
  className = '',
  blocking = false,
}: ModalProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panelRef.current)?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (blocking) event.preventDefault();
        else onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusableElements?.length) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = focusableElements[0]!;
      const last = focusableElements[focusableElements.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [blocking, onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (!blocking && event.target === event.currentTarget) onClose?.();
          }}
        >
          <motion.section
            ref={panelRef}
            className={`modal-panel ${className}`}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            {children}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
