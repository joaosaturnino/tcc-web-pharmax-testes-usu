// components/ModalConfirmacao/ModalConfirmacao.jsx

import React from "react";
import styles from "./ModalConfirmacao.module.css";
import { MdErrorOutline, MdClose } from "react-icons/md";

/**
 * Componente de Modal de Confirmação genérico.
 * @param {object} props
 * @param {boolean} props.isOpen - Controla a visibilidade do modal.
 * @param {function} props.onClose - Função para fechar o modal (ex: clique no "X" ou "Cancelar").
 * @param {function} props.onConfirm - Função para executar a ação principal (ex: "Excluir").
 * @param {string} props.title - O título do modal.
 * @param {React.ReactNode} props.children - O conteúdo/descrição do modal.
 * @param {string} [props.confirmText="Confirmar"] - Texto do botão de confirmação.
 * @param {string} [props.cancelText="Cancelar"] - Texto do botão de cancelamento.
 * @param {boolean} [props.isLoading=false] - Desativa os botões durante o carregamento.
 */
export default function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
}) {
  if (!isOpen) {
    return null;
  }

  // Impede o clique de fechar o modal quando clicado *dentro* do conteúdo
  const handleContentClick = (e) => e.stopPropagation();

  return (
    // O overlay escuro, clicar nele fecha o modal
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <div className={styles.modalHeader}>
          <div className={styles.headerIcon}>
            <MdErrorOutline size={26} />
          </div>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">
            <MdClose size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {children}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}