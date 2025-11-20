"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";
import AuthGuard from "../../../componentes/AuthGuard";
import api from "../../../services/api";
import { BsUpcScan, BsFillPatchCheckFill, BsFillPatchQuestionFill, BsFillExclamationTriangleFill } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// === Funções de Data ===
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(date);
  } catch (e) {
    return "Data inválida";
  }
};
// === FIM Funções de Data ===

function ListagemMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [medicamentoExistente, setMedicamentoExistente] = useState(null);
  const [produtoNaoEncontrado, setProdutoNaoEncontrado] = useState(false);
  const [erro, setErro] = useState("");
  const [erroApi, setErroApi] = useState("");
  const [verificandoCodigo, setVerificandoCodigo] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [tiposProduto, setTiposProduto] = useState([]);
  const [promocoesAtivas, setPromocoesAtivas] = useState([]);
  const [ordenacao, setOrdenacao] = useState("nome");
  const [carregandoFiltro, setCarregandoFiltro] = useState(false);
  const [visualizacao, setVisualizacao] = useState("tabela");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const router = useRouter();

  // States para o Modal de Promoção
  const [modalPromocaoAberto, setModalPromocaoAberto] = useState(false);
  const [promoErro, setPromoErro] = useState("");
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);
  const [promoDados, setPromoDados] = useState({
    porcentagem: "",
    data_inicio: formatDate(new Date()),
    data_fim: "",
  });

  const [confirmacao, setConfirmacao] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    isDanger: false,
  });

  const processarMedicamentos = (medicamentosData, promocoesData) => {
    return medicamentosData.map(med => {
      const promocaoInfo = promocoesData.find(p => p.medicamento_id === med.med_id);
      let precoPromocional = null;
      if (promocaoInfo) {
        const desconto = parseFloat(promocaoInfo.promo_desconto) / 100;
        precoPromocional = (med.medp_preco * (1 - desconto));
      }
      return {
        preco_original: med.medp_preco || 0,
        id: med.med_id,
        nome: med.med_nome,
        dosagem: med.med_dosagem,
        quantidade: med.med_quantidade || 0,
        tipo: med.tipo_nome || "N/A",
        forma: med.forma_nome || "N/A",
        descricao: med.med_descricao || "Sem descrição.",
        laboratorio: med.lab_nome || "N/A",
        imagem: med.med_imagem,
        codigoBarras: med.med_cod_barras || "",
        med_ativo: med.med_ativo,
        status: med.med_ativo ? "ativo" : "inativo",
        categoria: med.categoria_nome || "Geral",
        lote: "LOTE" + med.med_id.toString().padStart(5, '0'),
        dataCadastro: med.med_data_cadastro,
        dataAtualizacao: med.med_data_atualizacao,
        promocao: !!promocaoInfo,
        preco_promocional: precoPromocional,
        promocao_id: promocaoInfo?.promo_id || null,
        promocao_porcentagem: promocaoInfo?.promo_desconto || 0,
        promocao_data_inicio: promocaoInfo?.promo_inicio || null,
        promocao_data_fim: promocaoInfo?.promo_fim || null,
      };
    });
  };

  const fetchDadosIniciais = async () => {
    setErroApi("");
    let farmaciaId;
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("Usuário não autenticado.");
      const userData = JSON.parse(userDataString);
      setFarmaciaInfo(userData);
      farmaciaId = userData.farm_id;
      if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");
      const [responseMedicamentos, responseTipos, responsePromocoes] = await Promise.all([
        api.get(`/medicamentos?farmacia_id=${farmaciaId}`),
        api.get('/tipoproduto'),
        api.get(`/promocoes?farmacia_id=${farmaciaId}`)
      ]);
      let promocoes = [];
      if (responsePromocoes.data.sucesso) {
        promocoes = responsePromocoes.data.dados;
        setPromocoesAtivas(promocoes);
      } else {
        console.warn("Não foi possível carregar as promoções.");
      }
      if (responseMedicamentos.data.sucesso) {
        const processedMedicamentos = processarMedicamentos(responseMedicamentos.data.dados, promocoes);
        setMedicamentos(processedMedicamentos);
      } else {
        setErroApi(responseMedicamentos.data.mensagem);
      }
      if (responseTipos.data.sucesso) {
        setTiposProduto(responseTipos.data.dados);
      } else {
        console.warn("Não foi possível carregar os tipos de produto para o filtro.");
      }
    } catch (error) {
      const mensagem = error.response?.data?.mensagem || error.message || "Não foi possível conectar ao servidor.";
      setErroApi(mensagem);
      console.error("Erro ao buscar dados iniciais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  useEffect(() => {
    setCarregandoFiltro(true);
    const timer = setTimeout(() => setCarregandoFiltro(false), 300);
    return () => clearTimeout(timer);
  }, [termoPesquisa, filtroStatus, filtroCategoria, ordenacao]);

  const medicamentosFiltrados = useMemo(() => {
    let resultado = [...medicamentos];
    if (termoPesquisa) {
      const termo = termoPesquisa.toLowerCase();
      resultado = resultado.filter(
        (med) =>
          med.nome.toLowerCase().includes(termo) ||
          med.laboratorio.toLowerCase().includes(termo) ||
          (med.codigoBarras && med.codigoBarras.includes(termo)) ||
          med.tipo.toLowerCase().includes(termo) ||
          med.categoria.toLowerCase().includes(termo)
      );
    }
    if (filtroStatus !== "todos") {
      resultado = resultado.filter((med) => med.status === filtroStatus);
    }
    if (filtroCategoria !== "todos") {
      resultado = resultado.filter((med) => med.tipo === filtroCategoria);
    }
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case "nome": return a.nome.localeCompare(b.nome);
        case "quantidade": return b.quantidade - a.quantidade;
        case "preco":
          const precoA = a.promocao ? a.preco_promocional : a.preco_original;
          const precoB = b.promocao ? b.preco_promocional : b.preco_original;
          return precoB - precoA;
        case "laboratorio": return a.laboratorio.localeCompare(b.laboratorio);
        default: return 0;
      }
    });
    return resultado;
  }, [medicamentos, termoPesquisa, filtroStatus, filtroCategoria, ordenacao]);

  const totalPaginas = Math.ceil(medicamentosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const medicamentosPaginados = medicamentosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);

  const fecharConfirmacao = () => {
    setConfirmacao({ isOpen: false, title: "", message: "", onConfirm: () => { }, isDanger: false });
  };

  const handleConfirmar = async () => {
    await confirmacao.onConfirm();
    fecharConfirmacao();
  };

  const handleExcluir = (id) => {
    const runDelete = async () => {
      try {
        const farmaciaId = farmaciaInfo?.farm_id;
        if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");

        const response = await api.delete(`/medicamentos/${id}`, {
          data: { farmacia_id: farmaciaId }
        });

        if (response.data.sucesso) {
          await fetchDadosIniciais();
          fecharModalDetalhes();
          toast.success("Medicamento excluído com sucesso!");
        } else {
          toast.error("Erro ao excluir medicamento: " + response.data.mensagem);
        }
      } catch (error) {
        toast.error(error.response?.data?.mensagem || "Erro ao excluir medicamento.");
      }
    };

    setConfirmacao({
      isOpen: true,
      title: "Confirmar Exclusão",
      message: `Tem certeza que deseja excluir o medicamento "${medicamentoSelecionado?.nome}"? Esta ação não pode ser desfeita.`,
      onConfirm: runDelete,
      isDanger: true,
    });
  };

  // === MUDANÇA: Função separada para executar a alteração de status ===
  const executarAlteracaoStatus = async (id, toastId) => {
    toast.dismiss(toastId); // Fecha a caixa de confirmação

    try {
      const medicamento = medicamentos.find(med => med.id === id);
      if (!medicamento) return;
      const farmaciaId = farmaciaInfo?.farm_id;
      if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");
      const novoStatusBooleano = !medicamento.med_ativo;

      const response = await api.put(`/medicamentos/${id}`, {
        med_ativo: novoStatusBooleano,
        farmacia_id: farmaciaId
      });

      if (response.data.sucesso) {
        await fetchDadosIniciais();
        fecharModalDetalhes();
        toast.success(response.data.mensagem || "Status atualizado!");
      } else {
        toast.error("Erro: " + response.data.mensagem);
      }
    } catch (error) {
      toast.error(error.response?.data?.mensagem || "Não foi possível alterar o status.");
    }
  };

  // === MUDANÇA: Função para chamar o Toast de Confirmação do Status ===
  const handleToggleStatus = (medicamento) => {
    const acao = medicamento.status === "ativo" ? "Desativar" : "Ativar";
    const isDanger = medicamento.status === "ativo"; // Desativar é "perigoso"

    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', minWidth: '280px' }}>
        <span style={{ fontSize: '1.4rem', color: '#333', textAlign: 'center', lineHeight: '1.5' }}>
          Tem certeza que deseja <strong>{acao}</strong> o medicamento <br /> <strong>{medicamento.nome}</strong>?
        </span>
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1.3rem',
              fontWeight: '600',
              flex: 1
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => executarAlteracaoStatus(medicamento.id, t.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: isDanger ? '#dc2626' : '#458B00',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1.3rem',
              fontWeight: '600',
              flex: 1
            }}
          >
            Sim, {acao}
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        padding: '20px',
        background: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }
    });
  };

  const handlePromoChange = (e) => {
    const { name, value } = e.target;
    setPromoDados(prev => ({ ...prev, [name]: value }));
  };

  const abrirModalPromocao = () => {
    setPromoErro("");
    setPromoDados({
      porcentagem: "",
      data_inicio: formatDate(new Date()),
      data_fim: "",
    });
    setModalPromocaoAberto(true);
  };

  const fecharModalPromocao = () => {
    if (isSubmittingPromo) return;
    setModalPromocaoAberto(false);
  };

  const handleCriarPromocao = async (e) => {
    e.preventDefault();
    setPromoErro("");
    setIsSubmittingPromo(true);

    const { porcentagem, data_inicio, data_fim } = promoDados;
    if (!porcentagem || !data_inicio || !data_fim) {
      setPromoErro("Todos os campos são obrigatórios.");
      setIsSubmittingPromo(false);
      return;
    }
    if (parseFloat(porcentagem) <= 0 || parseFloat(porcentagem) >= 100) {
      setPromoErro("A porcentagem deve ser um valor entre 1 e 99.");
      setIsSubmittingPromo(false);
      return;
    }

    try {
      const payload = {
        medicamento_id: medicamentoSelecionado.id,
        farmacia_id: farmaciaInfo.farm_id,
        promo_desconto: parseFloat(porcentagem),
        promo_inicio: data_inicio,
        promo_fim: data_fim,
      };

      const response = await api.post('/promocoes', payload);

      if (response.data.sucesso) {
        await fetchDadosIniciais();
        fecharModalPromocao();
        fecharModalDetalhes();
        toast.success("Promoção ativada com sucesso!");
      } else {
        setPromoErro(response.data.mensagem || "Erro ao salvar promoção.");
      }
    } catch (error) {
      setPromoErro(error.response?.data?.mensagem || "Erro de conexão.");
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  const handleRemoverPromocao = (promoId) => {
    if (!promoId) {
      toast.error("Erro: ID da promoção não encontrado.");
      return;
    }

    const runRemove = async () => {
      try {
        const response = await api.delete(`/promocoes/${promoId}`);
        if (response.data.sucesso) {
          await fetchDadosIniciais();
          fecharModalDetalhes();
          toast.success("Promoção removida com sucesso!");
        } else {
          toast.error(response.data.mensagem || "Erro ao remover promoção.");
        }
      } catch (error) {
        toast.error(error.response?.data?.mensagem || "Erro de conexão.");
      }
    };

    setConfirmacao({
      isOpen: true,
      title: "Remover Promoção",
      message: `Tem certeza que deseja remover a promoção deste item?`,
      onConfirm: runRemove,
      isDanger: false,
    });
  };

  const handleEditar = (id) => router.push(`/farmacias/produtos/medicamentos/editar/${id}`);
  const abrirDetalhes = (medicamento) => { setMedicamentoSelecionado(medicamento); setModalDetalhesAberto(true); };
  const abrirModal = () => { setModalAberto(true); setCodigoBarras(""); setMedicamentoExistente(null); setProdutoNaoEncontrado(false); setErro(""); };
  const fecharModal = () => setModalAberto(false);
  const fecharModalDetalhes = () => { setModalDetalhesAberto(false); setMedicamentoSelecionado(null); };

  const verificarCodigoBarras = () => {
    if (!codigoBarras.trim()) {
      setErro("Digite um código de barras válido.");
      return;
    }
    setVerificandoCodigo(true);
    setErro("");
    setTimeout(() => {
      const medicamento = medicamentos.find((med) => med.codigoBarras === codigoBarras);
      if (medicamento) {
        setMedicamentoExistente(medicamento);
        setProdutoNaoEncontrado(false);
      } else {
        setProdutoNaoEncontrado(true);
        setMedicamentoExistente(null);
      }
      setVerificandoCodigo(false);
    }, 500);
  };

  const redirecionarParaCadastro = () => { fecharModal(); router.push(`/farmacias/produtos/medicamentos/cadastro?codigoBarras=${codigoBarras}`); };
  const handleItensPorPaginaChange = (e) => { setItensPorPagina(Number(e.target.value)); setPaginaAtual(1); };
  const handleLogout = () => { localStorage.clear(); router.push("/home"); };

  if (loading) { return (<div className={styles.loaderContainer}><div className={styles.spinner}></div><p>Carregando...</p></div>); }
  if (erroApi) { return (<div className={styles.erroContainer}><h2>Ocorreu um erro</h2><p>{erroApi}</p><button onClick={() => window.location.reload()} className={styles.actionButton}>Tentar Novamente</button></div>); }

  return (
    <AuthGuard>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '1.5rem',
            padding: '1.6rem',
          },
          success: {
            style: {
              background: '#458B00',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />

      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
            <h1 className={styles.titulo}>Gestão de Medicamentos</h1>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <input type="text" className={styles.searchInput} placeholder="Pesquisar..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} />
              {termoPesquisa && (<button className={styles.limparPesquisa} onClick={() => setTermoPesquisa("")} aria-label="Limpar pesquisa">×</button>)}
            </div>
            <button onClick={abrirModal} className={styles.actionButton}>+ Novo Medicamento</button>
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
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Medicamentos</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
          </aside>

          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          <main className={styles.mainContent}>
            <div className={styles.controles}>
              <div className={styles.filtros}>
                <div className={styles.viewToggle}><button className={`${styles.viewButton} ${visualizacao === "tabela" ? styles.active : ""}`} onClick={() => setVisualizacao("tabela")} title="Tabela">≡</button><button className={`${styles.viewButton} ${visualizacao === "grade" ? styles.active : ""}`} onClick={() => setVisualizacao("grade")} title="Grade">◼︎</button></div>
                <div className={styles.filtroGroup}><label>Status:</label><select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className={styles.selectFiltro}><option value="todos">Todos</option><option value="ativo">Ativos</option><option value="inativo">Inativos</option></select></div>
                <div className={styles.filtroGroup}>
                  <label>Categoria:</label>
                  <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className={styles.selectFiltro}>
                    <option value="todos">Todas</option>
                    {tiposProduto.map((tipo) => (
                      <option key={tipo.tipo_id} value={tipo.nome_tipo}>{tipo.nome_tipo}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filtroGroup}><label>Ordenar por:</label><select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className={styles.selectFiltro}><option value="nome">Nome</option><option value="quantidade">Conteúdo</option><option value="preco">Preço</option><option value="laboratorio">Laboratório</option></select></div>
                <div className={styles.filtroGroup}><label>Itens:</label><select value={itensPorPagina} onChange={handleItensPorPaginaChange} className={styles.selectFiltro}><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></div>
              </div>
              <div className={styles.infoResultados}>Exibindo {medicamentosPaginados.length} de {medicamentosFiltrados.length}</div>
            </div>

            <div className={styles.tableContainer}>
              {carregandoFiltro ? (<div className={styles.carregando}><div className={styles.spinner}></div><p>Filtrando...</p></div>) : medicamentosPaginados.length === 0 ? (<div className={styles.semResultados}><p>Nenhum medicamento encontrado.</p><button onClick={abrirModal} className={styles.actionButton}>+ Adicionar Medicamento</button></div>) : visualizacao === "tabela" ? (<table className={styles.tabela}><thead><tr><th>Imagem</th><th>Nome</th><th>Dosagem</th><th>Conteúdo</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>{medicamentosPaginados.map((med) => (<tr key={med.id} className={`${styles.tableRow} ${med.status === "inativo" ? styles.inativo : ""}`}><td><img src={med.imagem} alt={med.nome} className={styles.medicamentoImagem} /></td><td><div className={styles.nomeContainer}><span className={styles.nome}>{med.nome}</span>
                <span className={styles.categoria}>{med.tipo}</span>
                {med.promocao && <span className={styles.promoTag}>PROMOÇÃO</span>}
              </div></td><td>{med.dosagem}</td><td><span className={styles.quantidade}>{med.quantidade}</span></td>
                <td>
                  {med.promocao ? (
                    <div>
                      <span className={styles.precoOriginal}>{currency.format(med.preco_original)}</span>
                      <span className={styles.precoPromocional}>{currency.format(med.preco_promocional)}</span>
                    </div>
                  ) : (
                    currency.format(med.preco_original)
                  )}
                </td>
                <td><span className={`${styles.status} ${med.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>{med.status}</span></td><td><div className={styles.acoes}><button onClick={() => abrirDetalhes(med)} className={styles.botaoAcao}>Detalhes</button></div></td></tr>))}</tbody></table>) : (<div className={styles.gradeContainer}>{medicamentosPaginados.map((med) => (<div key={med.id} className={`${styles.medicamentoCard} ${med.status === "inativo" ? styles.inativo : ""}`}><div className={styles.cardHeader}><img src={med.imagem} alt={med.nome} className={styles.cardImagem} />
                  {med.promocao && <span className={styles.cardPromoTag}>PROMO</span>}
                  <span className={`${styles.cardStatus} ${med.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>{med.status}</span></div><div className={styles.cardContent}><h3 className={styles.cardNome}>{med.nome}</h3><p className={styles.cardDosagem}>{med.dosagem}</p><div className={styles.cardInfo}><div className={styles.infoItem}><span className={styles.infoLabel}>Conteúdo:</span><span className={styles.infoValue}>{med.quantidade}</span></div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Preço:</span>
                      {med.promocao ? (
                        <div className={styles.precoContainerGrade}>
                          <span className={styles.precoOriginal}>{currency.format(med.preco_original)}</span>
                          <span className={styles.precoPromocional}>{currency.format(med.preco_promocional)}</span>
                        </div>
                      ) : (
                        <span className={styles.infoValue}>{currency.format(med.preco_original)}</span>
                      )}
                    </div>
                  </div></div><div className={styles.cardActions}><button onClick={() => abrirDetalhes(med)} className={styles.botaoAcaoCard}>Detalhes</button></div></div>))}</div>)}
            </div>

            {totalPaginas > 1 && (<div className={styles.paginacao}></div>)}
          </main>
        </div>

        {modalAberto && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Novo Medicamento</h2>
                <button onClick={fecharModal} className={styles.modalClose} aria-label="Fechar">✕</button>
              </div>
              <div className={styles.modalContent}>
                {!medicamentoExistente && !produtoNaoEncontrado && (
                  <div className={styles.barcodeModalContainer}>
                    <BsUpcScan className={styles.barcodeIcon} />
                    <h3>Verificar Código de Barras</h3>
                    <p>Digite o código de barras do produto para verificar se ele já existe no sistema antes de prosseguir.</p>
                    <div className={styles.codigoBarrasInput}>
                      <input type="text" placeholder="Digite o código..." value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && verificarCodigoBarras()} className={styles.modernInput} />
                      <button onClick={verificarCodigoBarras} className={styles.actionButton} disabled={verificandoCodigo}>
                        {verificandoCodigo ? <span className={styles.buttonSpinner}></span> : "Verificar"}
                      </button>
                    </div>
                    {erro && <p className={styles.errorMessage}>{erro}</p>}
                  </div>
                )}
                {medicamentoExistente && (
                  <div className={styles.barcodeModalContainer}>
                    <BsFillPatchCheckFill className={`${styles.barcodeIcon} ${styles.successIcon}`} />
                    <h3>Medicamento Encontrado!</h3>
                    <p>Este produto já está cadastrado no seu sistema.</p>
                    <div className={styles.existenteInfo}>
                      <img src={medicamentoExistente.imagem} alt={medicamentoExistente.nome} className={styles.existenteImagem} />
                      <div className={styles.existenteDetalhes}>
                        <p><strong>Nome:</strong> {medicamentoExistente.nome}</p>
                        <p><strong>Laboratório:</strong> {medicamentoExistente.laboratorio}</p>
                        <p><strong>Código:</strong> {medicamentoExistente.codigoBarras}</p>
                      </div>
                    </div>
                    <div className={styles.modalFooter}>
                      <button onClick={abrirModal} className={styles.cancelButton}>Verificar Outro</button>
                      <button onClick={() => abrirDetalhes(medicamentoExistente)} className={styles.actionButton}>Ver Detalhes</button>
                    </div>
                  </div>
                )}
                {produtoNaoEncontrado && (
                  <div className={styles.barcodeModalContainer}>
                    <BsFillPatchQuestionFill className={`${styles.barcodeIcon} ${styles.warningIcon}`} />
                    <h3>Produto não Encontrado</h3>
                    <p>Nenhum medicamento corresponde ao código de barras <strong>{codigoBarras}</strong>. Deseja cadastrá-lo agora?</p>
                    <div className={styles.modalFooter}>
                      <button onClick={abrirModal} className={styles.cancelButton}>Cancelar</button>
                      <button onClick={redirecionarParaCadastro} className={styles.actionButton}>Sim, Cadastrar Agora</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {modalDetalhesAberto && medicamentoSelecionado && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Detalhes do Medicamento</h2>
                <button onClick={fecharModalDetalhes} className={styles.modalClose} aria-label="Fechar">✕</button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.detalhesContainer}>
                  <div className={styles.detalhesImagem}>
                    <img src={medicamentoSelecionado.imagem} alt={medicamentoSelecionado.nome} className={styles.detalhesImg} />
                  </div>
                  <div className={styles.detalhesInfo}>
                    <h3>{medicamentoSelecionado.nome}</h3>
                    {medicamentoSelecionado.promocao && (
                      <div className={styles.infoPromocao}>
                        <strong>PROMOÇÃO ATIVA</strong>
                        <p>{medicamentoSelecionado.promocao_porcentagem}% OFF</p>
                        <span>Início: {formatDateForDisplay(medicamentoSelecionado.promocao_data_inicio)}</span><br />
                        <span>Válida até: {formatDateForDisplay(medicamentoSelecionado.promocao_data_fim)}</span>
                      </div>
                    )}
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Dosagem:</span><span className={styles.infoValue}>{medicamentoSelecionado.dosagem}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Conteúdo:</span><span className={styles.infoValue}>{medicamentoSelecionado.quantidade}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Forma:</span><span className={styles.infoValue}>{medicamentoSelecionado.forma}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Categoria:</span><span className={styles.infoValue}>{medicamentoSelecionado.tipo}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Laboratório:</span><span className={styles.infoValue}>{medicamentoSelecionado.laboratorio}</span></div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Preço:</span>
                        {medicamentoSelecionado.promocao ? (
                          <div>
                            <span className={`${styles.precoOriginal} ${styles.precoModal}`}>{currency.format(medicamentoSelecionado.preco_original)}</span>
                            <span className={`${styles.precoPromocional} ${styles.precoModal}`}>{currency.format(medicamentoSelecionado.preco_promocional)}</span>
                          </div>
                        ) : (
                          <span className={styles.infoValue}>{currency.format(medicamentoSelecionado.preco_original)}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.descricao}>
                      <span className={styles.infoLabel}>Descrição:</span>
                      <p>{medicamentoSelecionado.descricao}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button onClick={() => handleExcluir(medicamentoSelecionado.id)} className={styles.dangerButton}>Excluir</button>

                {medicamentoSelecionado.promocao ? (
                  <button
                    onClick={() => handleRemoverPromocao(medicamentoSelecionado.promocao_id)}
                    className={styles.promoRemoveButton}
                  >
                    Remover Promoção
                  </button>
                ) : (
                  <button
                    onClick={abrirModalPromocao}
                    className={styles.promoButton}
                  >
                    Ativar Promoção
                  </button>
                )}

                {/* === MUDANÇA AQUI: Botão agora chama handleToggleStatus === */}
                <button onClick={() => handleToggleStatus(medicamentoSelecionado)} className={styles.cancelButton}>{medicamentoSelecionado.status === "ativo" ? "Desativar" : "Ativar"}</button>
                
                <button onClick={() => handleEditar(medicamentoSelecionado.id)} className={styles.actionButton}>Editar</button>
              </div>
            </div>
          </div>
        )}

        {modalPromocaoAberto && (
          <div className={styles.modalOverlay} style={{ zIndex: 1010 }}>
            <div className={styles.modal} style={{ maxWidth: '50rem' }}>
              <div className={styles.modalHeader}>
                <h2>Ativar Promoção</h2>
                <button onClick={fecharModalPromocao} className={styles.modalClose} aria-label="Fechar" disabled={isSubmittingPromo}>✕</button>
              </div>
              <form onSubmit={handleCriarPromocao}>
                <div className={styles.modalContent} style={{ textAlign: 'left' }}>
                  <p>Defina os detalhes da promoção para <strong>{medicamentoSelecionado?.nome}</strong>.</p>
                  <div className={styles.formGroup}>
                    <label htmlFor="porcentagem">Porcentagem de Desconto (%)</label>
                    <input type="number" id="porcentagem" name="porcentagem" className={styles.formInput} value={promoDados.porcentagem} onChange={handlePromoChange} placeholder="Ex: 20" min="1" max="99" />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="data_inicio">Data de Início</label>
                      <input type="date" id="data_inicio" name="data_inicio" className={styles.formInput} value={promoDados.data_inicio} onChange={handlePromoChange} min={formatDate(new Date())} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="data_fim">Data de Fim</label>
                      <input type="date" id="data_fim" name="data_fim" className={styles.formInput} value={promoDados.data_fim} onChange={handlePromoChange} min={promoDados.data_inicio || formatDate(new Date())} />
                    </div>
                  </div>
                  {promoErro && <p className={styles.promoError}>{promoErro}</p>}
                </div>
                <div className={styles.modalFooter}>
                  <button type="button" onClick={fecharModalPromocao} className={styles.cancelButton} disabled={isSubmittingPromo}>Cancelar</button>
                  <button type="submit" className={styles.promoButton} disabled={isSubmittingPromo}>
                    {isSubmittingPromo ? <span className={styles.buttonSpinner}></span> : "Salvar Promoção"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {confirmacao.isOpen && (
          <div className={styles.modalOverlay} style={{ zIndex: 1020 }}>
            <div className={styles.modal} style={{ maxWidth: '50rem' }}>
              <div className={styles.modalContent} style={{ padding: '3rem' }}>
                <div className={styles.modalConfirmContainer}>
                  <BsFillExclamationTriangleFill className={`${styles.modalConfirmIcon} ${confirmacao.isDanger ? styles.danger : ''}`} />
                  <div className={styles.modalConfirmContent}>
                    <h3>{confirmacao.title}</h3>
                    <p>{confirmacao.message}</p>
                  </div>
                </div>
              </div>
              <div className={styles.modalConfirmFooter}>
                <button onClick={fecharConfirmacao} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmar}
                  className={confirmacao.isDanger ? styles.dangerButton : styles.actionButton}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <button onClick={abrirModal} className={styles.mobileAddButton} aria-label="Adicionar Novo Medicamento">+</button>
    </AuthGuard>
  );
}

export default ListagemMedicamentos;