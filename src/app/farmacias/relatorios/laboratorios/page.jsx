"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthGuard from "../../../component/AuthGuard";

export default function RelatorioLaboratoriosPage() {
  const [laboratorios, setLaboratorios] = useState([]);
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
  const [sortBy, setSortBy] = useState("nome");
  const [sortOrder, setSortOrder] = useState("asc");
  const reportRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Mock para desenvolvimento (substituir pelo fetch real)
    setTimeout(() => {
      const mockLaboratorios = [
        {
          id: "l1",
          nome: "LabVida",
          endereco: "Rua A, 123",
          telefone: "(11) 9999-9999",
          email: "contato@labvida.com",
          status: "ativo",
          medicamentosCadastrados: 42,
          dataCadastro: "2023-01-15",
        },
        {
          id: "l2",
          nome: "BioPharma",
          endereco: "Av. B, 456",
          telefone: "(21) 9888-8888",
          email: "vendas@biopharma.com",
          status: "ativo",
          medicamentosCadastrados: 35,
          dataCadastro: "2023-02-20",
        },
        {
          id: "l3",
          nome: "PharmaTech",
          endereco: "Rua C, 789",
          telefone: "(31) 9777-7777",
          email: "info@pharmatech.com",
          status: "inativo",
          medicamentosCadastrados: 28,
          dataCadastro: "2023-03-10",
        },
        {
          id: "l4",
          nome: "MedLab",
          endereco: "Av. D, 101",
          telefone: "(41) 9666-6666",
          email: "suporte@medlab.com",
          status: "ativo",
          medicamentosCadastrados: 25,
          dataCadastro: "2023-04-15",
        },
        {
          id: "l5",
          nome: "HealthSolutions",
          endereco: "Rua E, 202",
          telefone: "(51) 9555-5555",
          email: "contato@healthsolutions.com",
          status: "ativo",
          medicamentosCadastrados: 22,
          dataCadastro: "2023-05-22",
        },
        {
          id: "l6",
          nome: "FarmaBrasil",
          endereco: "Av. F, 303",
          telefone: "(61) 9444-4444",
          email: "contato@farmabrasil.com",
          status: "ativo",
          medicamentosCadastrados: 19,
          dataCadastro: "2023-06-18",
        },
        {
          id: "l7",
          nome: "LabGen",
          endereco: "Rua G, 404",
          telefone: "(71) 9333-3333",
          email: "info@labgen.com",
          status: "inativo",
          medicamentosCadastrados: 17,
          dataCadastro: "2023-07-05",
        },
        {
          id: "l8",
          nome: "BioMed",
          endereco: "Av. H, 505",
          telefone: "(81) 9222-2222",
          email: "contato@biomed.com",
          status: "ativo",
          medicamentosCadastrados: 15,
          dataCadastro: "2023-08-12",
        },
        {
          id: "l9",
          nome: "PharmaScience",
          endereco: "Rua I, 606",
          telefone: "(91) 9111-1111",
          email: "vendas@pharmascience.com",
          status: "ativo",
          medicamentosCadastrados: 13,
          dataCadastro: "2023-09-20",
        },
        {
          id: "l10",
          nome: "GenLab",
          endereco: "Av. J, 707",
          telefone: "(31) 9000-0000",
          email: "contato@genlab.com",
          status: "ativo",
          medicamentosCadastrados: 11,
          dataCadastro: "2023-10-25",
        },
        {
          id: "l11",
          nome: "MedTech",
          endereco: "Rua K, 808",
          telefone: "(11) 9777-7777",
          email: "info@medtech.com",
          status: "inativo",
          medicamentosCadastrados: 9,
          dataCadastro: "2023-11-15",
        },
        {
          id: "l12",
          nome: "BioFarma",
          endereco: "Av. L, 909",
          telefone: "(21) 9666-6666",
          email: "contato@biofarma.com",
          status: "ativo",
          medicamentosCadastrados: 7,
          dataCadastro: "2023-12-05",
        },
      ];

      setLaboratorios(mockLaboratorios);
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

  // Filtrar e ordenar laboratórios
  const filteredLaboratorios = laboratorios.filter((lab) => {
    const labDate = new Date(lab.dataCadastro);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const dateInRange = labDate >= startDate && labDate <= endDate;
    const statusMatch = statusFilter === "todos" || lab.status === statusFilter;

    return dateInRange && statusMatch;
  });

  const sortedLaboratorios = [...filteredLaboratorios].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === "nome") {
      valueA = a.nome.toLowerCase();
      valueB = b.nome.toLowerCase();
    } else if (sortBy === "email") {
      valueA = a.email.toLowerCase();
      valueB = b.email.toLowerCase();
    } else if (sortBy === "data") {
      valueA = new Date(a.dataCadastro);
      valueB = new Date(b.dataCadastro);
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
  const currentItems = sortedLaboratorios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedLaboratorios.length / itemsPerPage);

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
      "Endereço",
      "Telefone",
      "Email",
      "Medicamentos Cadastrados",
      "Status",
      "Data de Cadastro",
    ];
    const csvData = [
      headers.join(","),
      ...sortedLaboratorios.map((lab) =>
        [
          `"${lab.nome}"`,
          `"${lab.endereco}"`,
          `"${lab.telefone}"`,
          `"${lab.email}"`,
          lab.medicamentosCadastrados,
          `"${lab.status === "ativo" ? "Ativo" : "Inativo"}"`,
          `"${new Date(lab.dataCadastro).toLocaleDateString("pt-BR")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio_laboratorios_${new Date().toISOString().split("T")[0]}.csv`
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
          <p>Carregando laboratórios...</p>
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
            <h1 className={styles.title}>Relatório de Laboratórios</h1>
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
                  className={`${styles.navLink} ${styles.active}`}
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
                {/* Logo pode ser adicionado aqui */}
              </div>
              <div className={styles.reportTitle}>
                <h1>Relatório de Laboratórios</h1>
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

            {/* Informações do relatório */}
            <div className={styles.reportInfo}>
              <p>
                Mostrando {filteredLaboratorios.length} de {laboratorios.length}{" "}
                laboratórios
              </p>
              <p>
                Período: {new Date(dateRange.start).toLocaleDateString("pt-BR")}{" "}
                a {new Date(dateRange.end).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Filtros e controles */}
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
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.exportButtons}>
                <button className={styles.csvButton} onClick={exportToCSV}>
                  Exportar CSV
                </button>
              </div>
            </div>

            {/* Área do relatório para impressão */}
            <div
              ref={reportRef}
              className={`${styles.reportContainer} ${
                reportGenerated ? styles.reportMode : ""
              }`}
            >
              {/* Tabela de Laboratórios */}
              <table className={styles.reportTable}>
                <thead>
                  <tr>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("nome")}
                    >
                      Nome {getSortIcon("nome")}
                    </th>
                    <th>Endereço</th>
                    <th>Telefone</th>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("email")}
                    >
                      Email {getSortIcon("email")}
                    </th>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("medicamentosCadastrados")}
                    >
                      Medicamentos {getSortIcon("medicamentosCadastrados")}
                    </th>
                    <th>Status</th>
                    <th
                      className={styles.sortableHeader}
                      onClick={() => handleSort("data")}
                    >
                      Data de Cadastro {getSortIcon("data")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((lab) => (
                      <tr key={lab.id}>
                        <td>{lab.nome}</td>
                        <td>{lab.endereco}</td>
                        <td>{lab.telefone}</td>
                        <td>{lab.email}</td>
                        <td className={styles.numberCell}>
                          {lab.medicamentosCadastrados}
                        </td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              lab.status === "ativo"
                                ? styles.statusActive
                                : styles.statusInactive
                            }`}
                          >
                            {lab.status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td>
                          {new Date(lab.dataCadastro).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.noData}>
                        Nenhum laboratório encontrado para os filtros aplicados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={currentPage === page ? styles.active : ""}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}