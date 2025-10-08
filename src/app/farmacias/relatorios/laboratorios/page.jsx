"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import api from "../../../services/api";

export default function RelatorioLaboratoriosPage() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "2023-01-01",
    end: new Date().toISOString().split("T")[0],
  });
  const [sortBy, setSortBy] = useState("nome");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const reportRef = useRef(null);
  const router = useRouter();

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
      const response = await api.get('/laboratorios');
      
      if (response.data.sucesso === true) {
        const labsApi = response.data.dados;
        const labsFormatados = labsApi.map(lab => ({
          id: lab.lab_id,
          nome: lab.lab_nome,
          endereco: lab.lab_endereco,
          telefone: lab.lab_telefone,
          email: lab.lab_email,
          medicamentosCadastrados: Math.floor(Math.random() * 100) + 1,
          dataCadastro: lab.lab_data_cadastro,
          cnpj: lab.lab_cnpj,
          logo: lab.lab_logo
        }));
        setLaboratorios(labsFormatados);
      } else {
        alert('Erro ao carregar da API: ' + response.data.mensagem);
        carregarDadosMock();
      }
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      alert('Falha na API, carregando dados de exemplo para demonstração.');
      carregarDadosMock();
    } finally {
      setLoading(false);
    }
  }

  const carregarDadosMock = () => {
    const mockLabs = [
        { id: "l1", nome: "LabVida", endereco: "Rua A, 123 - Centro, São Paulo/SP", telefone: "(11) 9999-9999", email: "contato@labvida.com", status: "ativo", medicamentosCadastrados: 42, dataCadastro: "2023-01-15", cnpj: "12.345.678/0001-90", },
        { id: "l2", nome: "BioQuímica", endereco: "Av. Brasil, 456 - Bela Vista, Rio de Janeiro/RJ", telefone: "(21) 98888-8888", email: "bioquimica@laboratorio.com", status: "inativo", medicamentosCadastrados: 15, dataCadastro: "2023-03-22", cnpj: "98.765.432/0001-12", },
    ];
    setLaboratorios(mockLabs);
    setLoading(false);
  };

  const sortedLaboratorios = useMemo(() => {
    const filtered = laboratorios.filter((lab) => {
      const labDate = new Date(lab.dataCadastro);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const dateInRange = labDate >= startDate && labDate <= endDate;
      
      // ATUALIZADO: removida a pesquisa por CNPJ
      const searchMatch =
        lab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.email.toLowerCase().includes(searchTerm.toLowerCase());

      return dateInRange && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      let valueA, valueB;
      if (sortBy === "nome" || sortBy === "email") { 
        valueA = a[sortBy].toLowerCase(); 
        valueB = b[sortBy].toLowerCase(); 
      } else { 
        valueA = a[sortBy]; 
        valueB = b[sortBy]; 
      }
      
      if (typeof valueA === "string") {
        return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
    });
  }, [laboratorios, dateRange, searchTerm, sortBy, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLaboratorios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLaboratorios.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateReport = () => {
    setReportGenerated(true);
    setTimeout(() => { window.print(); setReportGenerated(false); }, 500);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  const getSortIcon = (column) => (sortBy !== column) ? "⇅" : (sortOrder === "asc" ? "↑" : "↓");

  const totalLaboratorios = sortedLaboratorios.length;
  const totalMedicamentos = sortedLaboratorios.reduce((total, lab) => total + lab.medicamentosCadastrados, 0);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  if (loading) {
    return (<div className={styles.loaderContainer}><div className={styles.spinner}></div><span>Carregando...</span></div>);
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
          {!reportGenerated && (
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}><label>Período:</label><input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}/><input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                <div className={styles.filterGroup}>
                  <label>Pesquisar:</label>
                  {/* ATUALIZADO: placeholder do input de pesquisa */}
                  <input type="text" placeholder="Nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
          )}
          <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>
            <div className={styles.reportHeader}>
              <img src={farmaciaInfo?.farm_logo_url || "../../../../../temp/LogoEscrita.png"} alt="Logo" className={styles.printLogo}/>
              <div className={styles.reportTitle}><h1>Relatório de Laboratórios</h1><p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p><p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p></div>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th className={styles.sortableHeader} onClick={() => handleSort("nome")}>Nome {getSortIcon("nome")}</th>
                      {/* REMOVIDO: Cabeçalho da coluna de CNPJ */}
                      <th>Endereço</th>
                      <th>Telefone</th>
                      <th className={styles.sortableHeader} onClick={() => handleSort("email")}>Email {getSortIcon("email")}</th>
                      <th className={styles.sortableHeader} onClick={() => handleSort("medicamentosCadastrados")}>Medicamentos {getSortIcon("medicamentosCadastrados")}</th>
                    </tr>
                  </thead>
                  <tbody>
                      {itemsToRender.length > 0 ? (
                      itemsToRender.map((lab) => (
                          <tr key={lab.id}>
                            <td className={styles.medName}>{lab.nome}</td>
                            {/* REMOVIDO: Célula que exibia o CNPJ */}
                            <td>{lab.endereco}</td>
                            <td>{lab.telefone}</td>
                            <td>{lab.email}</td>
                            <td>{lab.medicamentosCadastrados}</td>
                          </tr>
                      ))
                      ) : (
                      // ATUALIZADO: colSpan de 6 para 5
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
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total de Medicamentos</span>
                  <span className={styles.summaryValue}>{totalMedicamentos}</span>
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