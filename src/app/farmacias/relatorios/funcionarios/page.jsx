"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function RelatorioFuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([]);
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
  const [nivelAcessoFilter, setNivelAcessoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("dataCadastro");
  const [sortOrder, setSortOrder] = useState("desc");
  const reportRef = useRef(null);
  const router = useRouter();

  // Função para gerar dados fictícios de funcionários
  const gerarFuncionariosFicticios = (quantidade = 50) => {
    const niveis = [
      "Administrador",
      "Gerente",
      "Supervisor",
      "Funcionário",
      "Visitante",
    ];
    const statusArr = ["ativo", "inativo"];
    const funcionarios = [];
    for (let i = 1; i <= quantidade; i++) {
      funcionarios.push({
        id: i,
        nome: `Funcionário ${i}`,
        email: `func${i}@pharmax.com`,
        telefone: `1199999${String(i).padStart(4, "0")}`,
        cpf: `000.000.000-${String(i).padStart(2, "0")}`,
        usuario: `usuario${i}`,
        nivelAcesso: niveis[Math.floor(Math.random() * niveis.length)],
        status: statusArr[Math.floor(Math.random() * statusArr.length)],
        dataCadastro: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
      });
    }
    return funcionarios;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFuncionarios(gerarFuncionariosFicticios(50));
      setLoading(false);
    }, 800);
  }, []);

  // Filtrar e ordenar funcionários
  const filteredFuncionarios = funcionarios.filter((func) => {
    const dataCadastro = new Date(func.dataCadastro);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchDate =
      dataCadastro >= startDate && dataCadastro <= endDate;
    const matchNivel =
      nivelAcessoFilter === "todos" ||
      func.nivelAcesso === nivelAcessoFilter;
    const matchStatus =
      statusFilter === "todos" || func.status === statusFilter;
    return matchDate && matchNivel && matchStatus;
  });

  const sortedFuncionarios = [...filteredFuncionarios].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === "dataCadastro") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Cálculos de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFuncionarios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedFuncionarios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      window.print();
      setReportGenerated(false);
    }, 500);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className={styles.title}>Relatório de Funcionários</h1>
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
              <a href="/farmacias/favoritos" className={styles.navLink}>
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
                <span className={styles.navText}>Relatório de Favoritos</span>
              </a>
              <a href="/farmacias/relatorios/funcionarios" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navText}>Relatório de Funcionários</span>
              </a>
              <a href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                <span className={styles.navText}>Relatório de Laboratórios</span>
              </a>
            </div>
          </nav>
        </aside>
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className={styles.mainContent}>
          <div className={styles.reportHeader}>
            <div className={styles.reportLogo}></div>
            <div className={styles.reportTitle}>
              <h1>Relatório de Funcionários</h1>
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
          <div className={styles.reportInfo}>
            <p>
              Mostrando {filteredFuncionarios.length} de {funcionarios.length}{" "}
              funcionários
            </p>
            <p>
              Período: {new Date(dateRange.start).toLocaleDateString("pt-BR")}{" "}
              a {new Date(dateRange.end).toLocaleDateString("pt-BR")}
            </p>
          </div>
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
                <label>Nível de Acesso:</label>
                <select
                  value={nivelAcessoFilter}
                  onChange={(e) => setNivelAcessoFilter(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Funcionário">Funcionário</option>
                  <option value="Visitante">Visitante</option>
                </select>
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
          </div>
          <div
            ref={reportRef}
            className={`${styles.reportContainer} ${
              reportGenerated ? styles.reportMode : ""
            }`}
          >
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("nome")}
                  >
                    Nome {getSortIcon("nome")}
                  </th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Usuário</th>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("nivelAcesso")}
                  >
                    Nível de Acesso {getSortIcon("nivelAcesso")}
                  </th>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th
                    className={styles.sortableHeader}
                    onClick={() => handleSort("dataCadastro")}
                  >
                    Data de Cadastro {getSortIcon("dataCadastro")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td className={styles.medName}>{funcionario.nome}</td>
                    <td>{funcionario.email}</td>
                    <td>{funcionario.telefone}</td>
                    <td>{funcionario.cpf}</td>
                    <td>{funcionario.usuario}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[
                            funcionario.nivelAcesso
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                          ]
                        }`}
                      >
                        {funcionario.nivelAcesso}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          funcionario.status === "ativo"
                            ? styles.inStock
                            : styles.outStock
                        }`}
                      >
                        {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      {new Date(funcionario.dataCadastro).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.reportSummary}>
              <h2>Resumo do Relatório</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>
                    Total de Funcionários
                  </span>
                  <span className={styles.summaryValue}>
                    {filteredFuncionarios.length}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>
                    Funcionários Ativos
                  </span>
                  <span className={styles.summaryValue}>
                    {filteredFuncionarios.filter(f => f.status === "ativo").length}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>
                    Funcionários Inativos
                  </span>
                  <span className={styles.summaryValue}>
                    {filteredFuncionarios.filter(f => f.status === "inativo").length}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>
                    Administradores
                  </span>
                  <span className={styles.summaryValue}>
                    {filteredFuncionarios.filter(f => f.nivelAcesso === "Administrador").length}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.reportFooter}>
              <p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p>
              <p>PharmaX - Sistema de Gestão Farmacêutica</p>
            </div>
          </div>
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
          {filteredFuncionarios.length === 0 && !loading && (
            <div className={styles.emptyState}>
              <h3>Nenhum funcionário encontrado</h3>
              <p>Nenhum funcionário corresponde aos filtros selecionados.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}