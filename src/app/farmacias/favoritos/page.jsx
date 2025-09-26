"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";
import AuthGuard from "../../componentes/AuthGuard"; // Componente que protege a rota
import api from "../../services/api"; // Seu arquivo de configuração da API

export default function FavoritosFarmaciaPage() {
  // --- ESTADOS DO COMPONENTE ---
  const [medicamentos, setMedicamentos] = useState([]);
  const [loadingData, setLoadingData] = useState(true); // Estado para o carregamento dos dados da API
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  // --- EFEITO PARA BUSCAR OS DADOS QUANDO O COMPONENTE É MONTADO ---
  useEffect(() => {
    const fetchMedicamentosFavoritos = async () => {
      try {
        // A instância 'api' deve ser configurada para enviar o 'authToken' salvo no localStorage
        const response = await api.get('/favoritos');
        
        if (response.data.sucesso) {
          // Processa os dados recebidos para o formato esperado pelo frontend
          const processedMedicamentos = response.data.dados.map(med => ({
            ...med,
            id: med.med_id,
            nome: med.med_nome,
            fabricante: med.fabricante_nome || `Laboratório ${med.lab_nome}`,
            dosagem: med.med_dosagem,
            favoritacoes: med.favoritacoes_count || 0,
            status: med.status || "pendente",
            ultimaAtualizacao: med.med_data_atualizacao 
              ? new Date(med.med_data_atualizacao).toISOString() 
              : new Date().toISOString(),
          }));
          setMedicamentos(processedMedicamentos);
        } else {
          console.error("A API retornou um erro:", response.data.mensagem);
          alert("Não foi possível carregar os favoritos.");
        }
      } catch (error) {
        console.error("Falha na chamada à API:", error);
        // Se o erro for 'Não Autorizado' (token inválido/expirado), desloga o usuário
        if (error.response?.status === 401) {
          alert("Sua sessão expirou. Por favor, faça o login novamente.");
          handleLogout();
        } else {
          alert("Não foi possível conectar ao servidor.");
        }
      } finally {
        setLoadingData(false); // Finaliza o carregamento dos dados
      }
    };

    fetchMedicamentosFavoritos();
  }, []); // O array vazio garante que o useEffect rode apenas uma vez

  // --- FUNÇÃO DE LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  // --- LÓGICA DE PAGINAÇÃO ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medicamentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicamentos.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    // AuthGuard protege todo o conteúdo da página
    <AuthGuard>
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
        </header>

        <div className={styles.contentWrapper}>
          {/* Sidebar */}
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
                <a href="/farmacias/favoritos" className={`${styles.navLink} ${styles.active}`}>
                  <span className={styles.navText}>Favoritos</span>
                </a>
                <a href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <a href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                  <span className={styles.navText}>Funcionários</span>
                </a>
                <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <a href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <a href="/farmacias/perfil" className={styles.navLink}>
                  <span className={styles.navText}>Meu Perfil</span>
                </a>
                <button
                  onClick={handleLogout}
                  className={styles.navLink}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Overlay para fechar a sidebar em telas menores */}
          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}

          {/* Conteúdo Principal */}
          <main className={styles.mainContent}>
            {loadingData ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando medicamentos favoritos...</p>
              </div>
            ) : (
              <>
                {/* Grid de Medicamentos */}
                <div className={styles.grid}>
                  {currentItems.length > 0 ? (
                    currentItems
                      .sort((a, b) => b.favoritacoes - a.favoritacoes)
                      .map((med, index) => (
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
                              <span className={`${styles.badge} ${med.status === "em_estoque" ? styles.inStock : med.status === "indisponivel" ? styles.outStock : styles.pending}`}>
                                {med.status === "em_estoque" ? "Disponível" : med.status === "indisponivel" ? "Indisponível" : "Pendente"}
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
                      <p>Os medicamentos favoritados pelos clientes aparecerão aqui.</p>
                    </div>
                  )}
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
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}