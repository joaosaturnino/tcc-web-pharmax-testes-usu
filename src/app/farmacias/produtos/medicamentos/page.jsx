"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";
import AuthGuard from "../../../componentes/AuthGuard";
import api from "../../../services/api";

const imagemPadrao =
  "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";

const currency =
  typeof Intl !== "undefined"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    : { format: (v) => `R$ ${Number(v).toFixed(2)}` };

// Mapeamentos
const tiposMedicamento = { 1: "Referência", 2: "Genérico", 3: "Similar" };
const formasMedicamento = { 1: "Comprimidos", 2: "Cápsulas", 3: "Líquido", 4: "Pó para Suspensão", 5: "Pomada", 6: "Injetável" };
const categoriasMedicamento = { 1: "Analgésico", 2: "Antibiótico", 3: "Anti-hipertensivo", 4: "Gastrointestinal", 5: "Cardiovascular" };

function ListagemMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [medicamentoExistente, setMedicamentoExistente] = useState(null);
  const [produtoNaoEncontrado, setProdutoNaoEncontrado] = useState(false);
  const [erro, setErro] = useState("");
  const [erroApi, setErroApi] = useState("");
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
        const response = await api.get('/medicamentos');

        if (response.data.sucesso) {
          const processedMedicamentos = response.data.dados.map(med => ({
            id: med.med_id,
            nome: med.med_nome,
            dosagem: med.med_dosagem,
            quantidade: med.med_quantidade || 0,
            tipo: tiposMedicamento[med.tipo_id] || "Não especificado",
            forma: formasMedicamento[med.forma_id] || "Não especificada",
            descricao: med.med_descricao || "Sem descrição disponível.",
            laboratorio: `Laboratório ${med.lab_id}`,
            preco: 0,
            imagem: med.med_imagem || "",
            codigoBarras: "",
            med_ativo: med.med_ativo,
            status: med.med_ativo ? "ativo" : "inativo",
            categoria: categoriasMedicamento[1] || "Geral",
            lote: "LOTE" + med.med_id.toString().padStart(5, '0'),
            dataCadastro: med.med_data_cadastro,
            dataAtualizacao: med.med_data_atualizacao
          }));
          
          setMedicamentos(processedMedicamentos);
        } else {
          console.error("Erro ao buscar os medicamentos:", response.data.mensagem);
          setErroApi(response.data.mensagem);
        }
      } catch (error) {
        console.error("Falha ao conectar com a API:", error);
        const mensagem = error.response?.data?.mensagem || "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
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
    const timer = setTimeout(() => {
      setCarregandoFiltro(false);
    }, 300);
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
          med.codigoBarras.includes(termo) ||
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
  const indiceFinal = indiceInicial + itensPorPagina;
  const medicamentosPaginados = medicamentosFiltrados.slice(indiceInicial, indiceFinal);

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      try {
        const response = await api.delete(`/medicamentos/${id}`);
        
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
        console.error("Erro ao excluir medicamento:", error);
        alert("Erro ao excluir medicamento. Tente novamente.");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      const medicamento = medicamentos.find(med => med.id === id);
      if (!medicamento) return;

      const novoStatusBooleano = !medicamento.med_ativo;
      
      const response = await api.put(`/medicamentos/${id}`, {
        med_ativo: novoStatusBooleano
      });

      if (response.data.sucesso) {
        const novoStatusString = novoStatusBooleano ? "ativo" : "inativo";
        
        setMedicamentos(
          medicamentos.map((med) =>
            med.id === id
              ? { ...med, med_ativo: novoStatusBooleano, status: novoStatusString }
              : med
          )
        );
        
        if (medicamentoSelecionado && medicamentoSelecionado.id === id) {
          setMedicamentoSelecionado({
            ...medicamentoSelecionado,
            med_ativo: novoStatusBooleano,
            status: novoStatusString,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status do medicamento.");
    }
  };

  const handleEditar = (id) => {
    router.push(`/farmacias/produtos/medicamentos/editar/${id}`);
  };

  const abrirDetalhes = (medicamento) => {
    setMedicamentoSelecionado(medicamento);
    setModalDetalhesAberto(true);
  };

  const abrirModal = () => {
    setModalAberto(true);
    setCodigoBarras("");
    setMedicamentoExistente(null);
    setProdutoNaoEncontrado(false);
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const fecharModalDetalhes = () => {
    setModalDetalhesAberto(false);
    setMedicamentoSelecionado(null);
  };

  const verificarCodigoBarras = () => {
    if (!codigoBarras.trim()) {
      setErro("Por favor, digite um código de barras válido.");
      return;
    }
    const medicamento = medicamentos.find((med) => med.codigoBarras === codigoBarras);
    if (medicamento) {
      setMedicamentoExistente(medicamento);
      setProdutoNaoEncontrado(false);
    } else {
      setProdutoNaoEncontrado(true);
      setMedicamentoExistente(null);
    }
    setErro("");
  };

  const continuarCadastro = () => {
    router.push(`/farmacias/produtos/medicamentos/precadastro?codigoBarras=${codigoBarras}`);
  };

  const redirecionarParaCadastro = () => {
    router.push(`/farmacias/produtos/medicamentos/cadastro?codigoBarras=${codigoBarras}`);
  };

  const handleItensPorPaginaChange = (e) => {
    setItensPorPagina(Number(e.target.value));
    setPaginaAtual(1);
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando medicamentos...</p>
        </div>
      </div>
    );
  }

  if (erroApi) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.erroContainer}>
          <h2>Ocorreu um erro</h2>
          <p>{erroApi}</p>
          <button onClick={() => window.location.reload()} className={styles.botaoPrincipal}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Alternar menu">
              ☰
            </button>
            <h1 className={styles.titulo}>Gestão de Medicamentos</h1>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <input type="text" className={styles.searchInput} placeholder="Pesquisar medicamentos..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} />
              {termoPesquisa && (
                <button className={styles.limparPesquisa} onClick={() => setTermoPesquisa("")} aria-label="Limpar pesquisa">
                  ×
                </button>
              )}
            </div>
            <button onClick={abrirModal} className={styles.botaoPrincipal}>
              Novo Medicamento
            </button>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logo}>
                <span className={styles.logoText}>PharmaX</span>
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>
                ×
              </button>
            </div>
            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Favoritos</span>
                </Link>
                <Link href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}>
                  <span className={styles.navText}>Medicamentos</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                  <span className={styles.navText}>Funcionários</span>
                </Link>
                <Link href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </Link>
                <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </Link>
                <Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <Link href="/farmacias/perfil" className={styles.navLink}>
                  <span className={styles.navText}>Meu Perfil</span>
                </Link>
                <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          <main className={styles.mainContent}>
            <div className={styles.controles}>
              <div className={styles.filtros}>
                <div className={styles.viewToggle}>
                  <button className={`${styles.viewButton} ${visualizacao === "tabela" ? styles.active : ""}`} onClick={() => setVisualizacao("tabela")} title="Visualização em tabela" aria-label="Visualização em tabela">
                    ≡
                  </button>
                  <button className={`${styles.viewButton} ${visualizacao === "grade" ? styles.active : ""}`} onClick={() => setVisualizacao("grade")} title="Visualização em grade" aria-label="Visualização em grade">
                    ◼︎
                  </button>
                </div>
                <div className={styles.filtroGroup}>
                  <label>Status:</label>
                  <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className={styles.selectFiltro}>
                    <option value="todos">Todos</option>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                  </select>
                </div>
                <div className={styles.filtroGroup}>
                  <label>Categoria:</label>
                  <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className={styles.selectFiltro}>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "todos" ? "Todas" : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.filtroGroup}>
                  <label>Ordenar por:</label>
                  <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className={styles.selectFiltro}>
                    <option value="nome">Nome</option>
                    <option value="quantidade">Conteúdo</option>
                    <option value="preco">Preço</option>
                    <option value="laboratorio">Laboratório</option>
                  </select>
                </div>
                <div className={styles.filtroGroup}>
                  <label>Itens por página:</label>
                  <select value={itensPorPagina} onChange={handleItensPorPaginaChange} className={styles.selectFiltro}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
              <div className={styles.infoResultados}>
                Exibindo {medicamentosPaginados.length} de {medicamentosFiltrados.length} medicamentos
              </div>
            </div>

            <div className={styles.tableContainer}>
              {carregandoFiltro ? (
                <div className={styles.carregando}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Carregando medicamentos...</p>
                </div>
              ) : medicamentosPaginados.length === 0 ? (
                <div className={styles.semResultados}>
                  <p>Nenhum medicamento encontrado.</p>
                  <button onClick={abrirModal} className={styles.botaoPrincipal}>
                    ➕ Adicionar Primeiro Medicamento
                  </button>
                </div>
              ) : visualizacao === "tabela" ? (
                <table className={styles.tabela}>
                  <thead>
                    <tr>
                      <th>Imagem</th>
                      <th>Nome</th>
                      <th>Dosagem</th>
                      <th>Conteúdo</th>
                      <th>Laboratório</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicamentosPaginados.map((med) => (
                      <tr key={med.id} className={`${styles.tableRow} ${med.status === "inativo" ? styles.inativo : ""}`}>
                        <td>
                          <img src={med.imagem || imagemPadrao} alt={med.nome} className={styles.medicamentoImagem} onError={(e) => { e.target.src = imagemPadrao; }} />
                        </td>
                        <td>
                          <div className={styles.nomeContainer}>
                            <span className={styles.nome}>{med.nome}</span>
                            <span className={styles.categoria}>{med.categoria}</span>
                          </div>
                        </td>
                        <td>{med.dosagem}</td>
                        <td>
                          <span className={styles.quantidade}>{`${med.quantidade} ${med.forma}`}</span>
                        </td>
                        <td>{med.laboratorio}</td>
                        <td>{currency.format(med.preco)}</td>
                        <td>
                          <span className={`${styles.status} ${med.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>
                            {med.status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.acoes}>
                            <button onClick={() => abrirDetalhes(med)} className={styles.botaoAcao} title="Ver detalhes" aria-label={`Ver detalhes de ${med.nome}`}>
                              Detalhes
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.gradeContainer}>
                  {medicamentosPaginados.map((med) => (
                    <div key={med.id} className={`${styles.medicamentoCard} ${med.status === "inativo" ? styles.inativo : ""}`}>
                      <div className={styles.cardHeader}>
                        <img src={med.imagem || imagemPadrao} alt={med.nome} className={styles.cardImagem} onError={(e) => { e.target.src = imagemPadrao; }} />
                        <span className={`${styles.cardStatus} ${med.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>
                          {med.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardNome}>{med.nome}</h3>
                        <p className={styles.cardDosagem}>{med.dosagem}</p>
                        <p className={styles.cardLaboratorio}>{med.laboratorio}</p>
                        <p className={styles.cardCategoria}>{med.categoria}</p>
                        <div className={styles.cardInfo}>
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Conteúdo:</span>
                            <span className={styles.infoValue}>{`${med.quantidade} ${med.forma}`}</span>
                          </div>
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Preço:</span>
                            <span className={styles.infoValue}>{currency.format(med.preco)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.cardActions}>
                        <button onClick={() => abrirDetalhes(med)} className={styles.botaoAcaoCard} title="Ver detalhes" aria-label={`Ver detalhes de ${med.nome}`}>
                          Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {totalPaginas > 1 && (
              <div className={styles.paginacao}>
                <button onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))} disabled={paginaAtual === 1} className={styles.botaoPaginacao}>
                  ← Anterior
                </button>
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let pagina;
                  if (totalPaginas <= 5) {
                    pagina = i + 1;
                  } else if (paginaAtual <= 3) {
                    pagina = i + 1;
                  } else if (paginaAtual >= totalPaginas - 2) {
                    pagina = totalPaginas - 4 + i;
                  } else {
                    pagina = paginaAtual - 2 + i;
                  }
                  return (
                    <button key={pagina} onClick={() => setPaginaAtual(pagina)} className={`${styles.botaoPaginacao} ${pagina === paginaAtual ? styles.paginaAtual : ""}`}>
                      {pagina}
                    </button>
                  );
                })}
                {totalPaginas > 5 && paginaAtual < totalPaginas - 2 && <span className={styles.pontos}>...</span>}
                {totalPaginas > 5 && paginaAtual < totalPaginas - 1 && (
                  <button onClick={() => setPaginaAtual(totalPaginas)} className={styles.botaoPaginacao}>
                    {totalPaginas}
                  </button>
                )}
                <button onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))} disabled={paginaAtual === totalPaginas} className={styles.botaoPaginacao}>
                  Próxima →
                </button>
              </div>
            )}
          </main>
        </div>

        {modalAberto && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Cadastrar Novo Medicamento</h2>
                <button onClick={fecharModal} className={styles.modalClose} aria-label="Fechar modal">
                  ✕
                </button>
              </div>
              <div className={styles.modalContent}>
                <p>Digite o código de barras do medicamento para verificar se já existe no sistema:</p>
                <div className={styles.codigoBarrasInput}>
                  <input type="text" placeholder="Digite o código de barras..." value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter") verificarCodigoBarras(); }} className={styles.input} />
                  <button onClick={verificarCodigoBarras} className={styles.botaoSecundario}>
                    Verificar
                  </button>
                </div>
                {erro && <p className={styles.erro}>{erro}</p>}
                {medicamentoExistente && (
                  <div className={styles.medicamentoExistente}>
                    <h3>Medicamento já cadastrado:</h3>
                    <div className={styles.existenteInfo}>
                      <img src={medicamentoExistente.imagem || imagemPadrao} alt={medicamentoExistente.nome} className={styles.existenteImagem} />
                      <div className={styles.existenteDetalhes}>
                        <p><strong>Nome:</strong> {medicamentoExistente.nome}</p>
                        <p><strong>Dosagem:</strong> {medicamentoExistente.dosagem}</p>
                        <p><strong>Laboratório:</strong> {medicamentoExistente.laboratorio}</p>
                        <p><strong>Status:</strong> <span className={medicamentoExistente.status === "ativo" ? styles.statusAtivo : styles.statusInativo}>
                          {medicamentoExistente.status === "ativo" ? "Ativo" : "Inativo"}
                        </span></p>
                      </div>
                    </div>
                    <button onClick={() => abrirDetalhes(medicamentoExistente)} className={styles.botaoPrincipal}>
                      Ver Detalhes
                    </button>
                  </div>
                )}
                {produtoNaoEncontrado && (
                  <div className={styles.produtoNaoEncontrado}>
                    <h3>Produto não encontrado no sistema</h3>
                    <p>Este código de barras não está cadastrado. Deseja cadastrar um novo medicamento?</p>
                    <div className={styles.modalActions}>
                      <button onClick={redirecionarParaCadastro} className={styles.botaoPrincipal}>
                        Cadastrar Novo Medicamento
                      </button>
                      <button onClick={fecharModal} className={styles.botaoSecundario}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                {!medicamentoExistente && !produtoNaoEncontrado && (
                  <div className={styles.modalActions}>
                    <button onClick={continuarCadastro} disabled={!codigoBarras.trim()} className={styles.botaoPrincipal}>
                      Continuar
                    </button>
                    <button onClick={fecharModal} className={styles.botaoSecundario}>
                      Cancelar
                    </button>
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
                <button onClick={fecharModalDetalhes} className={styles.modalClose} aria-label="Fechar detalhes">
                  ✕
                </button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.detalhesContainer}>
                  <div className={styles.detalhesImagem}>
                    <img src={medicamentoSelecionado.imagem || imagemPadrao} alt={medicamentoSelecionado.nome} className={styles.detalhesImg} onError={(e) => { e.target.src = imagemPadrao; }} />
                  </div>
                  <div className={styles.detalhesInfo}>
                    <h3>{medicamentoSelecionado.nome}</h3>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Dosagem:</span><span className={styles.infoValue}>{medicamentoSelecionado.dosagem}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Conteúdo:</span><span className={styles.infoValue}>{`${medicamentoSelecionado.quantidade} ${medicamentoSelecionado.forma}`}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Tipo:</span><span className={styles.infoValue}>{medicamentoSelecionado.tipo}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Forma:</span><span className={styles.infoValue}>{medicamentoSelecionado.forma}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Laboratório:</span><span className={styles.infoValue}>{medicamentoSelecionado.laboratorio}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Preço:</span><span className={styles.infoValue}>{currency.format(medicamentoSelecionado.preco)}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Categoria:</span><span className={styles.infoValue}>{medicamentoSelecionado.categoria}</span></div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Status:</span>
                        <span className={`${styles.infoValue} ${medicamentoSelecionado.status === "ativo" ? styles.statusAtivo : styles.statusInativo}`}>
                          {medicamentoSelecionado.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Data Cadastro:</span><span className={styles.infoValue}>{new Date(medicamentoSelecionado.dataCadastro).toLocaleDateString('pt-BR')}</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Última Atualização:</span><span className={styles.infoValue}>{new Date(medicamentoSelecionado.dataAtualizacao).toLocaleDateString('pt-BR')}</span></div>
                    </div>
                    {medicamentoSelecionado.descricao && (
                      <div className={styles.descricao}>
                        <span className={styles.infoLabel}>Descrição:</span>
                        <p>{medicamentoSelecionado.descricao}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button onClick={() => handleEditar(medicamentoSelecionado.id)} className={styles.botaoPrincipal}>
                    Editar
                  </button>
                  <button onClick={() => toggleStatus(medicamentoSelecionado.id)} className={styles.botaoSecundario}>
                    {medicamentoSelecionado.status === "ativo" ? " Desativar" : " Ativar"}
                  </button>
                  <button onClick={() => handleExcluir(medicamentoSelecionado.id)} className={styles.botaoPerigo}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default ListagemMedicamentos;