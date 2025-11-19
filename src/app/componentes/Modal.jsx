"use client";

import React, { useEffect, useRef } from 'react';
import styles from './modal.module.css';

export default function Modal({ open, title, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // foco no primeiro input/textarea/select do modal
    const first = modalRef.current && modalRef.current.querySelector('input, textarea, select, button');
    if (first && typeof first.focus === 'function') first.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button aria-label="Fechar" className={styles.close} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
