// src/components/medicamentos/card/index.jsx
import { useState } from 'react';
import styles from './index.module.css';

export default function MedicamentoCard({ medicamento, index, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (novoStatus) => {
    if (onStatusChange) {
      setIsUpdating(true);
      try {
        await onStatusChange(medicamento.id, novoStatus);
      } catch (error) {
        console.error('Erro ao mudar status:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardUserInfo}>
          <div className={styles.userAvatar}>
            <span>#{index + 1}</span>
          </div>
          <div>
            <h2>{medicamento.nome}</h2>
            <p>{medicamento.fabricante}</p>
            <span className={styles.favoriteDate}>
              {medicamento.favoritacoes} favoritações
            </span>
          </div>
        </div>
      </div>

      <div className={styles.medList}>
        <div className={styles.medItem}>
          <div className={styles.medInfo}>
            <strong>Dosagem</strong>
            <span className={styles.dosagem}>{medicamento.dosagem}</span>
          </div>
          <span
            className={`${styles.badge} ${
              medicamento.status === "em_estoque"
                ? styles.inStock
                : medicamento.status === "indisponivel"
                ? styles.outStock
                : styles.pending
            }`}
          >
            {medicamento.status === "em_estoque"
              ? "Disponível"
              : medicamento.status === "indisponivel"
              ? "Indisponível"
              : "Pendente"}
          </span>
        </div>
        
        <div className={styles.medItem}>
          <div className={styles.medInfo}>
            <strong>Última atualização</strong>
            <span className={styles.dosagem}>
              {new Date(medicamento.ultimaAtualizacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Controles de Status */}
        <div className={styles.statusControls}>
          <button
            onClick={() => handleStatusChange('em_estoque')}
            disabled={isUpdating || medicamento.status === 'em_estoque'}
            className={`${styles.statusBtn} ${styles.inStock}`}
          >
            {isUpdating ? '...' : 'Disponível'}
          </button>
          <button
            onClick={() => handleStatusChange('indisponivel')}
            disabled={isUpdating || medicamento.status === 'indisponivel'}
            className={`${styles.statusBtn} ${styles.outStock}`}
          >
            {isUpdating ? '...' : 'Indisponível'}
          </button>
        </div>
      </div>
    </div>
  );
}