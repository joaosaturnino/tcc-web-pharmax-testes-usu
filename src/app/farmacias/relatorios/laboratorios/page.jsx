"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import styles from "./page.module.css";
import api from "../../../services/api";

export default function RelatorioLaboratoriosPage() {
  // === Estados de Dados ===
  const [laboratorios, setLaboratorios] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // === Estados de Interface ===
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false); 

  // === Estados de Paginação ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  // === ALTERAÇÃO PRINCIPAL AQUI ===
  // Definimos a data inicial para o ano 2000 para garantir que traga TODOS os registros do banco,
  // independentemente de quando foram cadastrados.
  const [dateRange, setDateRange] = useState({
    start: "2000-01-01", 
    end: new Date().toISOString().split("T")[0],
  });

  // === Estados de Ordenação e Busca ===
  const [sortBy, setSortBy] = useState("nome"); 
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [searchTerm, setSearchTerm] = useState(""); 

  const [error, setError] = useState("");
  const reportRef = useRef(null); 
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
      
      // Chama a rota que faz "SELECT * FROM laboratorios"
      const response = await api.get('/todoslab');

      if (response.data.sucesso === true) {
        const labsApi = response.data.dados;
        
        const labsFormatados = labsApi.map(lab => ({
          id: lab.lab_id,
          nome: lab.lab_nome,
          endereco: lab.lab_endereco,
          telefone: lab.lab_telefone,
          email: lab.lab_email,
          // Se o banco não tiver data de cadastro, usamos a data atual para não quebrar o filtro
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

  // === Lógica de Filtro e Ordenação ===
  const sortedLaboratorios = useMemo(() => {
    const filtered = laboratorios.filter((lab) => {
      const labDate = new Date(lab.dataCadastro);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); 

      const dateInRange = labDate >= startDate && labDate <= endDate;

      const searchMatch =
        lab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.email.toLowerCase().includes(searchTerm.toLowerCase());

      return dateInRange && searchMatch;
    });

    return [...filtered].sort((a, b) => {
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
  }, [laboratorios, dateRange, searchTerm, sortBy, sortOrder]);

  // === Cálculos de Paginação ===
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLaboratorios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLaboratorios.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // === Manipulador de Impressão ===
  const generateReport = () => {
    setReportGenerated(true); 
    setTimeout(() => { 
        window.print(); 
        setReportGenerated(false); 
    }, 500);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc")); 
    } else {
      setSortBy(column);
      setSortOrder("asc"); 
    }
  };

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
          
          {!reportGenerated && (
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Período:</label>
                  {/* Inputs de data conectados ao estado dateRange */}
                  <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                  <span>até</span>
                  <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                </div>
                <div className={styles.filterGroup}>
                  <label>Pesquisar:</label>
                  <input type="text" placeholder="Nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>
            <div className={styles.reportHeader}>
              <img src={farmaciaInfo?.farm_logo_url || "../../../../../temp/LogoEscrita.png"} alt="Logo" className={styles.printLogo} />
              <div className={styles.reportTitle}>
                <h1>Relatório de Laboratórios</h1>
                <p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p>
                <p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.reportTable}>
                <thead>
                  <tr>
                    <th className={styles.sortableHeader} onClick={() => handleSort("nome")}>Nome {getSortIcon("nome")}</th>
                    <th>Endereço</th>
                    <th>Telefone</th>
                    <th className={styles.sortableHeader} onClick={() => handleSort("email")}>Email {getSortIcon("email")}</th>
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
                        <td>{new Date(lab.dataCadastro).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className={styles.emptyState}>Nenhum laboratório encontrado para os filtros selecionados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className={styles.reportSummary}>
              <h2>Resumo do Relatório</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total de Laboratórios</span>
                  <span className={styles.summaryValue}>{totalLaboratorios}</span>
                </div>
              </div>
            </div>
            <div className={styles.reportFooter}><p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p><p>{farmaciaInfo?.farm_nome} - Sistema PharmaX</p></div>
          </div>
          
          {!reportGenerated && totalPages > 1 && (
            <div className={styles.paginationControls}><button className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ""}`} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>←</button><div className={styles.paginationNumbers}><span>Página {currentPage} de {totalPages}</span></div><button className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ""}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>→</button></div>
          )}
        </main>
      </div>
    </div>
  );
}