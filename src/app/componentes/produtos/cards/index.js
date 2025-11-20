// src/components/medicamentos/card/index.jsx
import { useState } from 'react';
import styles from './index.module.css';

// Componente para exibir um card de medicamento na listagem de controle da farmácia
export default function MedicamentoCard({ medicamento, index, onStatusChange }) {
  // Estado para controlar o loading do botão (evita cliques múltiplos durante a requisição)
  const [isUpdating, setIsUpdating] = useState(false);

  // Função que envia o novo status para o controller da API
  const handleStatusChange = async (novoStatus) => {
    if (onStatusChange) {
      setIsUpdating(true);
      try {
        // Assume que o ID do medicamento é o 'id' e passa o novo status
        await onStatusChange(medicamento.med_id, novoStatus);
      } catch (error) {
        console.error('Erro ao mudar status:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Se o objeto medicamento for nulo ou indefinido, não renderiza nada
  if (!medicamento) {
    return null;
  }

  // --- NORMALIZAÇÃO DOS DADOS DE ENTRADA ---
  // Padroniza as chaves do objeto para serem usadas no JSX
  const statusAtual = medicamento.med_ativo === 1 || medicamento.med_ativo === true ? 'em_estoque' : 'indisponivel';
  const nomeFabricante = medicamento.lab_nome || 'Laboratório';

  // A lógica de data deve usar o campo de data de atualização que seu banco retorna
  const ultimaAtualizacao = medicamento.med_data_atualizacao;

  // O número de favoritações não está presente na estrutura do medicamento em si
  // (Ele deve vir de uma JOIN ou ser mockado para o layout funcionar)
  const favoritacoes = medicamento.favoritacoes || 0;

  // Verifica se o medicamento tem dosagem para exibir
  const dosagemDisplay = medicamento.med_dosagem || 'N/A';

  const statusClass = statusAtual === 'em_estoque' ? styles.inStock : styles.outStock;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardUserInfo}>
          {/* Avatar com número de ordem ou ID */}
          <div className={styles.userAvatar}>
            <span>#{index + 1}</span>
          </div>
          <div>
            <h2>{medicamento.med_nome}</h2>
            <p>{nomeFabricante}</p>
            <span className={styles.favoriteDate}>
              {favoritacoes} favoritações
            </span>
          </div>
        </div>
      </div>

      <div className={styles.medList}>
        <div className={styles.medItem}>
          <div className={styles.medInfo}>
            <strong>Dosagem</strong>
            <span className={styles.dosagem}>{dosagemDisplay}</span>
          </div>
          {/* Badge de Status - Aplica a classe de cor com base no status atual */}
          <span className={`${styles.badge} ${statusClass}`}>
            {statusAtual === "em_estoque" ? "Disponível" : "Indisponível"}
          </span>
        </div>

        <div className={styles.medItem}>
          <div className={styles.medInfo}>
            <strong>Última atualização</strong>
            <span className={styles.dosagem}>
              {/* Formata a data para o padrão brasileiro */}
              {new Date(ultimaAtualizacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Controles de Status */}
        <div className={styles.statusControls}>
          {/* Botão para setar como Disponível */}
          <button
            onClick={() => handleStatusChange(true)} // Assume TRUE ou 1 para "ativo" no banco
            disabled={isUpdating || statusAtual === 'em_estoque'}
            className={`${styles.statusBtn} ${styles.inStock}`}
          >
            {isUpdating ? 'Salvando...' : 'Disponível'}
          </button>

          {/* Botão para setar como Indisponível */}
          <button
            onClick={() => handleStatusChange(false)} // Assume FALSE ou 0 para "inativo" no banco
            disabled={isUpdating || statusAtual === 'indisponivel'}
            className={`${styles.statusBtn} ${styles.outStock}`}
          >
            {isUpdating ? 'Salvando...' : 'Indisponível'}
          </button>
        </div>
      </div>
    </div>
  );
}