import Image from 'next/image';
import styles from './index.module.css';

const currency = new Intl.NumberFormat('pt-BR', { 
  style: 'currency', 
  currency: 'BRL' 
});

export default function Card({ medicamento }) {
  const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";

  return (
    <div className={styles.card}>
      <div className={styles.imagemContainer}>
        <Image
          src={medicamento.imagem || imagemPadrao}
          alt={medicamento.nome}
          width={200}
          height={200}
          className={styles.imagemProduto}
          onError={(e) => {
            e.target.src = imagemPadrao;
          }}
        />
        <span className={`${styles.status} ${
          medicamento.status === 'ativo' ? styles.statusAtivo : styles.statusInativo
        }`}>
          {medicamento.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.medicamentoNome}>{medicamento.nome}</h3>
        <p className={styles.medicamentoDosagem}>{medicamento.dosagem}</p>
        <p className={styles.medicamentoLaboratorio}>{medicamento.laboratorio}</p>
        <div className={styles.detalhes}>
          <span className={styles.medicamentoPreco}>{currency.format(medicamento.preco)}</span>
          <span className={`${styles.medicamentoQuantidade} ${
            medicamento.quantidade === 0 
              ? styles.quantidadeZero 
              : medicamento.quantidade <= 5 
                ? styles.quantidadeBaixa 
                : ''
          }`}>
            Qtd: {medicamento.quantidade}
          </span>
        </div>
        <span className={styles.medicamentoCategoria}>{medicamento.categoria}</span>
      </div>
    </div>
  );
}