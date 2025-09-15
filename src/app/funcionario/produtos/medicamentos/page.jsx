"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";

const imagemPadrao =
  "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";

const currency =
  typeof Intl !== "undefined"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    : { format: (v) => `R$ ${Number(v).toFixed(2)}` };

const medicamentosIniciais = [
  {
    id: 1,
    nome: "Paracetamol",
    dosagem: "500mg",
    quantidade: 20,
    tipo: "Genérico",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "EMS",
    preco: 12.5,
    imagem: "",
    codigoBarras: "7891234567890",
    status: "ativo",
    categoria: "Analgésico",
    lote: "LOTE12345",
  },
  {
    id: 2,
    nome: "Dipirona Sódica",
    dosagem: "1g",
    quantidade: 3,
    tipo: "Similar",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "Neo Química",
    preco: 8.9,
    imagem: "",
    codigoBarras: "7890987654321",
    status: "ativo",
    categoria: "Analgésico",
    lote: "LOTE67890",
  },
  {
    id: 3,
    nome: "Omeprazol",
    dosagem: "20mg",
    quantidade: 0,
    tipo: "Referência",
    forma: "Cápsula",
    descricao: "Inibidor de bomba de prótons.",
    laboratorio: "AstraZeneca",
    preco: 25.9,
    imagem: "",
    codigoBarras: "7896543210987",
    status: "inativo",
    categoria: "Gastrointestinal",
    lote: "LOTE54321",
  },
  {
    id: 4,
    nome: "Amoxicilina",
    dosagem: "500mg",
    quantidade: 15,
    tipo: "Genérico",
    forma: "Cápsula",
    descricao: "Antibiótico de amplo espectro.",
    laboratorio: "Eurofarma",
    preco: 32.75,
    imagem: "",
    codigoBarras: "7895678901234",
    status: "ativo",
    categoria: "Antibiótico",
    lote: "LOTE98765",
  },
  {
    id: 5,
    nome: "Losartana Potássica",
    dosagem: "50mg",
    quantidade: 28,
    tipo: "Similar",
    forma: "Comprimido",
    descricao: "Anti-hipertensivo.",
    laboratorio: "Medley",
    preco: 18.2,
    imagem: "",
    codigoBarras: "7894321098765",
    status: "ativo",
    categoria: "Cardiovascular",
    lote: "LOTE13579",
  },
];

const bancoDeDados = {
  medicamentos: medicamentosIniciais,
  buscarPorCodigoBarras: function (codigo) {
    return this.medicamentos.find((med) => med.codigoBarras === codigo);
  },
};

