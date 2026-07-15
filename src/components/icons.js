import React from 'react';

export function IconEdit(props) {
  return (
    <svg width={props.width || 16} height={props.height || 16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
      <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
    </svg>
  );
}

export function IconDelete(props) {
  return (
    <svg width={props.width || 16} height={props.height || 16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSuccess(props) {
  return (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#2D7A46" opacity="0.12" />
      <path d="M9.5 12.5l1.8 1.8L15.5 10" stroke="#2D7A46" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconError(props) {
  return (
    <svg width={props.width || 20} height={props.height || 20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#B53B32" opacity="0.08" />
      <path d="M12 8v5" stroke="#B53B32" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 15h.01" stroke="#B53B32" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg width={props.width || 14} height={props.height || 14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWarn(props) {
  return (
    <svg width={props.width || 28} height={props.height || 28} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L2 22h20L12 2z" fill="#F6C35D" />
      <path d="M12 8v5" stroke="#6B3E00" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 16h.01" stroke="#6B3E00" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheckSmall(props) {
  return (
    <svg width={props.width || 14} height={props.height || 14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
