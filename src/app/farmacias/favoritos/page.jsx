"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";

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
          nome: "Omeprazol 20mg",
          dosagem: "20mg",
          fabricante: "GastroPharma S.A.",
          favoritacoes: 38,
          status: "pendente",
          ultimaAtualizacao: "2025-08-14T09:15:00Z"
        },
        {
          id: "m3",
          nome: "Cetirizina 10mg",
          dosagem: "10mg",
          fabricante: "AlergoMed Brasil",
          favoritacoes: 35,
          status: "indisponivel",
          ultimaAtualizacao: "2025-08-13T16:45:00Z"
        },
        {
          id: "m4",
          nome: "Dipirona 500mg",
          dosagem: "500mg",
          fabricante: "AnalgesFarma",
          favoritacoes: 28,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-15T10:20:00Z"
        },
        {
          id: "m5",
          nome: "Amoxilina 500mg",
          dosagem: "500mg",
          fabricante: "AntibioTech",
          favoritacoes: 25,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-14T15:40:00Z"
        },
        {
          id: "m6",
          nome: "Losartana 50mg",
          dosagem: "50mg",
          fabricante: "CardioFarma",
          favoritacoes: 22,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-13T11:30:00Z"
        },
        {
          id: "m7",
          nome: "Atorvastatina 20mg",
          dosagem: "20mg",
          fabricante: "LipidCare",
          favoritacoes: 20,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-12T09:45:00Z"
        },
        {
          id: "m8",
          nome: "Metformina 850mg",
          dosagem: "850mg",
          fabricante: "DiaBeta",
          favoritacoes: 18,
          status: "pendente",
          ultimaAtualizacao: "2025-08-11T14:20:00Z"
        },
        {
          id: "m9",
          nome: "AAS 100mg",
          dosagem: "100mg",
          fabricante: "CardioPlus",
          favoritacoes: 16,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-10T11:10:00Z"
        },
        {
          id: "m10",
          nome: "Sinvastatina 40mg",
          dosagem: "40mg",
          fabricante: "LipidCare",
          favoritacoes: 15,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-09T16:30:00Z"
        },
        {
          id: "m11",
          nome: "Clonazepam 2mg",
          dosagem: "2mg",
          fabricante: "NeuroCalm",
          favoritacoes: 14,
          status: "indisponivel",
          ultimaAtualizacao: "2025-08-08T10:15:00Z"
        },
        {
          id: "m12",
          nome: "Pantoprazol 40mg",
          dosagem: "40mg",
          fabricante: "GastroPharma S.A.",
          favoritacoes: 12,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-07T13:45:00Z"
        },
        {
          id: "m13",
          nome: "Hidroclorotiazida 25mg",
          dosagem: "25mg",
          fabricante: "PressãoControl",
          favoritacoes: 10,
          status: "pendente",
          ultimaAtualizacao: "2025-08-06T15:20:00Z"
        },
        {
          id: "m14",
          nome: "Sertralina 50mg",
          dosagem: "50mg",
          fabricante: "MenteSã",
          favoritacoes: 9,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-05T09:30:00Z"
        },
        {
          id: "m15",
          nome: "Warfarina 5mg",
          dosagem: "5mg",
          fabricante: "CoagulaSafe",
          favoritacoes: 8,
          status: "indisponivel",
          ultimaAtualizacao: "2025-08-04T14:10:00Z"
        }
      ];
      
      setMedicamentos(mockMedicamentos);
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

  // Cálculos de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medicamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicamentos.length / itemsPerPage);

  // Mudar página
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
        {/* Header com botão para toggle da sidebar */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
            </button>
            <h1 className={styles.title}>Medicamentos Mais Favoritados</h1>
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
            {/* Informações de paginação */}
            {/* <div className={styles.paginationInfo}>
              <p>
                Exibindo {Math.min(itemsPerPage, currentItems.length)} de {medicamentos.length} medicamentos
                {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
              </p>
            </div> */}

            {/* Grid de Medicamentos */}
            <div className={styles.grid}>
              {currentItems
                .sort((a, b) => b.favoritacoes - a.favoritacoes)
                .map((med, index) => (
                  <div className={styles.card} key={med.id}>
                    <div className={styles.cardHeader}>
                      <div className={styles.userInfo}>
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
                      {/* <button
                        className={styles.contactBtn}
                        onClick={() => console.log("Detalhes do medicamento")}
                        title="Ver detalhes"
                      >
                        🔍 Detalhes
                      </button> */}
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