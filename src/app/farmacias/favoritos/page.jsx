"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";

import AuthGuard from "../../componentes/AuthGuard";

export default function FavoritosFarmaciaPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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
            {
              id: "m1",
              nome: "Paracetamol 500mg",
              dosagem: "500mg",
              status: "em_estoque",
            },
            {
              id: "m2",
              nome: "Omeprazol 20mg",
              dosagem: "20mg",
              status: "pendente",
            },
          ],
        },
        {
          userId: "u2",
          userName: "Carlos Lima",
          userEmail: "carlos.lima@example.com",
          userAvatar: "👨",
          favoritedAt: "2025-08-05T15:12:00Z",
          meds: [
            {
              id: "m3",
              nome: "Cetirizina 10mg",
              dosagem: "10mg",
              status: "indisponivel",
            },
          ],
        },
        {
          userId: "u3",
          userName: "Mariana Oliveira",
          userEmail: "mariana.oliveira@example.com",
          userAvatar: "👩",
          favoritedAt: "2025-08-10T09:45:00Z",
          meds: [
            {
              id: "m4",
              nome: "Dipirona 500mg",
              dosagem: "500mg",
              status: "em_estoque",
            },
            {
              id: "m5",
              nome: "Amoxilina 500mg",
              dosagem: "500mg",
              status: "em_estoque",
            },
          ],
        },
      ]);
      setLoading(false);
    }, 800);

    
  }, []);

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");

      // Redirecionar para a página de login
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo em caso de erro, redirecionar para a página de login
      router.push("/home");
    }
  };

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
    <AuthGuard requiredRole="admin">
    <div className={styles.dashboard}>
      {/* Header com botão para toggle da sidebar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
          </button>
          <h1 className={styles.title}>Medicamentos Favoritados</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa - Integrada ao fluxo do documento */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            >
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a
                href="/farmacias/favoritos"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a
                href="/farmacias/produtos/medicamentos"
                className={styles.navLink}
              >
                <span className={styles.navText}>Medicamentos</span>
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
            <a
                href="./perfil"
                className={styles.navLink}
              >
                <span className={styles.navText}>Meu Perfil</span>
              </a>
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
                        Favoritado em{" "}
                        {new Date(user.favoritedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.contactBtn}
                    onClick={() =>
                      (window.location.href = `mailto:${user.userEmail}`)
                    }
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
              <h3>Nenhum favorito encontrado</h3>
              <p>Os medicamentos favoritados pelos clientes aparecerão aqui.</p>
            </div>
          )}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
