"use client";

import { useEffect, useState } from "react";
import styles from "./favoritos.module.css";

export default function FavoritosFarmaciaPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Mock para desenvolvimento (substituir pelo fetch real)
    setTimeout(() => {
      setFavoritos([
        {
          userId: "u1",
          userName: "Ana Souza",
          userEmail: "ana.souza@example.com",
          userAvatar: "👩",
          favoritedAt: "2025-08-01T10:22:00Z",
          meds: [
            { id: "m1", nome: "Paracetamol 500mg", dosagem: "500mg", status: "em_estoque" },
            { id: "m2", nome: "Omeprazol 20mg", dosagem: "20mg", status: "pendente" }
          ]
        },
        {
          userId: "u2",
          userName: "Carlos Lima",
          userEmail: "carlos.lima@example.com",
          userAvatar: "👨",
          favoritedAt: "2025-08-05T15:12:00Z",
          meds: [
            { id: "m3", nome: "Cetirizina 10mg", dosagem: "10mg", status: "indisponivel" }
          ]
        },
        {
          userId: "u3",
          userName: "Mariana Oliveira",
          userEmail: "mariana.oliveira@example.com",
          userAvatar: "👩",
          favoritedAt: "2025-08-10T09:45:00Z",
          meds: [
            { id: "m4", nome: "Dipirona 500mg", dosagem: "500mg", status: "em_estoque" },
            { id: "m5", nome: "Amoxilina 500mg", dosagem: "500mg", status: "em_estoque" }
          ]
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header com botão para toggle da sidebar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {/* <button 
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button> */}
          <h1 className={styles.title}>Medicamentos Favoritados</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.notificationBtn}>
            <span className={styles.bellIcon}>🔔</span>
            <span className={styles.notificationBadge}>3</span>
          </button>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Buscar favoritos..." 
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <button className={styles.actionBtn}>
            <span className={styles.btnIcon}>📊</span>
            Exportar CSV
          </button>
          <div className={styles.userMenu}>
            <span className={styles.userShort}>AD</span>
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa - Integrada ao fluxo do documento */}
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
              <a href="/farmacia/favoritos" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>⭐</span>
                <span className={styles.navText}>Favoritos</span>
                <span className={styles.notificationBadge}>{favoritos.length}</span>
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
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navIcon}>🏭</span>
                <span className={styles.navText}>Laboratórios</span>
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

        {/* Overlay para fechar a sidebar ao clicar fora (apenas em mobile) */}
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
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statContent}>
                <h3>{favoritos.length}</h3>
                <p>Total de Favoritos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💊</div>
              <div className={styles.statContent}>
                <h3>{favoritos.reduce((acc, user) => acc + user.meds.length, 0)}</h3>
                <p>Medicamentos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3>{favoritos.reduce((acc, user) => acc + user.meds.filter(m => m.status === 'em_estoque').length, 0)}</h3>
                <p>Disponíveis</p>
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            {favoritos.map((user) => (
              <div className={styles.card} key={user.userId}>
                <div className={styles.cardHeader}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      <span>{user.userAvatar}</span>
                    </div>
                    <div>
                      <h2>{user.userName}</h2>
                      <p>{user.userEmail}</p>
                      <span className={styles.favoriteDate}>
                        Favoritado em {new Date(user.favoritedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.contactBtn}
                    onClick={() => (window.location.href = `mailto:${user.userEmail}`)}
                    title="Enviar e-mail"
                  >
                    ✉️ Contatar
                  </button>
                </div>

                <div className={styles.medList}>
                  {user.meds.map((med) => (
                    <div key={med.id} className={styles.medItem}>
                      <div className={styles.medInfo}>
                        <strong>{med.nome}</strong>
                        <span className={styles.dosagem}>{med.dosagem}</span>
                      </div>
                      <span
                        className={`${styles.badge} ${
                          med.status === "em_estoque"
                            ? styles.inStock
                            : med.status === "indisponivel"
                            ? styles.outStock
                            : styles.pending
                        }`}
                      >
                        {med.status === "em_estoque"
                          ? "Disponível"
                          : med.status === "indisponivel"
                          ? "Indisponível"
                          : "Pendente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {favoritos.length === 0 && !loading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⭐</div>
              <h3>Nenhum favorito encontrado</h3>
              <p>Os medicamentos favoritados pelos clientes aparecerão aqui.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}