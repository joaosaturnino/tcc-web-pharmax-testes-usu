"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";
import AuthGuard from "../../componentes/AuthGuard";
import api from "../../services/api";
import { useNotification } from "../../contexts/NotificationContext";

// --- HELPERS VISUAIS ---

const RenderStars = ({ nota }) => (
  <div className={styles.starRating} title={`Nota: ${nota}/5`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ color: star <= nota ? "#F59E0B" : "#E2E8F0" }}>
        ★
      </span>
    ))}
  </div>
);

// Formata data relativa (ex: "Há 2 dias")
const getRelativeTime = (dateObj) => {
  if (!dateObj) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return "Agora mesmo";
  if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `Há ${Math.floor(diffInSeconds / 86400)} dias`;
  
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

// Gera cor de avatar baseada no ID
const getAvatarColor = (id) => {
  const colors = [
    'linear-gradient(135deg, #ef4444, #b91c1c)', 
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #3b82f6, #2563eb)', 
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    'linear-gradient(135deg, #ec4899, #db2777)', 
  ];
  const index = typeof id === 'number' ? id % colors.length : 0;
  return colors[index];
};

// --- LÓGICA DE DATA COM LOCALSTORAGE ---

const recuperarOuSalvarData = (idAvaliacao) => {
  if (!idAvaliacao) return new Date(); 

  const chave = `review_date_${idAvaliacao}`;
  const dataSalva = localStorage.getItem(chave);

  if (dataSalva) {
    // Se já existe uma data salva, usa ela (persistência)
    return new Date(dataSalva);
  } else {
    // Se não existe, é NOVA. Usa a data ATUAL e salva.
    const novaData = new Date();
    localStorage.setItem(chave, novaData.toISOString());
    return novaData;
  }
};

// Skeleton Loading
const SkeletonLoader = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <div className={styles.skeletonCard} key={i}>
        <div className={styles.skeletonHeader}>
          <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
          <div style={{ flex: 1 }}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`} />
            <div className={`${styles.skeleton} ${styles.skeletonTextSm}`} />
          </div>
        </div>
        <div className={`${styles.skeleton} ${styles.skeletonBlock}`} />
      </div>
    ))}
  </>
);

export default function FavoritosFarmaciaPage() {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState("favoritos");
  const [medicamentos, setMedicamentos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); 
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("recente");
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  
  const router = useRouter();
  const { updateSignal } = useNotification();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const handleRequestDelete = (id) => setIdParaExcluir(id);
  const handleCancelDelete = () => setIdParaExcluir(null);
  
  const handleConfirmDelete = async () => {
    if (!idParaExcluir) return;
    try {
      const response = await api.delete(`/avaliacao/${idParaExcluir}`);
      if (response.data.sucesso) {
        setAvaliacoes((prev) => prev.filter((av) => av.ava_id !== idParaExcluir));
        localStorage.removeItem(`review_date_${idParaExcluir}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir.");
    } finally {
      setIdParaExcluir(null);
    }
  };

  const fetchDados = async () => {
    if ((activeTab === "favoritos" && medicamentos.length === 0) || 
        (activeTab === "avaliacoes" && avaliacoes.length === 0)) {
      setLoadingData(true);
    }

    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) { handleLogout(); return; }

      const userData = JSON.parse(userDataString);
      setFarmaciaInfo(userData);
      const idDaFarmacia = userData.farm_id;

      await new Promise(r => setTimeout(r, 400)); // Delay visual

      if (activeTab === "favoritos") {
        const response = await api.get(`/favoritos/${idDaFarmacia}/favoritos`);
        if (response.data.sucesso) {
          const processed = response.data.dados.map(med => ({
            ...med,
            id: med.med_id,
            nome: med.med_nome,
            fabricante: med.fabricante_nome || "Laboratório Genérico",
            dosagem: med.med_dosagem,
            favoritacoes: med.favoritacoes_count || 0,
            status: "em_estoque",
          }));
          setMedicamentos(processed);
        }
      }

      if (activeTab === "avaliacoes") {
        const response = await api.get(`/avaliacao?farmacia_id=${idDaFarmacia}`);
        if (response.data.sucesso) {
           const dadosComData = (response.data.dados || []).map(item => ({
             ...item,
             dataSimulada: item.ava_data_criacao 
                ? new Date(item.ava_data_criacao) 
                : recuperarOuSalvarData(item.ava_id) 
           }));
           setAvaliacoes(dadosComData);
        }
      }

    } catch (error) {
      console.error("Erro API", error);
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [activeTab, updateSignal]);

  const filteredItems = useMemo(() => {
    let data = activeTab === "favoritos" ? [...medicamentos] : [...avaliacoes];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(item => 
        activeTab === "favoritos" 
          ? item.nome?.toLowerCase().includes(lower) 
          : item.ava_comentario?.toLowerCase().includes(lower)
      );
    }

    if (activeTab === "favoritos") {
      if (filterOption === "az") data.sort((a, b) => a.nome.localeCompare(b.nome));
      else if (filterOption === "za") data.sort((a, b) => b.nome.localeCompare(a.nome));
      else data.sort((a, b) => b.favoritacoes - a.favoritacoes);
    } else {
      if (filterOption === "melhor") data.sort((a, b) => b.ava_nota - a.ava_nota);
      else if (filterOption === "pior") data.sort((a, b) => a.ava_nota - b.ava_nota);
      else if (filterOption === "antigo") data.sort((a, b) => a.dataSimulada - b.dataSimulada);
      else data.sort((a, b) => b.dataSimulada - a.dataSimulada); 
    }
    return data;
  }, [activeTab, medicamentos, avaliacoes, searchTerm, filterOption]);

  const stats = useMemo(() => {
    if (avaliacoes.length === 0) return { media: 0, total: 0 };
    const total = avaliacoes.length;
    const soma = avaliacoes.reduce((acc, cur) => acc + Number(cur.ava_nota), 0);
    return { media: (soma / total).toFixed(1), total };
  }, [avaliacoes]);

  // PAGINAÇÃO
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginate = (num) => setCurrentPage(num);

  useEffect(() => { setCurrentPage(1); setSearchTerm(""); }, [activeTab]);

  return (
    <AuthGuard>
      <div className={styles.dashboard}>
        
        {idParaExcluir && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🗑️</div>
              <h3>Excluir Avaliação?</h3>
              <p>Esta ação removerá permanentemente o comentário do usuário.</p>
              <div className={styles.modalActions}>
                <button className={styles.btnModalCancel} onClick={handleCancelDelete}>Cancelar</button>
                <button className={styles.btnModalConfirm} onClick={handleConfirmDelete}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className={styles.title}>
              {activeTab === "favoritos" ? "Favoritos" : "Avaliações"}
            </h1>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logoContainer}>
                {farmaciaInfo?.farm_logo_url && (
                  <img src={farmaciaInfo.farm_logo_url} alt="Logo" className={styles.logoImage} />
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
                <Link href="/farmacias/reservas" className={styles.navLink}>
                  <span className={styles.navText}>Reservas</span>
                </Link>
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

          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          <main className={styles.mainContent}>
            
            <div className={styles.toolbar}>
              <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input 
                  type="text" 
                  placeholder={activeTab === "favoritos" ? "Buscar medicamento..." : "Buscar nos comentários..."}
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className={styles.filterSelect}
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                {activeTab === "favoritos" ? (
                  <>
                    <option value="recente">Mais Favoritados</option>
                    <option value="az">Nome (A-Z)</option>
                    <option value="za">Nome (Z-A)</option>
                  </>
                ) : (
                  <>
                    <option value="recente">Mais Recentes</option>
                    <option value="antigo">Mais Antigas</option>
                    <option value="melhor">Melhor Avaliação</option>
                    <option value="pior">Pior Avaliação</option>
                  </>
                )}
              </select>
            </div>

            {loadingData ? (
              <div className={styles.grid}>
                <SkeletonLoader />
              </div>
            ) : (
              <>
                {/* --- ABA FAVORITOS --- */}
                {activeTab === "favoritos" && (
                   <div className={styles.grid}>
                      {currentItems.length > 0 ? (
                        currentItems.map((med, index) => (
                          <div 
                            className={styles.card} 
                            key={med.id}
                            style={{ animationDelay: `${index * 150}ms` }}
                          >
                            <div className={styles.cardHeader}>
                              <div className={styles.cardUserInfo}>
                                <div className={styles.userAvatar} style={{ background: getAvatarColor(med.id) }}>
                                  #{indexOfFirst + index + 1}
                                </div>
                                <div>
                                  <h2>{med.nome}</h2>
                                  <p>{med.fabricante}</p>
                                </div>
                              </div>
                            </div>
                            <div className={styles.medList}>
                              <div className={styles.medItem}>
                                <div className={styles.medInfo}>
                                  <strong>Favoritações</strong>
                                  <span className={styles.dosagem}>{med.favoritacoes} usuários</span>
                                </div>
                                <span className={styles.badge + " " + styles.inStock}>Ativo</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>
                          <h3>Nenhum favorito encontrado</h3>
                        </div>
                      )}
                   </div>
                )}

                {/* --- ABA AVALIAÇÕES --- */}
                {activeTab === "avaliacoes" && (
                  <>
                    {avaliacoes.length > 0 && (
                      <div className={styles.statsContainer}>
                        <div className={styles.statCard}>
                          <div className={`${styles.statIcon} ${styles.iconStar}`}>★</div>
                          <div className={styles.statInfo}>
                            <h3>Nota Média</h3>
                            <strong>{stats.media}</strong>
                          </div>
                        </div>
                        <div className={styles.statCard}>
                          <div className={`${styles.statIcon} ${styles.iconCount}`}>💬</div>
                          <div className={styles.statInfo}>
                            <h3>Total</h3>
                            <strong>{stats.total}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={styles.grid}>
                      {currentItems.length > 0 ? (
                        currentItems.map((aval, index) => (
                          <div 
                            className={styles.reviewCard} 
                            key={aval.ava_id}
                            style={{ animationDelay: `${index * 150}ms` }}
                          >
                            <div className={styles.reviewHeader}>
                              <div className={styles.reviewUser}>
                                <div 
                                  className={styles.reviewAvatar} 
                                  style={{ background: getAvatarColor(aval.usuario_id) }}
                                >
                                  U{aval.usuario_id}
                                </div>
                                <div className={styles.reviewMeta}>
                                  <h3>Usuário #{aval.usuario_id}</h3>
                                  <div className={styles.reviewDate}>
                                    🕒 {getRelativeTime(aval.dataSimulada)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className={styles.reviewActions}>
                                <button 
                                  className={styles.btnDelete} 
                                  onClick={() => handleRequestDelete(aval.ava_id)}
                                  title="Excluir"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            </div>

                            <div style={{marginTop: '0.5rem'}}>
                                <RenderStars nota={aval.ava_nota} />
                                <div className={styles.verifiedBadge}>
                                    ✓ Compra Verificada
                                </div>
                            </div>
                            
                            <div className={styles.reviewComment}>
                              {aval.ava_comentario || "Nenhum comentário."}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>
                          <h3>Nenhuma avaliação encontrada.</h3>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* PAGINAÇÃO */}
                {totalPages > 1 && (
                  <div className={styles.paginationControls}>
                    <button 
                      className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`} 
                      onClick={() => paginate(currentPage - 1)}
                    > Anterior </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button 
                        key={i} 
                        className={`${styles.paginationNumber} ${currentPage === i + 1 ? styles.active : ''}`}
                        onClick={() => paginate(i + 1)}
                      >{i + 1}</button>
                    ))}
                    <button 
                      className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`} 
                      onClick={() => paginate(currentPage + 1)}
                    > Próxima </button>
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