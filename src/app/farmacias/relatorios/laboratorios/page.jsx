"use client"; // Define que é um componente executado no navegador (Next.js)

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Importado para navegação SPA
import styles from "./page.module.css";
import api from "../../../services/api";

export default function RelatorioLaboratoriosPage() {
  // === Estados de Dados ===
  const [laboratorios, setLaboratorios] = useState([]); // Lista bruta da API
  const [loading, setLoading] = useState(true);
  
  // === Estados de Interface ===
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false); // Controla se a view é de impressão ou normal

  // === Estados de Paginação e Filtros ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Quantidade fixa de itens por página

  // MELHORIA: Filtro de data agora inicia com 30 dias (igual a page.jsx)
  const [dateRange, setDateRange] = useState({
    // Data de início = Hoje - 30 dias
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    // Data de fim = Hoje
    end: new Date().toISOString().split("T")[0],
  });

  // === Estados de Ordenação e Busca ===
  const [sortBy, setSortBy] = useState("nome"); // Coluna padrão para ordenar
  const [sortOrder, setSortOrder] = useState("asc"); // Ordem padrão (Crescente)
  const [searchTerm, setSearchTerm] = useState(""); // Texto do campo de busca

  const [error, setError] = useState("");
  const reportRef = useRef(null); // Referência ao elemento do relatório (para impressão)
  const router = useRouter();

  // === Busca Inicial de Dados ===
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }
    listarLaboratorios();
  }, []);

  async function listarLaboratorios() {
    try {
      setLoading(true);
      setError("");
      const response = await api.get('/todoslab');

      if (response.data.sucesso === true) {
        const labsApi = response.data.dados;
        // Formata os dados para facilitar o uso no frontend
        const labsFormatados = labsApi.map(lab => ({
          id: lab.lab_id,
          nome: lab.lab_nome,
          endereco: lab.lab_endereco,
          telefone: lab.lab_telefone,
          email: lab.lab_email,
          // Garante data válida ou usa data atual como fallback
          dataCadastro: lab.lab_data_cadastro ? new Date(lab.lab_data_cadastro).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          cnpj: lab.lab_cnpj,
          logo: lab.lab_logo
        }));
        setLaboratorios(labsFormatados);
      } else {
        setError('Erro ao carregar da API: ' + response.data.mensagem);
      }
    } catch (err) {
      console.error('Erro ao carregar laboratórios:', err);
      setError('Falha na comunicação com a API. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // MELHORIA: Lógica de filtro e ordenação centralizada com useMemo
  // useMemo garante que isso só rode quando os filtros ou dados mudarem, otimizando performance
  const sortedLaboratorios = useMemo(() => {
    // 1. Filtragem
    const filtered = laboratorios.filter((lab) => {

      // Lógica de data ajustada (igual a page.jsx)
      const labDate = new Date(lab.dataCadastro);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Garante que o dia final seja incluído na busca

      const dateInRange = labDate >= startDate && labDate <= endDate;

      // Busca textual por nome OU email
      const searchMatch =
        lab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.email.toLowerCase().includes(searchTerm.toLowerCase());

      return dateInRange && searchMatch;
    });

    // 2. Ordenação
    return [...filtered].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      // Tratamento especial para datas na ordenação
      if (sortBy === "dataCadastro") {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [laboratorios, dateRange, searchTerm, sortBy, sortOrder]);

  // === Cálculos de Paginação ===
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLaboratorios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLaboratorios.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // === Manipulador de Impressão ===
  const generateReport = () => {
    setReportGenerated(true); // Ativa layout de impressão (mostra tudo, esconde filtros)
    setTimeout(() => { 
        window.print(); 
        setReportGenerated(false); // Volta ao normal após abrir a janela de print
    }, 500);
  };

  // === Manipulador de Ordenação ===
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc")); // Inverte ordem se clicar na mesma coluna
    } else {
      setSortBy(column);
      setSortOrder("asc"); // Nova coluna começa ascendente
    }
  };

  // Helper para ícone de ordenação (Seta ou Símbolo neutro)
  const getSortIcon = (column) => (sortBy !== column) ? "⇅" : (sortOrder === "asc" ? "↑" : "↓");

  const totalLaboratorios = sortedLaboratorios.length;

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  if (loading) {
    return (<div className={styles.loaderContainer}><div className={styles.spinner}></div><span>Carregando laboratórios...</span></div>);
  }

  // Decide o que renderizar na tabela: Lista completa (se imprimindo) ou Paginada (se na tela)
  const itemsToRender = reportGenerated ? sortedLaboratorios : currentItems;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
          <h1 className={styles.title}>Relatório de Laboratórios</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.reportButton} onClick={generateReport} title="Gerar relatório para impressão">Gerar Relatório</button>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        {/* MELHORIA: Sidebar integrada (igual a page.jsx) */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (<img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />)}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
          </div>
          <nav className={styles.nav}>
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        <main className={styles.mainContent}>
          {error && <div className={styles.errorMessage}><span>{error}</span></div>}
          
          {/* Filtros só aparecem se NÃO estiver gerando relatório */}
          {!reportGenerated && (
            <div className={styles.controls}>
              <div className={styles.filters}>
                {/* MELHORIA: Layout do filtro de data (igual a page.jsx) */}
                <div className={styles.filterGroup}><label>Período:</label><input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} /><span>até</span><input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                <div className={styles.filterGroup}>
                  <label>Pesquisar:</label>
                  <input type="text" placeholder="Nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
          )}
          
          {/* Container do Relatório (Elemento principal na impressão) */}
          <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>
            <div className={styles.reportHeader}>
              {/* Logo: Tenta usar a da farmácia, senão usa um fallback */}
              <img src={farmaciaInfo?.farm_logo_url || "../../../../../temp/LogoEscrita.png"} alt="Logo" className={styles.printLogo} />
              <div className={styles.reportTitle}>
                <h1>Relatório de Laboratórios</h1>
                {/* MELHORIA: Período sempre visível (igual a page.jsx) */}
                <p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p>
                <p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.reportTable}>
                <thead>
                  <tr>
                    {/* Cabeçalhos ordenáveis com clique */}
                    <th className={styles.sortableHeader} onClick={() => handleSort("nome")}>Nome {getSortIcon("nome")}</th>
                    <th>Endereço</th>
                    <th>Telefone</th>
                    <th className={styles.sortableHeader} onClick={() => handleSort("email")}>Email {getSortIcon("email")}</th>
                    {/* MELHORIA: Coluna de Data de Cadastro (igual a page.jsx) */}
                    <th className={styles.sortableHeader} onClick={() => handleSort("dataCadastro")}>Cadastro {getSortIcon("dataCadastro")}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToRender.length > 0 ? (
                    itemsToRender.map((lab) => (
                      <tr key={lab.id}>
                        <td className={styles.medName}>{lab.nome}</td>
                        <td>{lab.endereco}</td>
                        <td>{lab.telefone}</td>
                        <td>{lab.email}</td>
                        {/* MELHORIA: Coluna de Data de Cadastro formatada */}
                        <td>{new Date(lab.dataCadastro).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className={styles.emptyState}>Nenhum laboratório encontrado para os filtros selecionados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Resumo Estatístico */}
            <div className={styles.reportSummary}>
              <h2>Resumo do Relatório</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total de Laboratórios</span>
                  <span className={styles.summaryValue}>{totalLaboratorios}</span>
                </div>
                {/* Nota: Não é possível adicionar mais resumos (ex: Ativos) pois a API de labs não fornece esses dados */}
              </div>
            </div>
            <div className={styles.reportFooter}><p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p><p>{farmaciaInfo?.farm_nome} - Sistema PharmaX</p></div>
          </div>
          
          {/* Paginação (oculta na impressão) */}
          {!reportGenerated && totalPages > 1 && (
            <div className={styles.paginationControls}><button className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ""}`} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>←</button><div className={styles.paginationNumbers}><span>Página {currentPage} de {totalPages}</span></div><button className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ""}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>→</button></div>
          )}
        </main>
      </div>
    </div>
  );
}