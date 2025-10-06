"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import api from "../../../services/api";

export default function RelatorioLaboratoriosPage() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ADICIONADO: Estado para armazenar os dados da farmácia
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "2023-01-01",
    end: new Date().toISOString().split("T")[0],
  });
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("nome");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const reportRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // ADICIONADO: Carrega informações da farmácia do localStorage
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
          status: lab.lab_ativo ? "ativo" : "inativo",
          medicamentosCadastrados: Math.floor(Math.random() * 100) + 1,
          dataCadastro: lab.lab_data_cadastro,
          cnpj: lab.lab_cnpj,
          logo: lab.lab_logo
        }));
        setLaboratorios(labsFormatados);
      } else {
        alert('Erro: ' + response.data.mensagem);
        carregarDadosMock();
      }
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      if (error.response) {
        alert('Erro: ' + error.response.data.mensagem + '\n' + error.response.data.dados);
      } else {
        alert('Erro no front-end: ' + error.message);
      }
      carregarDadosMock();
    } finally {
      setLoading(false);
    }
  }

  const carregarDadosMock = () => {
    const mockLabs = [
      { id: "l1", nome: "LabVida", endereco: "Rua A, 123 - Centro, São Paulo/SP", telefone: "(11) 9999-9999", email: "contato@labvida.com", status: "ativo", medicamentosCadastrados: 42, dataCadastro: "2023-01-15", cnpj: "12.345.678/0001-90", },
      { id: "l2", nome: "BioQuímica", endereco: "Av. Brasil, 456 - Bela Vista, Rio de Janeiro/RJ", telefone: "(21) 98888-8888", email: "bioquimica@laboratorio.com", status: "inativo", medicamentosCadastrados: 15, dataCadastro: "2023-03-22", cnpj: "98.765.432/0001-12", },
      { id: "l3", nome: "Farmalab", endereco: "Rua das Flores, 789 - Centro, Belo Horizonte/MG", telefone: "(31) 97777-7777", email: "farmalab@lab.com", status: "ativo", medicamentosCadastrados: 28, dataCadastro: "2023-05-10", cnpj: "11.222.333/0001-44", },
      { id: "l4", nome: "LabMais", endereco: "Av. Paulista, 1000 - São Paulo/SP", telefone: "(11) 91234-5678", email: "contato@labmais.com", status: "ativo", medicamentosCadastrados: 60, dataCadastro: "2023-07-01", cnpj: "22.333.444/0001-55", },
    ];
    setLaboratorios(mockLabs);
    setLoading(false);
  };

  const filteredLaboratorios = laboratorios.filter((lab) => {
    const labDate = new Date(lab.dataCadastro);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    const dateInRange = labDate >= startDate && labDate <= endDate;
    const statusMatch = statusFilter === "todos" || lab.status === statusFilter;
    const searchMatch =
      lab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.cnpj.includes(searchTerm);

    return dateInRange && statusMatch && searchMatch;
  });

  const sortedLaboratorios = [...filteredLaboratorios].sort((a, b) => {
    let valueA, valueB;
    if (sortBy === "nome") { valueA = a.nome.toLowerCase(); valueB = b.nome.toLowerCase(); } 
    else if (sortBy === "email") { valueA = a.email.toLowerCase(); valueB = b.email.toLowerCase(); } 
    else if (sortBy === "dataCadastro") { valueA = new Date(a.dataCadastro); valueB = new Date(b.dataCadastro); } 
    else if (sortBy === "medicamentosCadastrados") { valueA = a.medicamentosCadastrados; valueB = b.medicamentosCadastrados; } 
    else { valueA = a[sortBy]; valueB = b[sortBy]; }
    
    if (typeof valueA === "string") {
      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

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

  const getSortIcon = (column) => {
    if (sortBy !== column) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const totalLaboratorios = filteredLaboratorios.length;
  const laboratoriosAtivos = filteredLaboratorios.filter((lab) => lab.status === "ativo").length;
  const laboratoriosInativos = filteredLaboratorios.filter((lab) => lab.status === "inativo").length;
  const totalMedicamentos = filteredLaboratorios.reduce((total, lab) => total + lab.medicamentosCadastrados, 0);

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
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className={styles.title}>Relatório de Laboratórios</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.reportButton} onClick={generateReport} title="Gerar relatório para impressão">Gerar Relatório</button>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        {/* INÍCIO DA MODIFICAÇÃO DO SIDEBAR */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              {farmaciaInfo ? (
                <div className={styles.logoContainer}>
                  {farmaciaInfo.farm_logo_url && (
                    <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />
                  )}
                  <span className={styles.logoText}>{farmaciaInfo.farm_nome}</span>
                </div>
              ) : (
                <span className={styles.logoText}>PharmaX</span>
              )}
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          {/* FIM DA MODIFICAÇÃO DO SIDEBAR HEADER */}
          <nav className={styles.nav}>
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><a href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></a><a href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></a></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><a href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></a><a href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></a></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><a href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></a><a href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></a><a href="/farmacias/relatorios/laboratorios" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Relatório de Laboratorios</span></a></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><a href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></a><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          {!reportGenerated && (
            <>
              <div className={styles.reportInfo}><p>Mostrando {currentItems.length} de {filteredLaboratorios.length} laboratórios</p></div>
              <div className={styles.controls}>
                <div className={styles.filters}>
                  <div className={styles.filterGroup}><label>Período:</label><input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}/><input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} /></div>
                  <div className={styles.filterGroup}><label>Status:</label><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="todos">Todos</option><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div>
                  <div className={styles.filterGroup}><label>Pesquisar:</label><input type="text" placeholder="Nome, email ou CNPJ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                </div>
              </div>
            </>
          )}
          <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>
            <div className={styles.reportHeader}><img src="../../../../../temp/LogoEscrita.png" alt="Logo PharmaX" className={styles.printLogo} /><div className={styles.reportTitle}><h1>Relatório de Laboratórios</h1><p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p><p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p></div></div>
            <table className={styles.reportTable}>
              <thead><tr><th className={styles.sortableHeader} onClick={() => handleSort("nome")}> Nome {getSortIcon("nome")} </th><th>CNPJ</th><th>Endereço</th><th>Telefone</th><th className={styles.sortableHeader} onClick={() => handleSort("email")}> Email {getSortIcon("email")} </th><th className={styles.sortableHeader} onClick={() => handleSort("medicamentosCadastrados")}> Medicamentos {getSortIcon("medicamentosCadastrados")} </th><th>Status</th><th className={styles.sortableHeader} onClick={() => handleSort("dataCadastro")}> Data Cadastro {getSortIcon("dataCadastro")} </th></tr></thead>
              <tbody>
                {itemsToRender.length > 0 ? (
                  itemsToRender.map((lab) => (
                    <tr key={lab.id}><td className={styles.medName}>{lab.nome}</td><td>{lab.cnpj}</td><td>{lab.endereco}</td><td>{lab.telefone}</td><td>{lab.email}</td><td>{lab.medicamentosCadastrados}</td><td><span className={`${styles.statusBadge} ${lab.status === "ativo" ? styles.inStock : styles.outStock}`}>{lab.status === "ativo" ? "Ativo" : "Inativo"}</span></td><td>{new Date(lab.dataCadastro).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</td></tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className={styles.emptyState}><h3>Nenhum laboratório encontrado</h3><p> Nenhum laboratório corresponde aos filtros selecionados. </p></td></tr>
                )}
              </tbody>
            </table>
            <div className={styles.reportSummary}><h2>Resumo do Relatório</h2><div className={styles.summaryGrid}><div className={styles.summaryItem}> <span className={styles.summaryLabel}> Total de Laboratórios </span> <span className={styles.summaryValue}> {totalLaboratorios} </span> </div><div className={styles.summaryItem}> <span className={styles.summaryLabel}> Laboratórios Ativos </span> <span className={styles.summaryValue}> {laboratoriosAtivos} </span> </div><div className={styles.summaryItem}> <span className={styles.summaryLabel}> Laboratórios Inativos </span> <span className={styles.summaryValue}> {laboratoriosInativos} </span> </div><div className={styles.summaryItem}> <span className={styles.summaryLabel}> Total de Medicamentos </span> <span className={styles.summaryValue}> {totalMedicamentos} </span> </div></div></div>
            <div className={styles.reportFooter}><p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p><p>PharmaX - Sistema de Gestão Farmacêutica</p></div>
          </div>
          {!reportGenerated && totalPages > 1 && (
            <div className={styles.paginationControls}><button className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ""}`} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>← Anterior</button><div className={styles.paginationNumbers}>{Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (<button key={number} className={`${styles.paginationNumber} ${currentPage === number ? styles.active : ""}`} onClick={() => paginate(number)}>{number}</button>))}</div><button className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ""}`} onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Próxima →</button></div>
          )}
        </main>
      </div>
    </div>
  );
}