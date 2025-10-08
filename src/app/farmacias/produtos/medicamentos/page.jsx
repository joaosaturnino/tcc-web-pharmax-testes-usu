"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";
import AuthGuard from "../../../componentes/AuthGuard";
import api from "../../../services/api";
import { BsUpcScan, BsFillPatchCheckFill, BsFillPatchQuestionFill } from "react-icons/bs";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// Mapeamentos
const tiposMedicamento = { 1: "Referência", 2: "Genérico", 3: "Similar" };
const formasMedicamento = { 1: "Comprimidos", 2: "Cápsulas", 3: "Líquido", 4: "Pó para Suspensão", 5: "Pomada", 6: "Injetável" };
const categoriasMedicamento = { 1: "Analgésico", 2: "Antibiótico", 3: "Anti-hipertensivo", 4: "Gastrointestinal", 5: "Cardiovascular" };

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
  const [ordenacao, setOrdenacao] = useState("nome");
  const [carregandoFiltro, setCarregandoFiltro] = useState(false);
  const [visualizacao, setVisualizacao] = useState("tabela");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const fetchMedicamentos = async () => {
      setErroApi("");
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("Usuário não autenticado.");
        
        const userData = JSON.parse(userDataString);
        setFarmaciaInfo(userData);
        const farmaciaId = userData.farm_id;
        if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");

        const response = await api.get(`/medicamentos?farmacia_id=${farmaciaId}`);

        if (response.data.sucesso) {
          const processedMedicamentos = response.data.dados.map(med => ({
            id: med.med_id,
            nome: med.med_nome,
            dosagem: med.med_dosagem,
            quantidade: med.med_quantidade || 0,
            tipo: med.tipo_nome || tiposMedicamento[med.tipo_id] || "N/A",
            forma: med.forma_nome || formasMedicamento[med.forma_id] || "N/A",
            descricao: med.med_descricao || "Sem descrição.",
            laboratorio: med.lab_nome || "N/A",
            preco: med.medp_preco || 0,
            imagem: med.med_imagem, 
            codigoBarras: med.med_cod_barras || "",
            med_ativo: med.med_ativo,
            status: med.med_ativo ? "ativo" : "inativo",
            categoria: categoriasMedicamento[1] || "Geral",
            lote: "LOTE" + med.med_id.toString().padStart(5, '0'),
            dataCadastro: med.med_data_cadastro,
            dataAtualizacao: med.med_data_atualizacao
          }));
          setMedicamentos(processedMedicamentos);
        } else {
          setErroApi(response.data.mensagem);
        }
      } catch (error) {
        const mensagem = error.response?.data?.mensagem || error.message || "Não foi possível conectar ao servidor.";
        setErroApi(mensagem);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, []);

  const categorias = useMemo(() => {
    const cats = [...new Set(medicamentos.map((m) => m.categoria))];
    return ["todos", ...cats];
  }, [medicamentos]);

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
      resultado = resultado.filter((med) => med.categoria === filtroCategoria);
    }
    
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case "nome": return a.nome.localeCompare(b.nome);
        case "quantidade": return b.quantidade - a.quantidade;
        case "preco": return b.preco - a.preco;
        case "laboratorio": return a.laboratorio.localeCompare(b.laboratorio);
        default: return 0;
      }
    });
    
    return resultado;
  }, [medicamentos, termoPesquisa, filtroStatus, filtroCategoria, ordenacao]);
  
  const totalPaginas = Math.ceil(medicamentosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const medicamentosPaginados = medicamentosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("Usuário não autenticado.");
        const userData = JSON.parse(userDataString);
        const farmaciaId = userData.farm_id;
        if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");

        const response = await api.delete(`/medicamentos/${id}`, {
          data: { farmacia_id: farmaciaId }
        });
        
        if (response.data.sucesso) {
          setMedicamentos(medicamentos.filter((med) => med.id !== id));
          if (modalDetalhesAberto && medicamentoSelecionado?.id === id) {
            fecharModalDetalhes();
          }
          alert("Medicamento excluído com sucesso!");
        } else {
          alert("Erro ao excluir medicamento: " + response.data.mensagem);
        }
      } catch (error) {
        alert(error.response?.data?.mensagem || "Erro ao excluir medicamento.");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const medicamento = medicamentos.find(med => med.id === id);
      if (!medicamento) return;

      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("Usuário não autenticado.");
      const userData = JSON.parse(userDataString);
      const farmaciaId = userData.farm_id;
      if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");

      const novoStatusBooleano = !medicamento.med_ativo;
      
      const response = await api.put(`/medicamentos/${id}`, {
        med_ativo: novoStatusBooleano,
        farmacia_id: farmaciaId 
      });

      if (response.data.sucesso) {
        const novoStatusString = novoStatusBooleano ? "ativo" : "inativo";
        setMedicamentos(medicamentos.map((med) => med.id === id ? { ...med, med_ativo: novoStatusBooleano, status: novoStatusString } : med));
        if (medicamentoSelecionado?.id === id) {
          setMedicamentoSelecionado({ ...medicamentoSelecionado, med_ativo: novoStatusBooleano, status: novoStatusString });
        }
        alert(response.data.mensagem || "Status atualizado!");
      } else {
        alert("Erro: " + response.data.mensagem);
      }
    } catch (error) {
      alert(error.response?.data?.mensagem || "Não foi possível alterar o status.");
    }
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
                <div className={styles.filtroGroup}><label>Categoria:</label><select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className={styles.selectFiltro}>{categorias.map((cat) => (<option key={cat} value={cat}>{cat === "todos" ? "Todas" : cat}</option>))}</select></div>
                <div className={styles.filtroGroup}><label>Ordenar por:</label><select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className={styles.selectFiltro}><option value="nome">Nome</option><option value="quantidade">Conteúdo</option><option value="preco">Preço</option><option value="laboratorio">Laboratório</option></select></div>
                <div className={styles.filtroGroup}><label>Itens:</label><select value={itensPorPagina} onChange={handleItensPorPaginaChange} className={styles.selectFiltro}><option value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></div>
              </div>
              <div className={styles.infoResultados}>Exibindo {medicamentosPaginados.length} de {medicamentosFiltrados.length}</div>
            </div>
            
            <div className={styles.tableContainer}>
              {carregandoFiltro ? (<div className={styles.carregando}><div className={styles.spinner}></div><p>Filtrando...</p></div>) : medicamentosPaginados.length === 0 ? (<div className={styles.semResultados}><p>Nenhum medicamento encontrado.</p><button onClick={abrirModal} className={styles.actionButton}>+ Adicionar Medicamento</button></div>) : visualizacao === "tabela" ? (<table className={styles.tabela}><thead><tr><th>Imagem</th><th>Nome</th><th>Dosagem</th><th>Conteúdo</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>{medicamentosPaginados.map((med) => (<tr key={med.id} className={`${styles.tableRow} ${med.status === "inativo" ? styles.inativo : ""}`}><td><img src={med.imagem} alt={med.nome} className={styles.medicamentoImagem} /></td><td><div className={styles.nomeContainer}><span className={styles.nome}>{med.nome}</span><span className={styles.categoria}>{med.categoria}</span></div></td><td>{med.dosagem}</td><td><span className={styles.quantidade}>{med.quantidade}</span></td><td>{currency.format(med.preco)}</td><td><span className={`${styles.status} ${med.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>{med.status}</span></td><td><div className={styles.acoes}><button onClick={() => abrirDetalhes(med)} className={styles.botaoAcao}>Detalhes</button></div></td></tr>))}</tbody></table>) : (<div className={styles.gradeContainer}>{medicamentosPaginados.map((med) => (<div key={med.id} className={`${styles.medicamentoCard} ${med.status === "inativo" ? styles.inativo : ""}`}><div className={styles.cardHeader}><img src={med.imagem} alt={med.nome} className={styles.cardImagem} /><span className={`${styles.cardStatus} ${med.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>{med.status}</span></div><div className={styles.cardContent}><h3 className={styles.cardNome}>{med.nome}</h3><p className={styles.cardDosagem}>{med.dosagem}</p><div className={styles.cardInfo}><div className={styles.infoItem}><span className={styles.infoLabel}>Conteúdo:</span><span className={styles.infoValue}>{med.quantidade}</span></div><div className={styles.infoItem}><span className={styles.infoLabel}>Preço:</span><span className={styles.infoValue}>{currency.format(med.preco)}</span></div></div></div><div className={styles.cardActions}><button onClick={() => abrirDetalhes(med)} className={styles.botaoAcaoCard}>Detalhes</button></div></div>))}</div>)}
            </div>
            
            {totalPaginas > 1 && (<div className={styles.paginacao}><button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1} className={styles.botaoPaginacao}>←</button>{Array.from({ length: totalPaginas }).map((_, i) => i + 1).map(p => (<button key={p} onClick={() => setPaginaAtual(p)} className={`${styles.botaoPaginacao} ${p === paginaAtual ? styles.paginaAtual : ""}`}>{p}</button>))}<button onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas} className={styles.botaoPaginacao}>→</button></div>)}
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
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Dosagem:</span><span className={styles.infoValue}>{medicamentoSelecionado.dosagem}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Conteúdo:</span><span className={styles.infoValue}>{medicamentoSelecionado.quantidade}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Preço:</span><span className={styles.infoValue}>{currency.format(medicamentoSelecionado.preco)}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Laboratório:</span><span className={styles.infoValue}>{medicamentoSelecionado.laboratorio}</span></div>
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
                <button onClick={() => toggleStatus(medicamentoSelecionado.id)} className={styles.cancelButton}>{medicamentoSelecionado.status === "ativo" ? "Desativar" : "Ativar"}</button>
                <button onClick={() => handleEditar(medicamentoSelecionado.id)} className={styles.actionButton}>Editar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default ListagemMedicamentos;