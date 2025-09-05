"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./sobre.module.css";

export default function SobrePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rememberedCredentials");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/");
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className={styles.title}>Sobre o PharmaX</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a href="/farmacias/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                <span className={styles.navText}>Medicamentos</span>
              </a>
              <a href="/sobre" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navText}>Sobre</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className={styles.navLink}
              >
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>
          </nav>

          <div className={styles.userPanel}>
            <button className={styles.navLink} onClick={handleLogout}>
              <span className={styles.navText}>Sair</span>
            </button>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Sobre o PharmaX</h1>
              <p className={styles.pageSubtitle}>Conheça mais sobre nossa plataforma</p>
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
                  <span className={styles.infoValue}>Emily Martins;
                    <br></br>
                    Guilherme Oliveiva;
                    <br></br>
                    João Henrique;
                    <br></br>
                    João Rafael
                  </span>
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
        </main>
      </div>
    </div>
  );
}