'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import useEscapeKey from '@/hooks/useEscapeKey';
import Icon from '@/components/common/Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/** Dialog over the page. Closes with Escape, the × button or a click outside. */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEscapeKey(onClose, open);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>('input, select, textarea, button:not(.modal__close)')?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal" role="presentation">
      <div className="modal__scrim" onClick={onClose} />
      <div ref={panelRef} className={`modal__panel modal__panel--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__head">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
          <button type="button" className="modal__close icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}
