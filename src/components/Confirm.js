import React, { useEffect, useRef } from 'react';
import { IconWarn, IconCheckSmall } from './icons';

export default function Confirm({ title = 'Confirmar', message = '¿Estás seguro?', visible = false, onConfirm, onCancel }) {
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);
  const overlayRef = useRef(null);
  const titleId = 'confirm-title';

  useEffect(() => {
    if (!visible) return;
    // focus the confirm button when modal opens
    const t = setTimeout(() => {
      if (confirmRef.current) confirmRef.current.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [visible]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel && onCancel();
      return;
    }
    // simple tab trapping between cancel and confirm
    if (e.key === 'Tab') {
      const focusable = [cancelRef.current, confirmRef.current].filter(Boolean);
      if (focusable.length === 0) return;
      const idx = focusable.indexOf(document.activeElement);
      if (e.shiftKey) {
        const next = focusable[(idx - 1 + focusable.length) % focusable.length];
        next && next.focus();
        e.preventDefault();
      } else {
        const next = focusable[(idx + 1) % focusable.length];
        next && next.focus();
        e.preventDefault();
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="confirm-overlay" ref={overlayRef} onKeyDown={onKeyDown} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="confirm-box">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <IconWarn />
          <div>
            <h3 id={titleId} style={{ margin: 0 }}>{title}</h3>
            <p style={{ margin: '0.25rem 0 0 0' }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button ref={cancelRef} className="btn-secundario" onClick={onCancel}>
            Cancelar
          </button>
          <button ref={confirmRef} className="btn-primario" onClick={onConfirm}>
            <IconCheckSmall />
            <span style={{ marginLeft: 8 }}>Confirmar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
