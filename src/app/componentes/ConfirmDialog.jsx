"use client"; // Indica que este é um componente do lado do cliente

import React from 'react';
import Modal from './Modal'; // Importa o componente Modal (assumindo que ele gerencia a sobreposição e o backdrop)
import styles from './confirm.module.css'; // Estilos específicos para o layout dos botões e da mensagem

/**
 * Componente ConfirmDialog: Exibe uma caixa de diálogo genérica de confirmação.
 * * @param {boolean} open - Controla se o diálogo está visível.
 * @param {string} title - Título do diálogo.
 * @param {string} message - Mensagem principal de confirmação.
 * @param {function} onCancel - Função a ser executada ao clicar em 'Cancelar' ou fechar o modal.
 * @param {function} onConfirm - Função a ser executada ao clicar em 'Confirmar'.
 */
export default function ConfirmDialog({
  open,
  title = 'Confirmação', // Valor padrão
  message = 'Confirma?',   // Valor padrão
  onCancel,
  onConfirm
}) {
  return (
    // Reutiliza o componente Modal como base, o que garante a acessibilidade e o backdrop.
    // DICA: onClose é vinculado a onCancel, assim, fechar o Modal (ex: clicando fora) 
    // sempre dispara a ação de cancelamento.
    <Modal open={open} title={title} onClose={onCancel}>
      <div className={styles.body}>
        {/* Exibe a mensagem de confirmação */}
        <p className={styles.message}>{message}</p>

        {/* Container de Botões de Ação */}
        <div className={styles.actions}>
          {/* Botão de Cancelar */}
          <button
            className={styles.cancel}
            onClick={onCancel}
          >
            Cancelar
          </button>

          {/* Botão de Confirmar (Geralmente a ação primária/destrutiva) */}
          <button
            className={styles.confirm}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}