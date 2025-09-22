"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import medicamentosFavoritosMock from "../../componentes/mockup/medicamentos"; // Importando o mock

export default function DetalheMedicamentoPage({ params }) {
  const { med_id } = params;
  const [medicamento, setMedicamento] = useState(null);

  useEffect(() => {
    if (med_id) {
      const medEncontrado = medicamentosFavoritosMock.find(item => item.med_id === parseInt(med_id));
      if (!medEncontrado) {
        notFound();
      } else {
        setMedicamento(medEncontrado);
      }
    }
  }, [med_id]);

  if (!medicamento) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/favoritos">Favoritos</Link> / <span>{medicamento.med_nome}</span>
      </div>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{medicamento.med_nome}</h1>
          <span className={`${styles.badge} ${styles.inStock}`}>
            {medicamento.favoritacoes} favoritações
          </span>
        </div>
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <h2>Descrição</h2>
            <p>{medicamento.med_descricao}</p>
          </div>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <strong>Dosagem</strong>
              <span>{medicamento.med_dosagem}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Quantidade</strong>
              <span>{medicamento.med_quantidade}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Fabricante</strong>
              <span>{medicamento.fabricante}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Status</strong>
              <span>{medicamento.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}