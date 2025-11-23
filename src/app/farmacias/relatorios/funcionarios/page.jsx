"use client"; // Define que é um componente executado no navegador (Next.js)

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // CORREÇÃO: Importado para navegação SPA
import styles from "./page.module.css";
import api from "../../../services/api";

// Mapa para converter o nível numérico do banco para texto legível
const nivelAcessoMap = {
  1: "Funcionário",
  2: "Farmacêutico",
  3: "Administrador",
  4: "Gerente", // Exemplo, ajuste conforme seu sistema
  5: "Supervisor" // Exemplo, ajuste conforme seu sistema
};

export default function RelatorioFuncionariosPage() {
  // === Estados de Dados ===
  const [funcionarios, setFuncionarios] = useState([]); // Lista bruta da API
  const [loading, setLoading] = useState(true);
  
  // === Estados de Interface ===
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false); // Controla modo de visualização para impressão
  
  // === Estados de Paginação e Filtros ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({
    // Padrão: Últimos 30 dias
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [nivelAcessoFilter, setNivelAcessoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // === Estados de Ordenação ===
  const [sortBy, setSortBy] = useState("dataCadastro");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' ou 'desc'
  
  const [error, setError] = useState("");
  const reportRef = useRef(null);
  const router = useRouter();

  // === Busca Inicial de Dados ===
  useEffect(() => {
    const listarFuncionarios = async () => {
      setLoading(true);
      setError("");
      try {
        // Verificação de Autenticação
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("Usuário não autenticado.");

        const userData = JSON.parse(userDataString);
        setFarmaciaInfo(userData);

        const idDaFarmacia = userData.farm_id;
        if (!idDaFarmacia) throw new Error("ID da farmácia não encontrado.");

        // Chamada API
        const response = await api.get(`/funcionario?farmacia_id=${idDaFarmacia}`);

        if (response.data.sucesso) {
          // Mapeamento dos dados para facilitar o uso no frontend
          const funcionariosFormatados = response.data.dados.map(func => ({
            id: func.func_id,
            nome: func.func_nome,
            email: func.func_email,
            telefone: func.func_telefone,
            cpf: func.func_cpf,
            usuario: func.func_usuario,
            nivelAcesso: nivelAcessoMap[func.func_nivel] || "Indefinido", // MELHORIA: Mapeia o nível de acesso
            status: func.func_ativo ? "ativo" : "inativo",
            dataCadastro: func.func_dtcad ? new Date(func.func_dtcad).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          setFuncionarios(funcionariosFormatados);
        } else {
          throw new Error(response.data.mensagem);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        setError(error.message || "Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };
    listarFuncionarios();
  }, []);

  // === Lógica de Filtragem e Ordenação (useMemo) ===
  // MELHORIA: useMemo garante que isso só rode quando os filtros ou dados mudarem, melhorando performance
  const sortedFuncionarios = useMemo(() => {
    // 1. Filtragem
    const filtered = funcionarios.filter((func) => {
      const dataCadastro = new Date(func.dataCadastro);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      // Verifica intervalo de datas
      const matchDate = dataCadastro >= startDate && dataCadastro <= endDate;
      // Verifica filtros de dropdown
      const matchNivel = nivelAcessoFilter === "todos" || func.nivelAcesso === nivelAcessoFilter;
      const matchStatus = statusFilter === "todos" || func.status === statusFilter;
      
      return matchDate && matchNivel && matchStatus;
    });

    // 2. Ordenação
    return [...filtered].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      // Tratamento especial para datas
      if (sortBy === "dataCadastro") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [funcionarios, dateRange, nivelAcessoFilter, statusFilter, sortBy, sortOrder]);

  // === Cálculos de Paginação ===
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFuncionarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedFuncionarios.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // === Manipulador de Impressão ===
  const generateReport = () => {
    // Ativa modo de relatório (esconde filtros/paginação)
    setReportGenerated(true);
    // Aguarda renderização para chamar janela de impressão
    setTimeout(() => {
      window.print();
      setReportGenerated(false); // Retorna ao modo normal
    }, 500);
  };

  // === Manipulador de Ordenação ===
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Inverte ordem
    } else {
      setSortBy(column);
      setSortOrder("asc"); // Nova coluna começa ascendente
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
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
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
          <h1 className={styles.title}>Relatório de Funcionários</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.reportButton} onClick={generateReport} title="Gerar relatório para impressão">Gerar Relatório</button>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (<img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />)}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
          </div>
          {/* CORREÇÃO: Trocados <a> por <Link> para navegação mais rápida */}
          <nav className={styles.nav}>
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          {error && (<div className={styles.errorMessage}><span>{error}</span></div>)}
          
          {/* Filtros só aparecem se NÃO estiver gerando relatório */}
          {!reportGenerated && (
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}><label>Período:</label><input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /><span>até</span><input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                <div className={styles.filterGroup}><label>Nível:</label><select value={nivelAcessoFilter} onChange={(e) => setNivelAcessoFilter(e.target.value)}>{Object.values(nivelAcessoMap).map(nivel => <option key={nivel} value={nivel}>{nivel}</option>)}<option value="todos">Todos</option></select></div>
                <div className={styles.filterGroup}><label>Status:</label><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="todos">Todos</option><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div>
              </div>
            </div>
          )}
          
          {/* Container do Relatório (Este é o elemento principal na impressão) */}
          <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>
            {/* Cabeçalho do relatório (Logos e Datas) */}
            <div className={styles.reportHeader}>
              <img src={farmaciaInfo?.farm_logo_url || "../../../../../temp/LogoEscrita.png"} alt="Logo" className={styles.printLogo} />
              <div className={styles.reportTitle}><h1>Relatório de Funcionários</h1><p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p><p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p></div>
            </div>
            
            {/* Tabela de Dados */}
            <div className={styles.tableWrapper}>
              <table className={styles.reportTable}>
                <thead><tr><th className={styles.sortableHeader} onClick={() => handleSort("nome")}>Nome {getSortIcon("nome")}</th><th>E-mail</th><th>Telefone</th><th>CPF</th><th className={styles.sortableHeader} onClick={() => handleSort("nivelAcesso")}>Nível {getSortIcon("nivelAcesso")}</th><th className={styles.sortableHeader} onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th><th className={styles.sortableHeader} onClick={() => handleSort("dataCadastro")}>Cadastro {getSortIcon("dataCadastro")}</th></tr></thead>
                <tbody>
                  {/* Se estiver imprimindo, mostra TUDO (sortedFuncionarios). Se na tela, mostra PAGINADO (currentItems) */}
                  {(reportGenerated ? sortedFuncionarios : currentItems).length > 0 ? (
                    (reportGenerated ? sortedFuncionarios : currentItems).map((funcionario) => (
                      <tr key={funcionario.id}><td className={styles.medName}>{funcionario.nome}</td><td>{funcionario.email}</td><td>{funcionario.telefone}</td><td>{funcionario.cpf}</td><td><span className={`${styles.statusBadge} ${styles[(funcionario.nivelAcesso || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")]}`}>{funcionario.nivelAcesso}</span></td><td><span className={`${styles.statusBadge} ${styles[funcionario.status]}`}>{funcionario.status === "ativo" ? "Ativo" : "Inativo"}</span></td><td>{new Date(funcionario.dataCadastro).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</td></tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className={styles.emptyState}>Nenhum funcionário encontrado para os filtros selecionados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Resumo de totais */}
            <div className={styles.reportSummary}><h2>Resumo do Relatório</h2><div className={styles.summaryGrid}><div className={styles.summaryItem}><span className={styles.summaryLabel}>Total</span><span className={styles.summaryValue}>{sortedFuncionarios.length}</span></div><div className={styles.summaryItem}><span className={styles.summaryLabel}>Ativos</span><span className={styles.summaryValue}>{sortedFuncionarios.filter(f => f.status === "ativo").length}</span></div><div className={styles.summaryItem}><span className={styles.summaryLabel}>Inativos</span><span className={styles.summaryValue}>{sortedFuncionarios.filter(f => f.status === "inativo").length}</span></div><div className={styles.summaryItem}><span className={styles.summaryLabel}>Admins.</span><span className={styles.summaryValue}>{sortedFuncionarios.filter(f => f.nivelAcesso === "Administrador").length}</span></div></div></div>
            <div className={styles.reportFooter}><p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p><p>{farmaciaInfo?.farm_nome} - Sistema PharmaX</p></div>
          </div>
          
          {/* Controles de paginação (escondidos se estiver gerando relatório) */}
          {!reportGenerated && totalPages > 1 && (
            <div className={styles.paginationControls}><button className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ""}`} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>←</button><div className={styles.paginationNumbers}><span>Página {currentPage} de {totalPages}</span></div><button className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ""}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>→</button></div>
          )}
        </main>
      </div>
    </div>
  );
}