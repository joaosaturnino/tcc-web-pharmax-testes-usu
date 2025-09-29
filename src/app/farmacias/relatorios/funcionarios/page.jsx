"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import api from "../../../services/api"; // Ajuste o caminho conforme sua estrutura

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
  const [error, setError] = useState("");
  const reportRef = useRef(null);
  const router = useRouter();

  // Buscar funcionários da API
  useEffect(() => {
    listarFuncionarios();
  }, []);

  const listarFuncionarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/funcionario");

      if (response.data.sucesso) {
        // Mapear os dados da API para o formato usado no frontend
        const funcionariosFormatados = response.data.dados.map(func => ({
          id: func.func_id,
          nome: func.func_nome,
          email: func.func_email,
          telefone: func.func_telefone,
          cpf: func.func_cpf,
          dataNascimento: func.func_dtnasc,
          endereco: func.func_endereco,
          usuario: func.func_usuario,
          nivelAcesso: func.func_nivel,
          status: "ativo", // A API atual não tem status, considerar todos como ativos
          dataCadastro: new Date().toISOString().split('T')[0] // Fallback - ajuste conforme sua necessidade
        }));

        setFuncionarios(funcionariosFormatados);
      } else {
        setError("Erro ao carregar funcionários: " + response.data.mensagem);
        setFuncionarios(gerarFuncionariosFicticios(20));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setError("Erro ao conectar com o servidor. Usando dados de exemplo.");

      if (process.env.NODE_ENV === 'development') {
        console.warn("Usando dados fictícios devido ao erro na API");
        setFuncionarios(gerarFuncionariosFicticios(20));
      }
    } finally {
      setLoading(false);
    }
  };

  // Função de fallback para dados fictícios
  const gerarFuncionariosFicticios = (quantidade = 20) => {
    const niveis = ["Administrador", "Gerente", "Supervisor", "Funcionário", "Visitante"];
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
        dataCadastro: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
    }
    return funcionarios;
  };

  const filteredFuncionarios = funcionarios.filter((func) => {
    const dataCadastro = new Date(func.dataCadastro);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchDate = dataCadastro >= startDate && dataCadastro <= endDate;
    const matchNivel = nivelAcessoFilter === "todos" || func.nivelAcesso === nivelAcessoFilter;
    const matchStatus = statusFilter === "todos" || func.status === statusFilter;
    return matchDate && matchNivel && matchStatus;
  });

  const sortedFuncionarios = [...filteredFuncionarios].sort((a, b) => {
    let valA = a[sortBy]; let valB = b[sortBy];
    if (sortBy === "dataCadastro") { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFuncionarios.slice(indexOfFirstItem, indexOfLastItem);
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
      setSortBy(column); setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
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

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <span>Carregando funcionários...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className={styles.title}>Relatório de Funcionários</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.reportButton} onClick={generateReport} title="Gerar relatório para impressão">Gerar Relatório</button>
        </div>
      </header>

      <div className={styles.contentWrapper}>
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
                <span className={styles.navText}>Medicamentos Favoritos</span>
              </a>
              <a href="/farmacias/relatorios/funcionarios" className={`${styles.navLink} ${styles.active}`}>
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
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className={styles.navText}>Sair</span>
              </button>
            </div>
          </nav>
        </aside>

        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        <main className={styles.mainContent}>
          {error && (<div className={styles.errorMessage}><span>{error}</span></div>)}

          {/* ÁREA DE CONTROLES VISÍVEL APENAS NA TELA */}
          {!reportGenerated && (
            <>
              <div className={styles.reportInfo}>
                <p>Mostrando {currentItems.length} de {filteredFuncionarios.length} funcionários</p>
              </div>

              <div className={styles.controls}>
                <div className={styles.filters}>
                  <div className={styles.filterGroup}>
                    <label>Período:</label>
                    <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                    <span>até</span>
                    <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                  </div>
                  <div className={styles.filterGroup}>
                    <label>Nível de Acesso:</label>
                    <select value={nivelAcessoFilter} onChange={(e) => setNivelAcessoFilter(e.target.value)}>
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
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="todos">Todos</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ÁREA DE IMPRESSÃO */}
          <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>

            <div className={styles.reportHeader}>
              <img
                src="../../../../../temp/LogoEscrita.png"
                alt="Logo PharmaX"
                className={styles.printLogo}
              />
              <div className={styles.reportTitle}>
                <h1>Relatório de Funcionários</h1>
                <p>
                  Período:{" "}
                  {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a{" "}
                  {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                </p>
                <p>
                  Data do relatório: {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th className={styles.sortableHeader} onClick={() => handleSort("nome")}>Nome {getSortIcon("nome")}</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Usuário</th>
                  <th className={styles.sortableHeader} onClick={() => handleSort("nivelAcesso")}>Nível {getSortIcon("nivelAcesso")}</th>
                  <th className={styles.sortableHeader} onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th>
                  <th className={styles.sortableHeader} onClick={() => handleSort("dataCadastro")}>Cadastro {getSortIcon("dataCadastro")}</th>
                </tr>
              </thead>
              <tbody>
                {(reportGenerated ? sortedFuncionarios : currentItems).map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td className={styles.medName}>{funcionario.nome}</td>
                    <td>{funcionario.email}</td>
                    <td>{funcionario.telefone}</td>
                    <td>{funcionario.cpf}</td>
                    <td>{funcionario.usuario}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[funcionario.nivelAcesso.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")]}`}>
                        {funcionario.nivelAcesso}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${funcionario.status === "ativo" ? styles.inStock : styles.outStock}`}>
                        {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      {new Date(funcionario.dataCadastro).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.reportSummary}>
              <h2>Resumo do Relatório</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}><span className={styles.summaryLabel}>Total</span><span className={styles.summaryValue}>{filteredFuncionarios.length}</span></div>
                <div className={styles.summaryItem}><span className={styles.summaryLabel}>Ativos</span><span className={styles.summaryValue}>{filteredFuncionarios.filter(f => f.status === "ativo").length}</span></div>
                <div className={styles.summaryItem}><span className={styles.summaryLabel}>Inativos</span><span className={styles.summaryValue}>{filteredFuncionarios.filter(f => f.status === "inativo").length}</span></div>
                <div className={styles.summaryItem}><span className={styles.summaryLabel}>Admins.</span><span className={styles.summaryValue}>{filteredFuncionarios.filter(f => f.nivelAcesso === "Administrador").length}</span></div>
              </div>
            </div>

            <div className={styles.reportFooter}>
              <p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p>
              <p>PharmaX - Sistema de Gestão Farmacêutica</p>
            </div>
          </div>

          {!reportGenerated && totalPages > 1 && (
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

          {!reportGenerated && filteredFuncionarios.length === 0 && !loading && (
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