"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthGuard from "../../../component/AuthGuard";

export default function FavoritosFarmaciaPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("favoritacoes");
  const [sortOrder, setSortOrder] = useState("desc");
  const reportRef = useRef(null);
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
          ultimaAtualizacao: "2025-08-15T14:30:00Z",
        },
        {
          id: "m2",
          nome: "Ibuprofeno 400mg",
          dosagem: "400mg",
          fabricante: "FarmaBem S.A.",
          favoritacoes: 35,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-14T10:15:00Z",
        },
        {
          id: "m3",
          nome: "Omeprazol 20mg",
          dosagem: "20mg",
          fabricante: "MedLab Brasil",
          favoritacoes: 28,
          status: "indisponivel",
          ultimaAtualizacao: "2025-08-16T09:45:00Z",
        },
        {
          id: "m4",
          nome: "Dipirona 500mg",
          dosagem: "500mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 25,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-13T16:20:00Z",
        },
        {
          id: "m5",
          nome: "Amoxicilina 500mg",
          dosagem: "500mg",
          fabricante: "FarmaBem S.A.",
          favoritacoes: 22,
          status: "pendente",
          ultimaAtualizacao: "2025-08-12T11:30:00Z",
        },
        {
          id: "m6",
          nome: "Losartana 50mg",
          dosagem: "50mg",
          fabricante: "MedLab Brasil",
          favoritacoes: 19,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-15T08:45:00Z",
        },
        {
          id: "m7",
          nome: "Atorvastatina 20mg",
          dosagem: "20mg",
          fabricante: "FarmaBem S.A.",
          favoritacoes: 17,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-14T14:20:00Z",
        },
        {
          id: "m8",
          nome: "Metformina 850mg",
          dosagem: "850mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 15,
          status: "indisponivel",
          ultimaAtualizacao: "2025-08-16T10:10:00Z",
        },
        {
          id: "m9",
          nome: "Sinvastatina 20mg",
          dosagem: "20mg",
          fabricante: "MedLab Brasil",
          favoritacoes: 13,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-13T15:35:00Z",
        },
        {
          id: "m10",
          nome: "AAS 100mg",
          dosagem: "100mg",
          fabricante: "FarmaBem S.A.",
          favoritacoes: 11,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-12T09:15:00Z",
        },
        {
          id: "m11",
          nome: "Clonazepam 2mg",
          dosagem: "2mg",
          fabricante: "MedFarma Ltda",
          favoritacoes: 9,
          status: "pendente",
          ultimaAtualizacao: "2025-08-11T13:40:00Z",
        },
        {
          id: "m12",
          nome: "Hidroclorotiazida 25mg",
          dosagem: "25mg",
          fabricante: "MedLab Brasil",
          favoritacoes: 7,
          status: "em_estoque",
          ultimaAtualizacao: "2025-08-10T16:25:00Z",
        },
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

  // Filtrar e ordenar medicamentos
  const filteredMedicamentos = medicamentos.filter((med) => {
    const medDate = new Date(med.ultimaAtualizacao);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const dateInRange = medDate >= startDate && medDate <= endDate;
    const statusMatch = statusFilter === "todos" || med.status === statusFilter;

    return dateInRange && statusMatch;
  });

  const sortedMedicamentos = [...filteredMedicamentos].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === "nome") {
      valueA = a.nome.toLowerCase();
      valueB = b.nome.toLowerCase();
    } else if (sortBy === "fabricante") {
      valueA = a.fabricante.toLowerCase();
      valueB = b.fabricante.toLowerCase();
    } else if (sortBy === "data") {
      valueA = new Date(a.ultimaAtualizacao);
      valueB = new Date(b.ultimaAtualizacao);
    } else {
      valueA = a[sortBy];
      valueB = b[sortBy];
    }

    if (typeof valueA === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Cálculos de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMedicamentos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedMedicamentos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      window.print();
      setReportGenerated(false);
    }, 500);
  };

  const exportToCSV = () => {
    const headers = [
      "Nome",
      "Dosagem",
      "Fabricante",
      "Favoritações",
      "Status",
      "Última Atualização",
    ];
    const csvData = [
      headers.join(","),
      ...sortedMedicamentos.map((med) =>
        [
          `"${med.nome}"`,
          `"${med.dosagem}"`,
          `"${med.fabricante}"`,
          med.favoritacoes,
          `"${
            med.status === "em_estoque"
              ? "Disponível"
              : med.status === "indisponivel"
              ? "Indisponível"
              : "Pendente"
          }"`,
          `"${new Date(med.ultimaAtualizacao).toLocaleDateString("pt-BR")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio_favoritos_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

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
            <button
              className={styles.reportButton}
              onClick={generateReport}
              title="Gerar relatório para impressão"
            >
              Gerar Relatório
            </button>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* Sidebar Não Fixa */}
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
                ×
              </button>
            </div>

            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <a
                  href="/farmacias/favoritos"
                  className={styles.navLink}
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
                <a
                  href="/farmacias/laboratorio/lista"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Laboratórios</span>
                </a>
              </div>

              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <a
                  href="/farmacias/relatorios/favoritos"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Favoritos</span>
                </a>
                <a
                  href="/farmacias/relatorios/funcionarios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Funcionários</span>
                </a>
                <a
                  href="/farmacias/relatorios/laboratorios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Laboratórios</span>
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
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
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

            {/* Cabeçalho do relatório */}
              <div className={styles.reportHeader}>
                <div className={styles.reportLogo}>
                 
                </div>
                <div className={styles.reportTitle}>
                  <h1>Relatório de Medicamentos Mais Favoritados</h1>
                  <p>
                    Período:{" "}
                    {new Date(dateRange.start).toLocaleDateString("pt-BR")} a{" "}
                    {new Date(dateRange.end).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    Data do relatório: {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            {/* Informações do relatório - MOVIDA PARA CIMA */}
            <div className={styles.reportInfo}>
              <p>
                Mostrando {filteredMedicamentos.length} de {medicamentos.length}{" "}
                medicamentos
              </p>
              <p>
                Período: {new Date(dateRange.start).toLocaleDateString("pt-BR")}{" "}
                a {new Date(dateRange.end).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Filtros e controles - MOVIDA PARA BAIXO */}
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Período:</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                  <span>até</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label>Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="em_estoque">Disponível</option>
                    <option value="indisponivel">Indisponível</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
              </div>
              
              
            </div>

            {/* Área do relatório para impressão */}
            <div
              ref={reportRef}
              className={`${styles.reportContainer} ${
                reportGenerated ? styles.reportMode : ""
              }`}
            >
              

              {/* Tabela de Medicamentos */}
              <table className={styles.reportTable}>
                <thead>
                  <tr>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("nome")}
                    >
                      Nome {getSortIcon("nome")}
                    </th>
                    <th>Dosagem</th>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("fabricante")}
                    >
                      Fabricante {getSortIcon("fabricante")}
                    </th>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("favoritacoes")}
                    >
                      Favoritações {getSortIcon("favoritacoes")}
                    </th>
                    <th>Status</th>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("data")}
                    >
                      Última Atualização {getSortIcon("data")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((med, index) => (
                    <tr key={med.id}>
                      <td className={styles.medName}>{med.nome}</td>
                      <td>{med.dosagem}</td>
                      <td>{med.fabricante}</td>
                      <td className={styles.favoritacoes}>
                        {med.favoritacoes}
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
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
                      </td>
                      <td>
                        {new Date(med.ultimaAtualizacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumo do relatório */}
              <div className={styles.reportSummary}>
                <h2>Resumo do Relatório</h2>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>
                      Total de Medicamentos
                    </span>
                    <span className={styles.summaryValue}>
                      {filteredMedicamentos.length}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>
                      Total de Favoritações
                    </span>
                    <span className={styles.summaryValue}>
                      {filteredMedicamentos.reduce(
                        (sum, med) => sum + med.favoritacoes,
                        0
                      )}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>
                      Média de Favoritações
                    </span>
                    <span className={styles.summaryValue}>
                      {filteredMedicamentos.length > 0
                        ? Math.round(
                            filteredMedicamentos.reduce(
                              (sum, med) => sum + med.favoritacoes,
                              0
                            ) / filteredMedicamentos.length
                          )
                        : 0}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>
                      Medicamento Mais Favoritado
                    </span>
                    <span className={styles.summaryValue}>
                      {filteredMedicamentos.length > 0
                        ? filteredMedicamentos.sort(
                            (a, b) => b.favoritacoes - a.favoritacoes
                          )[0].nome
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rodapé do relatório (só aparece na impressão) */}
              <div className={styles.reportFooter}>
                <p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p>
                <p>PharmaX - Sistema de Gestão Farmacêutica</p>
              </div>
            </div>

            {/* Controles de Paginação (não aparece no relatório) */}
            {totalPages > 1 && !reportGenerated && (
              <div className={styles.paginationControls}>
                <button
                  className={`${styles.paginationBtn} ${
                    currentPage === 1 ? styles.disabled : ""
                  }`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>

                <div className={styles.paginationNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        className={`${styles.paginationNumber} ${
                          currentPage === number ? styles.active : ""
                        }`}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    )
                  )}
                </div>

                <button
                  className={`${styles.paginationBtn} ${
                    currentPage === totalPages ? styles.disabled : ""
                  }`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima →
                </button>
              </div>
            )}

            {filteredMedicamentos.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <h3>Nenhum medicamento encontrado</h3>
                <p>Nenhum medicamento corresponde aos filtros selecionados.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}