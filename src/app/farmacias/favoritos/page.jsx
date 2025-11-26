"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";
import AuthGuard from "../../componentes/AuthGuard";
import api from "../../services/api";
import { useNotification } from "../../contexts/NotificationContext";

// Componente Helper para renderizar estrelas
const RenderStars = ({ nota }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= nota ? "#F59E0B" : "#E2E8F0" }}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function FavoritosFarmaciaPage() {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState("favoritos");
  const [medicamentos, setMedicamentos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]); 
  
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  
  const router = useRouter();
  
  // updateSignal: recebido do contexto para recarregar a lista quando houver mudanças externas
  const { updateSignal } = useNotification();

  // --- LOGOUT ---
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // --- FUNÇÃO: DELETAR AVALIAÇÃO ---
  const handleDeleteAvaliacao = async (idAvaliacao) => {
    const confirmacao = window.confirm("Tem certeza que deseja apagar esta avaliação?");
    if (!confirmacao) return;

    try {
      const response = await api.delete(`/avaliacao/${idAvaliacao}`);
      
      if (response.data.sucesso) {
        // Remove visualmente da lista para feedback imediato na UI
        setAvaliacoes((prev) => prev.filter((av) => av.ava_id !== idAvaliacao));
        
        // OBS: Removemos a chamada manual de addNotification("Sucesso"...) aqui.
        // O NotificationContext detectará que a avaliação sumiu do banco e 
        // exibirá o Toast "Avaliação Removida" automaticamente.
      }
    } catch (error) {
      console.error("Erro ao apagar:", error);
      alert("Erro ao tentar apagar a avaliação.");
    }
  };

  // --- DATA FETCHING ---
  const fetchDados = async () => {
    if ((activeTab === "favoritos" && medicamentos.length === 0) || 
        (activeTab === "avaliacoes" && avaliacoes.length === 0)) {
      setLoadingData(true);
    }

    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
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

      // --- CENÁRIO 1: BUSCAR FAVORITOS ---
      if (activeTab === "favoritos") {
        const response = await api.get(`/favoritos/${idDaFarmacia}/favoritos`);
        
        if (response.data.sucesso) {
          const processedMedicamentos = response.data.dados.map((med) => ({
            ...med,
            id: med.med_id,
            nome: med.med_nome,
            fabricante: med.fabricante_nome || "Laboratório Não Informado",
            dosagem: med.med_dosagem,
            favoritacoes: med.favoritacoes_count || 0,
            status: "em_estoque",
            ultimaAtualizacao: med.med_data_atualizacao
              ? new Date(med.med_data_atualizacao).toISOString()
              : new Date().toISOString(),
          }));
          setMedicamentos(processedMedicamentos.sort((a, b) => b.favoritacoes - a.favoritacoes));
        }
      }

      // --- CENÁRIO 2: BUSCAR AVALIAÇÕES ---
      if (activeTab === "avaliacoes") {
        const response = await api.get(`/avaliacao?farmacia_id=${idDaFarmacia}`);
        
        if (response.data.sucesso) {
           const listaAvaliacoes = response.data.dados || [];
           setAvaliacoes(listaAvaliacoes.reverse());
        }
      }

    } catch (error) {
      console.error("Falha na API:", error);
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [activeTab, updateSignal]);

  // --- PAGINAÇÃO ---
  const dataList = activeTab === "favoritos" ? medicamentos : avaliacoes;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataList.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
            <h1 className={styles.title}>
                {activeTab === "favoritos" ? "Medicamentos Mais Favoritados" : "Avaliações dos Clientes"}
            </h1>
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
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
            </div>

            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <div 
                    className={`${styles.navLink} ${activeTab === "favoritos" ? styles.active : ""}`}
                    onClick={() => { setActiveTab("favoritos"); setSidebarOpen(false); }}
                >
                  <span className={styles.navText}>Favoritos</span>
                </div>
                <div 
                    className={`${styles.navLink} ${activeTab === "avaliacoes" ? styles.active : ""}`}
                    onClick={() => { setActiveTab("avaliacoes"); setSidebarOpen(false); }}
                >
                  <span className={styles.navText}>Avaliações</span>
                </div>
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
                <p>Carregando dados...</p>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  
                  {activeTab === "favoritos" && (
                      currentItems.length > 0 ? (
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
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>
                          <span className={styles.emptyIcon}>⭐</span>
                          <h3>Nenhum medicamento favoritado</h3>
                        </div>
                      )
                  )}

                  {activeTab === "avaliacoes" && (
                      currentItems.length > 0 ? (
                        currentItems.map((aval) => (
                          <div className={styles.reviewCard} key={aval.ava_id || Math.random()}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewUser}>
                                    <div className={styles.reviewAvatar}>
                                        U{aval.usuario_id}
                                    </div>
                                    <div className={styles.reviewMeta}>
                                        <h3>Usuário #{aval.usuario_id}</h3>
                                        <RenderStars nota={aval.ava_nota} />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className={styles.reviewBadge}>Nota {aval.ava_nota}</span>
                                    
                                    
                                </div>

                            </div>
                            
                            <div className={styles.reviewComment}>
                                "{aval.ava_comentario || "Sem comentário adicional."}"
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>
                          <span className={styles.emptyIcon}>💬</span>
                          <h3>Nenhuma avaliação recebida ainda.</h3>
                        </div>
                      )
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