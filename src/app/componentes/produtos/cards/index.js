"use client";
import styles from "./index.module.css";
import Link from "next/link";

const imagemPadrao = "/images/placeholder.jpg";

export default function MedicamentoCard({ medicamento }) {
  return (
    <Link href={`/farmacias/produtos/medicamentos/${medicamento.id}`}>
      <div
        className={`${styles.medicamentoCard} ${
          medicamento.status === "inativo" ? styles.inativo : ""
        }`}
      >
        <div className={styles.cardHeader}>
          <img
            src={medicamento.imagem || imagemPadrao}
            alt={medicamento.nome}
            className={styles.cardImagem}
            onError={(e) => {
              e.target.src = imagemPadrao;
            }}
          />
          <span
            className={`${styles.cardStatus} ${
              medicamento.status === "ativo"
                ? styles.statusAtivo
                : styles.statusInativo
            }`}
          >
            {medicamento.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardNome}>{medicamento.nome}</h3>
          <p className={styles.cardDosagem}>{medicamento.dosagem}</p>
          <p className={styles.cardLaboratorio}>{medicamento.laboratorio}</p>
          <p className={styles.cardCategoria}>{medicamento.categoria}</p>
        </div>
      </div>
    </Link>
  );
}
