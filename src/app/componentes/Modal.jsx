"use client"; // Indica que este é um componente do lado do cliente (Next.js)

import React, { useEffect, useRef } from 'react';
import styles from './modal.module.css';

/**
 * Componente Modal: Implementa um diálogo acessível.
 * Garante que o foco vá para o conteúdo e que o modal feche via teclado (Escape).
 * * @param {boolean} open - Estado que controla a visibilidade do modal.
 * @param {string} title - Título exibido no cabeçalho do modal (Usado como aria-label para A11y).
 * @param {function} onClose - Função chamada ao fechar o modal (Escape ou clique).
 * @param {ReactNode} children - Conteúdo interno do modal.
 */
export default function Modal({ open, title, onClose, children }) {
  // Cria uma referência para o elemento interno do modal, essencial para gerenciar o foco
  const modalRef = useRef(null);

  useEffect(() => {
    // 1. Condição de Saída
    if (!open) return;
    
    // 2. FOCO (A11y/UX)
    // Tenta focar o primeiro elemento interativo dentro do modal (input, button, etc.)
    const first = modalRef.current && modalRef.current.querySelector('input, textarea, select, button');
    if (first && typeof first.focus === 'function') first.focus();

    // 3. CONTROLE DE TECLADO (A11y - Essencial para modais)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Adiciona o listener para a tecla 'Escape'
    window.addEventListener('keydown', onKey);
    
    // Cleanup: Remove o listener quando o modal fecha/desmonta
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]); // Roda sempre que o modal abre ou a função de fechar muda

  // Não renderiza nada se o modal estiver fechado
  if (!open) return null;

  return (
    // BACKDROP: O fundo escuro que cobre a tela.
    // role="dialog", aria-modal="true" e aria-label são CRUCIAIS para acessibilidade.
    <div 
        className={styles.backdrop} 
        role="dialog" 
        aria-modal="true" 
        aria-label={title}
        onClick={onClose} // CORREÇÃO: Fecha o modal se clicar no fundo
    >
      {/* MODAL INTERNO: O conteúdo principal */}
      <div 
        className={styles.modal} 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // CORREÇÃO: Impede que o clique no conteúdo feche o modal (UX)
      >
        <div className={styles.header}>
          <h3>{title}</h3>
          
          {/* Botão de Fechar */}
          <button aria-label="Fechar" className={styles.close} onClick={onClose}>×</button>
        </div>
        
        {/* Conteúdo dinâmico */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}