"use client"; // Indica que este é um componente React Client-Side
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AuthGuard from "../../../componentes/AuthGuard";
import api from "../../../services/api";

export default function RelatorioFavoritosPage() {
  // === Estados de Dados e UI ===
  const [medicamentos, setMedicamentos] = useState([]); // Lista de dados da tabela
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Menu mobile
  const [userInfo, setUserInfo] = useState(null); // Dados da farmácia logada

  // === Estado de Filtro de Data ===
  // Inicializa com: Início = 1 ano atrás, Fim = Hoje
  const [dateRange, setDateRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    return {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    };
  });
  
  const [error, setError] = useState("");
  const reportRef = useRef(null); // Referência ao elemento do relatório (opcional com window.print)
  const router = useRouter();

  // === Efeito: Busca de Dados ===
  useEffect(() => {
    const fetchFavoritos = async () => {
      setLoading(true);
      setError("");

      let userData = userInfo;

      try {
        // 1. Verificação de Autenticação (LocalStorage)
        // Garante que userInfo seja carregado antes de fazer a chamada da API
        if (!userData) {
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) {
            throw new Error("Usuário não autenticado. Faça o login novamente.");
          }
          userData = JSON.parse(userDataString);
          setUserInfo(userData);
        }

        const idDaFarmacia = userData?.farm_id;
        if (!idDaFarmacia) {
          throw new Error("Não foi possível identificar sua farmácia. Faça o login novamente.");
        }

        // 2. Chamada à API
        // ✅ MELHORIA: Enviando o filtro de data para a API via query params
        const response = await api.get(`/favoritos/${idDaFarmacia}/favoritos`, {
          params: {
            dataInicio: dateRange.start,
            dataFim: dateRange.end,
          }
        });

        // 3. Processamento da Resposta
        if (response.data.sucesso) {
          // Mapeia os dados brutos para o formato da tabela
          setMedicamentos(response.data.dados.map(med => ({
            id: med.med_id,
            nome: med.med_nome,
            fabricante: med.fabricante_nome,
            dosagem: med.med_dosagem,
            favoritacoes: med.favoritacoes_count, // Contagem do SQL
            dataFavorito: med.med_data_atualizacao,
          })));
        } else {
          setMedicamentos([]); // Limpa os dados em caso de erro da API
          throw new Error(response.data.mensagem || "A API retornou um erro, mas sem detalhes.");
        }
      } catch (err) {
        console.error("Falha na chamada à API de favoritos:", err);
        setError(err.response?.data?.mensagem || err.message || "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
    // ✅ MELHORIA: O useEffect agora depende do dateRange e executa novamente quando ele muda
  }, [dateRange]);

  // === Ordenação (Memoization) ===
  // ✅ MELHORIA: O useMemo ordena os dados por número de favoritadas (decrescente)
  // Isso evita reordenar toda vez que o componente renderiza, apenas quando 'medicamentos' muda
  const sortedMedicamentos = useMemo(() => {
    return [...medicamentos].sort((a, b) => b.favoritacoes - a.favoritacoes);
  }, [medicamentos]);

  // === Função de Impressão ===
  const generateReport = () => {
    // ✅ MELHORIA: Simplificado. O CSS @media print cuida da formatação (oculta sidebar, etc).
    window.print();
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // Renderização de Loading Inicial
  if (loading && !userInfo) {
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
        {/* Cabeçalho com botão de Gerar Relatório */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
            <h1 className={styles.title}>Relatório de Medicamentos Favoritos</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.reportButton} onClick={generateReport}>Gerar Relatório</button>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* Sidebar de Navegação */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logoContainer}>
                {userInfo?.farm_logo_url && <img src={userInfo.farm_logo_url} alt="Logo" className={styles.sidebarAvatar} />}
                <span className={styles.logoText}>{userInfo?.farm_nome || "PharmaX"}</span>
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
                ×
              </button>
            </div>
            <nav className={styles.nav}>
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
          </aside>
          {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

          <main className={styles.mainContent}>
            {error && (<div className={styles.errorMessage}><span>{error}</span></div>)}
            
            {/* Controles de Filtro (Data Início e Fim) */}
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Período de Referência:</label>
                  {/* Ao mudar o input, o estado 'dateRange' atualiza e dispara o useEffect */}
                  <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                  <span>até</span>
                  <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Container do Relatório (Esta é a parte visível na impressão) */}
            {/* ✅ MELHORIA: Removida a classe 'reportMode' desnecessária */}
            <div ref={reportRef} className={styles.reportContainer}>
              {/* Cabeçalho do Relatório (Visível apenas na impressão ou aqui) */}
              <div className={styles.reportHeader}>
                {userInfo?.farm_logo_url && <img src={userInfo.farm_logo_url} alt={`Logo de ${userInfo.farm_nome}`} className={styles.printLogo} />}
                <div className={styles.reportTitle}><h1>Relatório de Medicamentos Mais Favoritados</h1><p>Período: {new Date(dateRange.start).toLocaleDateString("pt-BR", { timeZone: 'UTC' })} a {new Date(dateRange.end).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</p><p>Data do relatório: {new Date().toLocaleDateString("pt-BR")}</p></div>
              </div>
              
              {/* Tabela de Dados */}
              <table className={styles.reportTable}>
                <thead><tr><th>Ranking</th><th>Medicamento</th><th>Dosagem</th><th>Fabricante</th><th>Nº de Favoritações</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5">Carregando dados...</td></tr>
                  ) : sortedMedicamentos.length > 0 ? (
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

              {/* Resumo Estatístico */}
              <div className={styles.reportSummary}>
                <h2>Resumo do Relatório</h2>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}><span className={styles.summaryLabel}>Total de Itens</span><span className={styles.summaryValue}>{sortedMedicamentos.length}</span></div>
                  <div className={styles.summaryItem}><span className={styles.summaryLabel}>Total de Favoritações</span><span className={styles.summaryValue}>{sortedMedicamentos.reduce((acc, med) => acc + med.favoritacoes, 0)}</span></div>
                </div>
              </div>

              {/* Rodapé (Visível apenas na impressão) */}
              <div className={styles.reportFooter}><p>Relatório gerado em: {new Date().toLocaleString("pt-BR")}</p><p>{userInfo?.farm_nome} - Sistema de Gestão PharmaX</p></div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}