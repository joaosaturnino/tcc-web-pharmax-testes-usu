"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favoritos.module.css";

import AuthGuard from "../../componentes/AuthGuard";
import MedicamentoCard from "../../componentes/produtos/cards/index"; // Importando o card
import medicamentosFavoritosMock from "../../componentes/mockup/medicamentos"; // Importando o mock real

export default function FavoritosFarmaciaPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    // Carregando e adaptando os dados do mock de medicamentos.js
    setTimeout(() => {
      const mockAdaptado = medicamentosFavoritosMock.map((med) => ({
        id: med.med_id,
        nome: med.med_nome,
        dosagem: med.med_dosagem,
        // Campos não existentes no mock que precisam de valores padrão
        fabricante: `Laboratório ${med.lab_id}`,
        favoritacoes: Math.floor(Math.random() * 100), // Gerando valor aleatório para demonstração
        status: "em_estoque", // Definindo um status padrão
        ultimaAtualizacao: med.med_data_atualizacao,
      }));

      setMedicamentos(mockAdaptado);
      setLoading(false);
    }, 800);
  }, []);

  const handleStatusChange = async (medicamentoId, novoStatus) => {
    // Lógica para atualizar o status de um medicamento
    console.log(`Mudando status do medicamento ${medicamentoId} para ${novoStatus}`);
    setMedicamentos(
      medicamentos.map((med) =>
        med.id === medicamentoId ? { ...med, status: novoStatus } : med
      )
    );
    // Em um cenário real, aqui você faria uma chamada de API para o backend.
  };

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

  // Cálculos de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Ordenando por 'favoritacoes' antes de paginar
  const sortedMedicamentos = [...medicamentos].sort((a, b) => b.favoritacoes - a.favoritacoes);
  const currentItems = sortedMedicamentos.slice(indexOfFirstItem, indexOfLastItem);
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
            {/* Botões de ação do header */}
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
              {/* Seções de Navegação */}
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
                <a href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </a>
                <a href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Laboratorios</span>
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
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Overlay para mobile */}
          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          {/* Conteúdo Principal */}
          <main className={styles.mainContent}>
            {/* Grid de Medicamentos */}
            <div className={styles.grid}>
              {currentItems.map((med, index) => (
                <MedicamentoCard
                  key={med.id}
                  medicamento={med}
                  index={indexOfFirstItem + index}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className={styles.paginationControls}>
                <button
                  className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ""}`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <div className={styles.paginationNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      className={`${styles.paginationNumber} ${currentPage === number ? styles.active : ""}`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button
                  className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ""}`}
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