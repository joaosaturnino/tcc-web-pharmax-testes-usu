"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Reutilizando o estilo, ajuste se necessário
import AuthGuard from "../../../componentes/AuthGuard";
import api from "../../../services/api";

export default function RelatorioFavoritosPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 ano atrás
    end: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const reportRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFavoritos = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. AUTENTICAÇÃO: Busca o ID da farmácia logada
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          throw new Error("Usuário não autenticado. Faça o login novamente.");
        }
        const userData = JSON.parse(userDataString);
        const idDaFarmacia = userData.farm_id; // Usando a chave 'farm_id' conforme o seu código

        if (!idDaFarmacia) {
          throw new Error("Não foi possível identificar sua farmácia. Faça o login novamente.");
        }
        
        // 2. VALIDAÇÃO: Chama a rota correta usando o ID da farmácia
        const response = await api.get(`/favoritos/${idDaFarmacia}/favoritos`);
        
        if (response.data.sucesso) {
          const processedData = response.data.dados.map(med => ({
            id: med.med_id,
            nome: med.med_nome,
            fabricante: med.fabricante_nome,
            dosagem: med.med_dosagem,
            favoritacoes: med.favoritacoes_count,
            dataFavorito: med.med_data_atualizacao, // Usando data_atualizacao como referência
          }));
          setMedicamentos(processedData);
        } else {
          throw new Error(response.data.mensagem);
        }
      } catch (err) {
        console.error("Falha na chamada à API de favoritos:", err);
        setError(err.response?.data?.mensagem || err.message || "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, []);

  const filteredMedicamentos = medicamentos.filter((med) => {
    const dataFavorito = new Date(med.dataFavorito);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return dataFavorito >= startDate && dataFavorito <= endDate;
  });
  
  const sortedMedicamentos = [...filteredMedicamentos].sort((a, b) => b.favoritacoes - a.favoritacoes);

  const generateReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      window.print();
      setReportGenerated(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <span>Carregando relatório...</span>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className={styles.title}>Relatório de Medicamentos Favoritos</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.reportButton} onClick={generateReport}>Gerar Relatório</button>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            {/* ... Seu menu sidebar aqui, igual ao outro arquivo ... */}
             <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Favoritos</span></Link>
                <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link>
              </div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
          </aside>
          {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

          <main className={styles.mainContent}>
            {error && (<div className={styles.errorMessage}><span>{error}</span></div>)}
            {!reportGenerated && (
              <div className={styles.controls}>
                <div className={styles.filters}>
                  <div className={styles.filterGroup}>
                    <label>Período de Referência:</label>
                    <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                    <span>até</span>
                    <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                  </div>
                </div>
              </div>
            )}
            <div ref={reportRef} className={`${styles.reportContainer} ${reportGenerated ? styles.reportMode : ""}`}>
              <div className={styles.reportHeader}>
                <img src="../../../../../temp/LogoEscrita.png" alt="Logo PharmaX" className={styles.printLogo}/>
                <div className={styles.reportTitle}><h1>Relatório de Medicamentos Mais Favoritados</h1><p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p><p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p></div>
              </div>
              <table className={styles.reportTable}>
                <thead><tr><th>Ranking</th><th>Medicamento</th><th>Dosagem</th><th>Fabricante</th><th>Nº de Favoritações</th></tr></thead>
                <tbody>
                  {sortedMedicamentos.length > 0 ? (
                    sortedMedicamentos.map((med, index) => (
                      <tr key={med.id}>
                        <td><strong>{index + 1}º</strong></td>
                        <td className={styles.medName}>{med.nome}</td>
                        <td>{med.dosagem}</td>
                        <td>{med.fabricante}</td>
                        <td>{med.favoritacoes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5">Nenhum medicamento favoritado encontrado para o período.</td></tr>
                  )}
                </tbody>
              </table>
              <div className={styles.reportSummary}>
                <h2>Resumo do Relatório</h2>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}><span className={styles.summaryLabel}>Total de Itens</span><span className={styles.summaryValue}>{sortedMedicamentos.length}</span></div>
                  <div className={styles.summaryItem}><span className={styles.summaryLabel}>Total de Favoritações</span><span className={styles.summaryValue}>{sortedMedicamentos.reduce((acc, med) => acc + med.favoritacoes, 0)}</span></div>
                </div>
              </div>
              <div className={styles.reportFooter}><p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p><p>PharmaX - Sistema de Gestão Farmacêutica</p></div>
            </div>
            {sortedMedicamentos.length === 0 && !loading && !error && (
              <div className={styles.emptyState}><h3>Nenhum dado encontrado</h3><p>Nenhum medicamento foi favoritado no período selecionado.</p></div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}