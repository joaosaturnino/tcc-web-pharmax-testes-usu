"use client";

import styles from "./sobre.module.css";

export default function SobrePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sobre o PharmaX</h1>
        <p className={styles.subtitle}>Conheça mais sobre nossa plataforma</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,11.99h7c-0.53,4.12-3.28,7.79-7,8.94V12H5V6.3l7-3.11V11.99z"/>
            </svg>
          </div>
          <h2>Informações do Sistema</h2>
        </div>
        
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nome do Sistema:</span>
            <span className={styles.infoValue}>PharmaX</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Versão:</span>
            <span className={styles.infoValue}>1.0.0</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Objetivo:</span>
            <span className={styles.infoValue}>
              Facilitar a busca e comparação de preços de medicamentos em 
              diferentes farmácias, garantindo economia e praticidade para o usuário.
            </span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Desenvolvedores:</span>
            <span className={styles.infoValue}>Equipe Infonet</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Contato:</span>
            <span className={styles.infoValue}>
              <a href="mailto:suporte@pharmax.com" className={styles.contactLink}>
                suporte@pharmax.com
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <h3 className={styles.featuresTitle}>Recursos Principais</h3>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💊</div>
            <h4>Busca Inteligente</h4>
            <p>Encontre medicamentos com busca por nome, princípio ativo ou sintoma</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h4>Comparação de Preços</h4>
            <p>Compare valores entre diferentes farmácias de forma fácil</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📍</div>
            <h4>Localização</h4>
            <p>Encontre farmácias próximas a você com os melhores preços</p>
          </div>
        </div>
      </div>
    </div>
  );
}