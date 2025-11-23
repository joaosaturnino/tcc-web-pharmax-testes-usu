"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";
import AuthGuard from "../../componentes/AuthGuard";
import api from "../../services/api";

// 1. IMPORTAÇÃO DO CONTEXTO
import { useNotification } from "../../contexts/NotificationContext";

export default function FavoritosFarmaciaPage() {
  // --- ESTADOS ---
  const [medicamentos, setMedicamentos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const router = useRouter();

  // 2. RECUPERA O SINAL DE ATUALIZAÇÃO DO CONTEXTO
  const { updateSignal } = useNotification();

  // --- LOGOUT ---
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchMedicamentosFavoritos = async () => {
      // Pequeno ajuste: Só mostra o loading se a lista estiver vazia (primeira carga).
      // Nas atualizações automáticas, atualiza silenciosamente sem piscar a tela.
      if (medicamentos.length === 0) {
        setLoadingData(true);
      }
      
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          // Removi o alert para não bloquear a atualização automática caso a sessão caia
          handleLogout();
          return;
        }

        const userData = JSON.parse(userDataString);
        setFarmaciaInfo(userData);

        const idDaFarmacia = userData.farm_id;
        if (!idDaFarmacia) {
          handleLogout();
          return;
        }

        // Rota da API
        const response = await api.get(`/favoritos/${idDaFarmacia}/favoritos`);

        if (response.data.sucesso) {
          const processedMedicamentos = response.data.dados.map(med => ({
            ...med,
            id: med.med_id,
            nome: med.med_nome,
            fabricante: med.fabricante_nome || 'Laboratório Não Informado',
            dosagem: med.med_dosagem,
            favoritacoes: med.favoritacoes_count || 0,
            status: "em_estoque", // Valor padrão para visualização
            ultimaAtualizacao: med.med_data_atualizacao
              ? new Date(med.med_data_atualizacao).toISOString()
              : new Date().toISOString(),
          }));

          // Ordenar por mais favoritados
          const sortedMedicamentos = processedMedicamentos.sort((a, b) => b.favoritacoes - a.favoritacoes);
          setMedicamentos(sortedMedicamentos);

        } else {
          console.error("Erro API:", response.data.mensagem);
        }
      } catch (error) {
        console.error("Falha na API:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchMedicamentosFavoritos();
    
    // 3. ADICIONADO 'updateSignal' NAS DEPENDÊNCIAS
    // Isso força o useEffect a rodar novamente sempre que o Contexto avisar
  }, [updateSignal]); 

  // --- PAGINAÇÃO ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medicamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicamentos.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AuthGuard>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menu"
            >
              ☰
            </button>
            <h1 className={styles.title}>Medicamentos Mais Favoritados</h1>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logoContainer}>
                {farmaciaInfo?.farm_logo_url && (
                  <img
                    src={farmaciaInfo.farm_logo_url}
                    alt="Logo"
                    className={styles.logoImage}
                  />
                )}
                <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
              </div>
              <button
                className={styles.sidebarClose}
                onClick={() => setSidebarOpen(false)}
              >×</button>
            </div>

            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={`${styles.navLink} ${styles.active}`}>
                  <span className={styles.navText}>Favoritos</span>
                </Link>
                <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                  <span className={styles.navText}>Funcionários</span>
                </Link>
                <Link href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </Link>
                <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </Link>
                <Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <Link href="/farmacias/perfil" className={styles.navLink}>
                  <span className={styles.navText}>Meu Perfil</span>
                </Link>
                <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}

          <main className={styles.mainContent}>
            {loadingData ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando...</p>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {currentItems.length > 0 ? (
                    currentItems.map((med, index) => (
                      <div className={styles.card} key={med.id}>
                        <div className={styles.cardHeader}>
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
                            <span className={`${styles.badge} ${med.status === "em_estoque" ? styles.inStock : styles.pending}`}>
                              {med.status === "em_estoque" ? "Disponível" : "Pendente"}
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
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>⭐</span>
                      <h3>Nenhum medicamento favoritado</h3>
                    </div>
                  )}
                </div>

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
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}