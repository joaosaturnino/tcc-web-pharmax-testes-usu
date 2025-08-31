"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../laboratorio.module.css";

export default function ListaLaboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Mock de dados (substituir por chamada API depois)
    const mockLabs = [
      { id: 1, nome: "LabVida", endereco: "Rua A, 123", telefone: "11 9999-9999", email: "contato@labvida.com" },
      { id: 2, nome: "BioPharma", endereco: "Av. B, 456", telefone: "21 9888-8888", email: "vendas@biopharma.com" },
      { id: 3, nome: "PharmaTech", endereco: "Rua C, 789", telefone: "31 9777-7777", email: "info@pharmatech.com" },
      { id: 4, nome: "MedLab", endereco: "Av. D, 101", telefone: "41 9666-6666", email: "suporte@medlab.com" },
      { id: 5, nome: "HealthSolutions", endereco: "Rua E, 202", telefone: "51 9555-5555", email: "contato@healthsolutions.com" }
    ];
    setLaboratorios(mockLabs);
  }, []);

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
          <h1 className={styles.titulo}>📋 Laboratórios</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Buscar laboratórios..." 
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <Link href="/farmacias/laboratorio/cadastro" className={styles.botaoPrincipal}>
            ➕ Novo Laboratório
          </Link>
          <div className={styles.userMenu}>
            <span className={styles.userAvatar}>👤</span>
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>💊</span>
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
              <a href="/farmacia/favoritos" className={styles.navLink}>
                <span className={styles.navIcon}>⭐</span>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                <span className={styles.navIcon}>💊</span>
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>
            
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a href="/farmacias/cadastro/funcionario" className={styles.navLink}>
                <span className={styles.navIcon}>👩‍⚕️</span>
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/laboratorio/lista" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>🏭</span>
                <span className={styles.navText}>Laboratórios</span>
                <span className={styles.notificationBadge}>{laboratorios.length}</span>
              </a>
            </div>
            
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Sistema</p>
              <a href="/config" className={styles.navLink}>
                <span className={styles.navIcon}>⚙️</span>
                <span className={styles.navText}>Configurações</span>
              </a>
              <button className={styles.navLink}>
                <span className={styles.navIcon}>🚪</span>
                <span className={styles.navText}>Sair</span>
              </button>
            </div>
          </nav>
          
          <div className={styles.userPanel}>
            <div className={styles.userAvatar}>
              <span>👤</span>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Administrador</p>
              <p className={styles.userRole}>Supervisor</p>
            </div>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏭</div>
              <div className={styles.statContent}>
                <h3>{laboratorios.length}</h3>
                <p>Total de Laboratórios</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📞</div>
              <div className={styles.statContent}>
                <h3>{laboratorios.length}</h3>
                <p>Contatos Ativos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3>{laboratorios.length}</h3>
                <p>Todos Ativos</p>
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            {laboratorios.map((lab) => (
              <div key={lab.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>{lab.nome}</h2>
                  <span className={styles.labStatus}>Ativo</span>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <div>
                      <span className={styles.infoLabel}>Endereço</span>
                      <p>{lab.endereco}</p>
                    </div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📞</span>
                    <div>
                      <span className={styles.infoLabel}>Telefone</span>
                      <p>{lab.telefone}</p>
                    </div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>✉️</span>
                    <div>
                      <span className={styles.infoLabel}>Email</span>
                      <p>{lab.email}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.acoes}>
                  <Link
                    href={`/laboratorio/cadastro/editar/${lab.id}`}
                    className={styles.botaoSecundario}
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    className={styles.botaoExcluir}
                    onClick={() => alert(`Excluir laboratório ${lab.nome}`)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {laboratorios.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏭</div>
              <h3>Nenhum laboratório cadastrado</h3>
              <p>Comece cadastrando seu primeiro laboratório.</p>
              <Link href="/laboratorio/cadastro" className={styles.botaoPrincipal}>
                ➕ Novo Laboratório
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}