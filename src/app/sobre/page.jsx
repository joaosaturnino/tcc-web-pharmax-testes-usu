"use client";

import styles from "./sobre.module.css";

export default function SobrePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sobre o Sistema</h1>

      <div className={styles.card}>
        <p><strong>Nome do Sistema:</strong> PharmaX</p>
        <p><strong>Versão:</strong> 1.0.0</p>
        <p><strong>Objetivo:</strong> Facilitar a busca e comparação de preços de medicamentos em diferentes farmácias, garantindo economia e praticidade para o usuário.</p>
        <p><strong>Desenvolvedores:</strong> Equipe Infonet</p>
        <p><strong>Contato:</strong> suporte@pharmax.com</p>
      </div>
    </div>
  );
}
