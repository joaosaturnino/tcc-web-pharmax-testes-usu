"use client";

import React from 'react';
import Modal from './Modal';
import styles from './confirm.module.css';

export default function ConfirmDialog({ open, title = 'Confirmação', message = 'Confirma?', onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className={styles.body}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>Cancelar</button>
          <button className={styles.confirm} onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </Modal>
  );
}