function ListagemMedicamentos() {
  const [medicamentos, setMedicamentos] = useState(medicamentosIniciais);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [medicamentoExistente, setMedicamentoExistente] = useState(null);
  const [produtoNaoEncontrado, setProdutoNaoEncontrado] = useState(false);
  const [erro, setErro] = useState("");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [carregando, setCarregando] = useState(false);
  const [visualizacao, setVisualizacao] = useState("tabela");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      router.push("../../home");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("../../home");
    }
  };

  const categorias = useMemo(() => {
    const cats = [...new Set(medicamentos.map((m) => m.categoria))];
    return ["todos", ...cats];
  }, [medicamentos]);

  const medicamentosFiltrados = useMemo(() => {
    setCarregando(true);
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
        case "nome":
          return a.nome.localeCompare(b.nome);
        case "quantidade":
          return b.quantidade - a.quantidade;
        case "preco":
          return b.preco - a.preco;
        case "laboratorio":
          return a.laboratorio.localeCompare(b.laboratorio);
        default:
          return 0;
      }
    });
    setTimeout(() => setCarregando(false), 200);
    return resultado;
  }, [medicamentos, termoPesquisa, filtroStatus, filtroCategoria, ordenacao]);

  const totalPaginas = Math.ceil(medicamentosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const medicamentosPaginados = medicamentosFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      setMedicamentos(medicamentos.filter((med) => med.id !== id));
      if (modalDetalhesAberto && medicamentoSelecionado?.id === id) {
        setModalDetalhesAberto(false);
        setMedicamentoSelecionado(null);
      }
    }
  };

  const toggleStatus = (id) => {
    setMedicamentos(
      medicamentos.map((med) =>
        med.id === id
          ? { ...med, status: med.status === "ativo" ? "inativo" : "ativo" }
          : med
      )
    );
    if (medicamentoSelecionado && medicamentoSelecionado.id === id) {
      setMedicamentoSelecionado({
        ...medicamentoSelecionado,
        status: medicamentoSelecionado.status === "ativo" ? "inativo" : "ativo",
      });
    }
  };

  const handleEditar = (id) => {
    router.push(`/funcionario/produtos/medicamentos/editar/${id}`);
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
    setCodigoBarras("");
    setMedicamentoExistente(null);
    setProdutoNaoEncontrado(false);
    setErro("");
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
    const medicamento = bancoDeDados.buscarPorCodigoBarras(codigoBarras);
    if (medicamento) {
      setMedicamentoExistente(medicamento);
      setProdutoNaoEncontrado(false);
      setErro("");
    } else {
      setProdutoNaoEncontrado(true);
      setMedicamentoExistente(null);
      setErro("");
    }
  };

  const continuarCadastro = () => {
    router.push(
      `/funcionario/produtos/medicamentos/precadastro?codigoBarras=${codigoBarras}`
    );
  };

  const redirecionarParaCadastro = () => {
    router.push(
      `/funcionario/produtos/medicamentos/cadastro?codigoBarras=${codigoBarras}`
    );
  };

  const handleItensPorPaginaChange = (e) => {
    setItensPorPagina(Number(e.target.value));
    setPaginaAtual(1);
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Alternar menu"
          >
            ☰
          </button>
          <h1 className={styles.titulo}>Gestão de Medicamentos</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Pesquisar medicamentos..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            {termoPesquisa && (
              <button
                className={styles.limparPesquisa}
                onClick={() => setTermoPesquisa("")}
                aria-label="Limpar pesquisa"
              >
                ×
              </button>
            )}
          </div>
          <button onClick={abrirModal} className={styles.botaoPrincipal}>
            ➕ Novo Medicamento
          </button>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>
          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>

              <Link
                href="/funcionario/produtos/medicamentos"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Medicamentos</span>
              </Link>
              <Link
                href="/funcionario/laboratorio/lista"
                className={styles.navLink}
              >
                <span className={styles.navText}>Laboratórios</span>
              </Link>
            </div>

            {/* Seção de Sessão com botão de logout */}
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Sessão</p>
              <button
                onClick={handleLogout}
                className={styles.navLink}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span className={styles.navText}>Sair</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          {/* Filtros e Controles */}
          <div className={styles.controles}>
            <div className={styles.filtros}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewButton} ${
                    visualizacao === "tabela" ? styles.active : ""
                  }`}
                  onClick={() => setVisualizacao("tabela")}
                  title="Visualização em tabela"
                  aria-label="Visualização em tabela"
                >
                  ≡
                </button>
                <button
                  className={`${styles.viewButton} ${
                    visualizacao === "grade" ? styles.active : ""
                  }`}
                  onClick={() => setVisualizacao("grade")}
                  title="Visualização em grade"
                  aria-label="Visualização em grade"
                >
                  ◼︎
                </button>
              </div>
              <div className={styles.filtroGroup}>
                <label>Status:</label>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className={styles.selectFiltro}
                >
                  <option value="todos">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>
              <div className={styles.filtroGroup}>
                <label>Categoria:</label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className={styles.selectFiltro}
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "todos" ? "Todas" : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.filtroGroup}>
                <label>Ordenar por:</label>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className={styles.selectFiltro}
                >
                  <option value="nome">Nome</option>
                  <option value="quantidade">Quantidade</option>
                  <option value="preco">Preço</option>
                  <option value="laboratorio">Laboratório</option>
                </select>
              </div>
              <div className={styles.filtroGroup}>
                <label>Itens por página:</label>
                <select
                  value={itensPorPagina}
                  onChange={handleItensPorPaginaChange}
                  className={styles.selectFiltro}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <div className={styles.infoResultados}>
              Exibindo {medicamentosPaginados.length} de{" "}
              {medicamentosFiltrados.length} medicamentos
            </div>
          </div>

          {/* Tabela de Medicamentos */}
          <div className={styles.tableContainer}>
            {carregando ? (
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
                    <th>Quantidade</th>
                    <th>Laboratório</th>
                    <th>Preço</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentosPaginados.map((medicamento) => (
                    <tr key={medicamento.id}>
                      <td>
                        <img
                          src={
                            medicamento.imagem
                              ? medicamento.imagem
                              : imagemPadrao
                          }
                          alt={medicamento.nome}
                          className={styles.imagemTabela}
                          onError={(e) => {
                            e.target.src = imagemPadrao;
                          }}
                        />
                      </td>
                      <td>
                        <span
                          className={styles.nomeLink}
                          onClick={() => abrirDetalhes(medicamento)}
                        >
                          {medicamento.nome}
                        </span>
                      </td>
                      <td>{medicamento.dosagem}</td>
                      <td>
                        <span
                          className={`${styles.quantidade} ${
                            medicamento.quantidade === 0
                              ? styles.quantidadeZero
                              : medicamento.quantidade <= 5
                              ? styles.quantidadeBaixa
                              : ""
                          }`}
                        >
                          {medicamento.quantidade}
                        </span>
                      </td>
                      <td>{medicamento.laboratorio}</td>
                      <td>{currency.format(medicamento.preco)}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            medicamento.status === "ativo"
                              ? styles.statusAtivo
                              : styles.statusInativo
                          }`}
                        >
                          {medicamento.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.acoes}>
                          <button
                            onClick={() => abrirDetalhes(medicamento)}
                            className={styles.botaoAcao}
                            title="Ver detalhes"
                            aria-label="Ver detalhes"
                          >
                            Detalhes
                          </button>
                          {/* <button
                            onClick={() => handleEditar(medicamento.id)}
                            className={styles.botaoAcao}
                            title="Editar"
                            aria-label="Editar"
                          >
                           
                          </button>
                          <button
                            onClick={() => handleExcluir(medicamento.id)}
                            className={styles.botaoAcao}
                            title="Excluir"
                            aria-label="Excluir"
                          >
                            🗑️
                          </button>
                          <button
                            onClick={() => toggleStatus(medicamento.id)}
                            className={styles.botaoAcao}
                            title={
                              medicamento.status === "ativo"
                                ? "Desativar"
                                : "Ativar"
                            }
                            aria-label={
                              medicamento.status === "ativo"
                                ? "Desativar"
                                : "Ativar"
                            }
                          >
                            {medicamento.status === "ativo" ? "⏸️" : "▶️"}
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.gradeMedicamentos}>
                {medicamentosPaginados.map((medicamento) => (
                  <div key={medicamento.id} className={styles.cardMedicamento}>
                    <div className={styles.cardImagemContainer}>
                      <img
                        src={
                          medicamento.imagem ? medicamento.imagem : imagemPadrao
                        }
                        alt={medicamento.nome}
                        className={styles.cardImagem}
                        onError={(e) => {
                          e.target.src = imagemPadrao;
                        }}
                      />
                      <span
                        className={`${styles.cardStatus} ${
                          medicamento.status === "ativo"
                            ? styles.cardStatusAtivo
                            : styles.cardStatusInativo
                        }`}
                      >
                        {medicamento.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <div className={styles.cardContent}>
                      <h3
                        className={styles.cardNome}
                        onClick={() => abrirDetalhes(medicamento)}
                      >
                        {medicamento.nome}
                      </h3>
                      <p className={styles.cardDosagem}>
                        {medicamento.dosagem}
                      </p>
                      <p className={styles.cardLaboratorio}>
                        {medicamento.laboratorio}
                      </p>
                      <div className={styles.cardInfo}>
                        <span
                          className={`${styles.cardQuantidade} ${
                            medicamento.quantidade === 0
                              ? styles.quantidadeZero
                              : medicamento.quantidade <= 5
                              ? styles.quantidadeBaixa
                              : ""
                          }`}
                        >
                          {medicamento.quantidade} unidades
                        </span>
                        <span className={styles.cardPreco}>
                          {currency.format(medicamento.preco)}
                        </span>
                      </div>
                      <div className={styles.cardAcoes}>
                        <button
                          onClick={() => abrirDetalhes(medicamento)}
                          className={styles.botaoAcao}
                          title="Ver detalhes"
                          aria-label="Ver detalhes"
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => handleEditar(medicamento.id)}
                          className={styles.botaoAcao}
                          title="Editar"
                          aria-label="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleExcluir(medicamento.id)}
                          className={styles.botaoAcao}
                          title="Excluir"
                          aria-label="Excluir"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => toggleStatus(medicamento.id)}
                          className={styles.botaoAcao}
                          title={
                            medicamento.status === "ativo"
                              ? "Desativar"
                              : "Ativar"
                          }
                          aria-label={
                            medicamento.status === "ativo"
                              ? "Desativar"
                              : "Ativar"
                          }
                        >
                          {medicamento.status === "ativo" ? "⏸️" : "▶️"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paginação */}
          {medicamentosFiltrados.length > 0 && (
            <div className={styles.paginacao}>
              <button
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
                className={styles.botaoPaginacao}
              >
                Anterior
              </button>
              <span className={styles.infoPagina}>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))
                }
                disabled={paginaAtual === totalPaginas}
                className={styles.botaoPaginacao}
              >
                Próxima
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Código de Barras */}
      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Medicamento</h2>
              <button
                onClick={fecharModal}
                className={styles.modalClose}
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <p>
                Digite o código de barras do medicamento para verificar se já
                existe no sistema:
              </p>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Código de Barras"
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  className={styles.input}
                />
                <button
                  onClick={verificarCodigoBarras}
                  className={styles.botaoSecundario}
                >
                  Verificar
                </button>
              </div>
              {erro && <p className={styles.erro}>{erro}</p>}
              {medicamentoExistente && (
                <div className={styles.medicamentoExistente}>
                  <p>
                    <strong>Medicamento já cadastrado:</strong>{" "}
                    {medicamentoExistente.nome} - {medicamentoExistente.dosagem}
                  </p>
                  <p>
                    <strong>Laboratório:</strong>{" "}
                    {medicamentoExistente.laboratorio}
                  </p>
                  <p>
                    <strong>Quantidade em estoque:</strong>{" "}
                    {medicamentoExistente.quantidade}
                  </p>
                  <button
                    onClick={() => abrirDetalhes(medicamentoExistente)}
                    className={styles.botaoPrincipal}
                  >
                    Ver Detalhes
                  </button>
                </div>
              )}
              {produtoNaoEncontrado && (
                <div className={styles.produtoNaoEncontrado}>
                  <p>Produto não encontrado no sistema.</p>
                  <p>Deseja cadastrar um novo medicamento?</p>
                  <div className={styles.modalAcoes}>
                    <button
                      onClick={redirecionarParaCadastro}
                      className={styles.botaoPrincipal}
                    >
                      Cadastrar Novo Medicamento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {modalDetalhesAberto && medicamentoSelecionado && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Detalhes do Medicamento</h2>
              <button
                onClick={fecharModalDetalhes}
                className={styles.modalClose}
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContentDetalhes}>
              <div className={styles.detalhesImagemContainer}>
                <img
                  src={
                    medicamentoSelecionado.imagem
                      ? medicamentoSelecionado.imagem
                      : imagemPadrao
                  }
                  alt={medicamentoSelecionado.nome}
                  className={styles.detalhesImagem}
                  onError={(e) => {
                    e.target.src = imagemPadrao;
                  }}
                />
              </div>
              <div className={styles.detalhesInfo}>
                <h3>{medicamentoSelecionado.nome}</h3>
                <div className={styles.detalhesGrid}>
                  <div className={styles.detalhesItem}>
                    <strong>Dosagem:</strong> {medicamentoSelecionado.dosagem}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Quantidade:</strong>{" "}
                    <span
                      className={`${styles.quantidade} ${
                        medicamentoSelecionado.quantidade === 0
                          ? styles.quantidadeZero
                          : medicamentoSelecionado.quantidade <= 5
                          ? styles.quantidadeBaixa
                          : ""
                      }`}
                    >
                      {medicamentoSelecionado.quantidade}
                    </span>
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Tipo:</strong> {medicamentoSelecionado.tipo}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Forma Farmacêutica:</strong>{" "}
                    {medicamentoSelecionado.forma}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Laboratório:</strong>{" "}
                    {medicamentoSelecionado.laboratorio}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Preço:</strong>{" "}
                    {currency.format(medicamentoSelecionado.preco)}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Código de Barras:</strong>{" "}
                    {medicamentoSelecionado.codigoBarras}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${styles.status} ${
                        medicamentoSelecionado.status === "ativo"
                          ? styles.statusAtivo
                          : styles.statusInativo
                      }`}
                    >
                      {medicamentoSelecionado.status === "ativo"
                        ? "Ativo"
                        : "Inativo"}
                    </span>
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Categoria:</strong>{" "}
                    {medicamentoSelecionado.categoria}
                  </div>
                  <div className={styles.detalhesItem}>
                    <strong>Lote:</strong> {medicamentoSelecionado.lote}
                  </div>
                </div>
                <div className={styles.detalhesDescricao}>
                  <strong>Descrição:</strong> {medicamentoSelecionado.descricao}
                </div>
              </div>
            </div>
            <div className={styles.modalAcoes}>
              <button
                onClick={() => handleEditar(medicamentoSelecionado.id)}
                className={styles.botaoPrincipal}
              >
                Editar
              </button>
              <button
                onClick={() => handleExcluir(medicamentoSelecionado.id)}
                className={styles.botaoPerigo}
              >
                Excluir
              </button>
              <button
                onClick={() => toggleStatus(medicamentoSelecionado.id)}
                className={styles.botaoSecundario}
              >
                {medicamentoSelecionado.status === "ativo"
                  ? "Desativar"
                  : "Ativar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListagemMedicamentos;
