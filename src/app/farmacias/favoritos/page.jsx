"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css"; // Nome corrigido para coincidir

import AuthGuard from "../../componentes/AuthGuard";

export default function FavoritosFarmaciaPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    // Mock para desenvolvimento (substituir pelo fetch real)
    setTimeout(() => {
      const mockMedicamentos = [
        {
          id: "m1",
          nome: "Paracetamol 500mg",
          dosagem: "500mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 42,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-15T14:30:00Z"
        },
        {
          id: "m2",
          nome: "Paracetamol 500mg",
          dosagem: "500mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 42,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-15T14:30:00Z"
        },
        {
          id: "m3",
          nome: "Paracetamol 500mg",
          dosagem: "500mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 42,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-15T14:30:00Z"
        },
        {
          id: "m4",
          nome: "Paracetamol 500mg",
          dosagem: "500mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 42,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-15T14:30:00Z"
        },
        // ... (restante dos dados mock)
      ];
      
      setMedicamentos(mockMedicamentos);
      setLoading(false);
    }, 800);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/home");
    }
  };

  const navigateToProfile = () => {
    router.push("/farmacias/perfil");
  };

  // Cálculos de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medicamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicamentos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando medicamentos favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
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
            <h1 className={styles.title}>Medicamentos Mais Favoritados</h1>
          </div>
          <div className={styles.headerActions}>
            {/* <button
              onClick={navigateToProfile}
              className={styles.actionBtn}
              title="Acessar perfil"
            >
              👤 Perfil
            </button> */}
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

              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <a
                  href="/farmacias/relatorios/favoritos"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </a>
                <a
                  href="/farmacias/relatorios/funcionarios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </a>
                <a
                  href="/farmacias/relatorios/laboratorios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </a>
              </div>

              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <a
                  href="/farmacias/perfil"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Meu Perfil</span>
                </a>
                <button
                  onClick={handleLogout}
                  className={styles.navLink}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Overlay para mobile */}
          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}

          {/* Conteúdo Principal */}
          <main className={styles.mainContent}>
            {/* Grid de Medicamentos */}
            <div className={styles.grid}>
              {currentItems
                .sort((a, b) => b.favoritacoes - a.favoritacoes)
                .map((med, index) => (
                  <div className={styles.card} key={med.id}>
                    <div className={styles.cardHeader}>
                      {/* CORRIGIDO: userInfo renomeado para cardUserInfo */}
                      <div className={styles.cardUserInfo}>
                        <div className={styles.userAvatar}>
                          <span>#{indexOfFirstItem + index + 1}</span>
                        </div>
                        <div>
                          <h2>{med.nome}</h2>
                          <p>{med.fabricante}</p>
                          <span className={styles.favoriteDate}>
                            {med.favoritacoes} favoritações
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.medList}>
                      <div className={styles.medItem}>
                        <div className={styles.medInfo}>
                          <strong>Dosagem</strong>
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
                      <div className={styles.medItem}>
                        <div className={styles.medInfo}>
                          <strong>Última atualização</strong>
                          <span className={styles.dosagem}>
                            {new Date(med.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className={styles.paginationControls}>
                <button
                  className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                
                <div className={styles.paginationNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      className={`${styles.paginationNumber} ${currentPage === number ? styles.active : ''}`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button
                  className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima →
                </button>
              </div>
            )}

            {medicamentos.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <h3>Nenhum medicamento favoritado</h3>
                <p>Os medicamentos favoritados pelos clientes aparecerão aqui.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}