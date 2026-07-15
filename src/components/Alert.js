import React, { useEffect, useRef } from 'react';
import { IconSuccess, IconError, IconClose } from './icons';

export default function Alert({ type = 'success', message = '', onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!message) return;
    // focus the alert for accessibility
    const t = setTimeout(() => {
      if (ref.current) ref.current.focus();
    }, 0);
    const hide = setTimeout(() => onClose && onClose(), 4000);
    return () => {
      clearTimeout(hide);
      clearTimeout(t);
    };
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div ref={ref} className={`alert alert-${type}`} role="status" aria-live="polite" tabIndex={-1}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>{type === 'success' ? <IconSuccess /> : <IconError />}</span>
          <span>{message}</span>
        </div>
        <button aria-label="Cerrar" onClick={() => onClose && onClose()} style={{ background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: 'inherit' }}>
          <IconClose />
        </button>
      </div>
    </div>
  );
}
