"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthGuard from "../../../component/AuthGuard";

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
    const nomes = [
      "Maria", "João", "Ana", "Pedro", "Carla", "Roberto", "Fernanda", 
      "Ricardo", "Patrícia", "Marcos", "Juliana", "Gustavo", "Luciana", 
      "Rafael", "Camila", "Bruno", "Tatiane", "Diego", "Vanessa", "Anderson"
    ];
    
    const sobrenomes = [
      "Silva", "Santos", "Oliveira", "Souza", "Costa", "Pereira", "Carvalho", 
      "Almeida", "Ferreira", "Rodrigues", "Martins", "Rocha", "Araujo", "Lima", 
      "Mendes", "Barbosa", "Gomes", "Ribeiro", "Alves", "Nunes"
    ];
    
    const niveisAcesso = ["Administrador", "Gerente", "Supervisor", "Funcionário", "Visitante"];
    const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre", "Curitiba", "Salvador", "Fortaleza", "Recife"];
    const estados = ["SP", "RJ", "MG", "RS", "PR", "BA", "CE", "PE"];
    const ruas = ["Rua das Flores", "Av. Paulista", "Rua Augusta", "Alameda Santos", "Rua Consolação", "Av. Brasil", "Rua XV de Novembro", "Av. Getúlio Vargas"];
    
    const funcionariosGerados = [];
    
    for (let i = 0; i < quantidade; i++) {
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      const nomeCompleto = `${nome} ${sobrenome}`;
      
      const primeiroNome = nome.toLowerCase();
      const ultimoSobrenome = sobrenome.toLowerCase();
      const email = `${primeiroNome}.${ultimoSobrenome}@pharmax.com`;
      const usuario = `${primeiroNome}.${ultimoSobrenome}`;
      
      const nivelAcesso = niveisAcesso[Math.floor(Math.random() * niveisAcesso.length)];
      const status = Math.random() > 0.15 ? "ativo" : "inativo";
      
      // Gerar data de nascimento entre 18 e 65 anos atrás
      const idade = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
      const dataNascimento = new Date();
      dataNascimento.setFullYear(dataNascimento.getFullYear() - idade);
      dataNascimento.setMonth(Math.floor(Math.random() * 12));
      dataNascimento.setDate(Math.floor(Math.random() * 28) + 1);
      
      // Gerar data de cadastro nos últimos 2 anos
      const dataCadastro = new Date();
      dataCadastro.setFullYear(dataCadastro.getFullYear() - Math.random() * 2);
      dataCadastro.setMonth(Math.floor(Math.random() * 12));
      dataCadastro.setDate(Math.floor(Math.random() * 28) + 1);
      dataCadastro.setHours(Math.floor(Math.random() * 24));
      dataCadastro.setMinutes(Math.floor(Math.random() * 60));
      
      // Gerar CPF fictício
      const cpf = Array.from({length: 11}, () => Math.floor(Math.random() * 10)).join('');
      const cpfFormatado = `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
      
      // Gerar telefone fictício
      const ddd = ["11", "21", "31", "41", "51", "81", "71", "47"];
      const telefone = `(${ddd[Math.floor(Math.random() * ddd.length)]}) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Gerar endereço fictício
      const cidade = cidades[Math.floor(Math.random() * cidades.length)];
      const estado = estados[cidades.indexOf(cidade) % estados.length];
      const endereco = `${ruas[Math.floor(Math.random() * ruas.length)]}, ${Math.floor(Math.random() * 1000) + 1} - ${cidade}/${estado}`;
      
      funcionariosGerados.push({
        id: `f${i + 1}`,
        nome: nomeCompleto,
        email: email,
        telefone: telefone,
        cpf: cpfFormatado,
        dataNascimento: dataNascimento.toISOString().split("T")[0],
        endereco: endereco,
        usuario: usuario,
        nivelAcesso: nivelAcesso,
        dataCadastro: dataCadastro.toISOString(),
        status: status
      });
    }
    
    return funcionariosGerados;
  };

  useEffect(() => {
    // Simular busca de dados
    setTimeout(() => {
      const funcionariosFicticios = gerarFuncionariosFicticios(50);
      setFuncionarios(funcionariosFicticios);
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

  // Filtrar e ordenar funcionários
  const filteredFuncionarios = funcionarios.filter((func) => {
    const funcDate = new Date(func.dataCadastro);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const dateInRange = funcDate >= startDate && funcDate <= endDate;
    const nivelAcessoMatch = nivelAcessoFilter === "todos" || func.nivelAcesso === nivelAcessoFilter;
    const statusMatch = statusFilter === "todos" || func.status === statusFilter;

    return dateInRange && nivelAcessoMatch && statusMatch;
  });

  const sortedFuncionarios = [...filteredFuncionarios].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === "nome") {
      valueA = a.nome.toLowerCase();
      valueB = b.nome.toLowerCase();
    } else if (sortBy === "nivelAcesso") {
      valueA = a.nivelAcesso.toLowerCase();
      valueB = b.nivelAcesso.toLowerCase();
    } else if (sortBy === "dataCadastro") {
      valueA = new Date(a.dataCadastro);
      valueB = new Date(b.dataCadastro);
    } else if (sortBy === "status") {
      valueA = a.status.toLowerCase();
      valueB = b.status.toLowerCase();
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

  const exportToCSV = () => {
    const headers = [
      "Nome",
      "E-mail",
      "Telefone",
      "CPF",
      "Data de Nascimento",
      "Endereço",
      "Usuário",
      "Nível de Acesso",
      "Status",
      "Data de Cadastro",
    ];
    const csvData = [
      headers.join(","),
      ...sortedFuncionarios.map((func) =>
        [
          `"${func.nome}"`,
          `"${func.email}"`,
          `"${func.telefone}"`,
          `"${func.cpf}"`,
          `"${new Date(func.dataNascimento).toLocaleDateString("pt-BR")}"`,
          `"${func.endereco}"`,
          `"${func.usuario}"`,
          `"${func.nivelAcesso}"`,
          `"${func.status === "ativo" ? "Ativo" : "Inativo"}"`,
          `"${new Date(func.dataCadastro).toLocaleDateString("pt-BR")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio_funcionarios_${new Date().toISOString().split("T")[0]}.csv`
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

  // Função para gerar cor baseada no nome
  const getAvatarColor = (nome) => {
    const colors = [
      "#3498db",
      "#2ecc71",
      "#e74c3c",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
      "#d35400",
      "#c0392b",
      "#16a085",
      "#27ae60",
    ];
    const index = nome.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando relatório de funcionários...</p>
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
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </a>
                <a
                  href="/farmacias/relatorios/vendas"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Vendas</span>
                </a>
                <a
                  href="/farmacias/relatorios/estoque"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Estoque</span>
                </a>
                <a
                  href="/farmacias/relatorios/funcionarios"
                  className={`${styles.navLink} ${styles.active}`}
                >
                  <span className={styles.navText}>Relatório de Funcionários</span>
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

            {/* Informações do relatório */}
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
              
              <div className={styles.exportButtons}>
                <button
                  className={styles.csvButton}
                  onClick={exportToCSV}
                  title="Exportar para CSV"
                >
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
              {/* Tabela de Funcionários */}
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

              {/* Resumo do relatório */}
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

            {filteredFuncionarios.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <h3>Nenhum funcionário encontrado</h3>
                <p>Nenhum funcionário corresponde aos filtros selecionados.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}