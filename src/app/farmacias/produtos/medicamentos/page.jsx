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

// Dados iniciais de exemplo mais completos
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

// Simulação de banco de dados
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
  const [visualizacao, setVisualizacao] = useState("tabela"); // 'tabela' ou 'grade'
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const router = useRouter();

  // Extrair categorias únicas
  const categorias = useMemo(() => {
    const cats = [...new Set(medicamentos.map((m) => m.categoria))];
    return ["todos", ...cats];
  }, [medicamentos]);

  // Filtros e ordenação
  const medicamentosFiltrados = useMemo(() => {
    setCarregando(true);

    let resultado = [...medicamentos];

    // Filtro por pesquisa
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

    // Filtro por status
    if (filtroStatus !== "todos") {
      resultado = resultado.filter((med) => med.status === filtroStatus);
    }

    // Filtro por categoria
    if (filtroCategoria !== "todos") {
      resultado = resultado.filter((med) => med.categoria === filtroCategoria);
    }

    // Ordenação
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

    // Simular carregamento
    setTimeout(() => setCarregando(false), 200);

    return resultado;
  }, [medicamentos, termoPesquisa, filtroStatus, filtroCategoria, ordenacao]);

  // Paginação
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
      `/farmacias/produtos/medicamentos/precadastro?codigoBarras=${codigoBarras}`
    );
  };

  const redirecionarParaCadastro = () => {
    router.push(
      `/farmacias/produtos/medicamentos/cadastro?codigoBarras=${codigoBarras}`
    );
  };

  const handleItensPorPaginaChange = (e) => {
    setItensPorPagina(Number(e.target.value));
    setPaginaAtual(1); // Reset para a primeira página
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
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
        {/* Sidebar Não Fixa */}
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
            >
              ✕
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a href="/farmacias/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a
                href="/farmacias/produtos/medicamentos"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Medicamentos</span>
              </a>
              
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className={styles.navLink}
              >
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
              
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Relatórios</p>
              <a href="/farmacias/relatorios" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a
                href="/farmacias/relatorios/estoque"
                className={styles.navLink}
              >
                <span className={styles.navText}>Estoque</span>
              </a>
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
                >
                  ≡
                </button>
                <button
                  className={`${styles.viewButton} ${
                    visualizacao === "grade" ? styles.active : ""
                  }`}
                  onClick={() => setVisualizacao("grade")}
                  title="Visualização em grade"
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
            ) : medicamentosFiltrados.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Nenhum medicamento encontrado</h3>
                <p>
                  {termoPesquisa
                    ? `Não encontramos resultados para "${termoPesquisa}"`
                    : "Comece cadastrando seu primeiro medicamento."}
                </p>
                <button onClick={abrirModal} className={styles.botaoPrincipal}>
                  ➕ Novo Medicamento
                </button>
              </div>
            ) : visualizacao === "tabela" ? (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.tabela}>
                    <thead>
                      <tr>
                        <th>Medicamento</th>
                        <th>Dosagem</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicamentosPaginados.map((med) => (
                        <tr
                          key={med.id}
                          className={`${styles.tableRow} ${
                            med.status === "inativo" ? styles.rowInativo : ""
                          }`}
                        >
                          <td>
                            <div
                              className={styles.medInfo}
                              onClick={() => abrirDetalhes(med)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className={styles.medInfoTop}>
                                <img
                                  src={med.imagem || imagemPadrao}
                                  alt={med.nome}
                                  className={styles.imgThumb}
                                  onError={(e) => {
                                    e.target.src = imagemPadrao;
                                  }}
                                />
                                <div>
                                  <span className={styles.medName}>
                                    {med.nome}
                                  </span>
                                  <span className={styles.medLab}>
                                    {med.laboratorio}
                                  </span>
                                  <span className={styles.medCodigo}>
                                    {med.codigoBarras}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={styles.medDosage}>
                              {med.dosagem}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`${styles.medQuantity} ${
                                med.quantidade <= 5 ? styles.estoqueBaixo : ""
                              }`}
                            >
                              {med.quantidade}
                              {med.quantidade <= 5 && (
                                <span
                                  className={styles.alertaEstoque}
                                  title="Estoque baixo"
                                >
                                  ⚠️
                                </span>
                              )}
                            </span>
                          </td>
                          <td className={styles.money}>
                            {currency.format(Number(med.preco ?? 0))}
                          </td>
                          <td>
                            <span className={styles.medCategory}>
                              {med.categoria}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleStatus(med.id)}
                              className={`${styles.statusBadge} ${
                                med.status === "ativo"
                                  ? styles.statusAtivo
                                  : styles.statusInativo
                              }`}
                            >
                              {med.status === "ativo" ? "Ativo" : "Inativo"}
                            </button>
                          </td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={`${styles.botao} ${styles.botaoDetalhes}`}
                                onClick={() => abrirDetalhes(med)}
                                title="Ver detalhes"
                              >
                                Informes
                              </button>
                              {/* <button
                                className={`${styles.botao} ${styles.botaoEditar}`}
                                onClick={() => handleEditar(med.id)}
                                title="Editar medicamento"
                              >
                                ✏️
                              </button> */}
                              {/* <button
                                className={`${styles.botao} ${styles.botaoExcluir}`}
                                onClick={() => handleExcluir(med.id)}
                                title="Excluir medicamento"
                              >
                                🗑️
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                  <div className={styles.paginacao}>
                    <button
                      onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                      disabled={paginaAtual === 1}
                      className={styles.botaoPagina}
                    >
                      &laquo; Anterior
                    </button>

                    {Array.from(
                      { length: Math.min(5, totalPaginas) },
                      (_, i) => {
                        let paginaNum;
                        if (totalPaginas <= 5) {
                          paginaNum = i + 1;
                        } else if (paginaAtual <= 3) {
                          paginaNum = i + 1;
                        } else if (paginaAtual >= totalPaginas - 2) {
                          paginaNum = totalPaginas - 4 + i;
                        } else {
                          paginaNum = paginaAtual - 2 + i;
                        }

                        return (
                          <button
                            key={paginaNum}
                            onClick={() => setPaginaAtual(paginaNum)}
                            className={`${styles.botaoPagina} ${
                              paginaAtual === paginaNum
                                ? styles.paginaAtual
                                : ""
                            }`}
                          >
                            {paginaNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
                      }
                      disabled={paginaAtual === totalPaginas}
                      className={styles.botaoPagina}
                    >
                      Próxima &raquo;
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Visualização em Grade
              <div className={styles.gridContainer}>
                {medicamentosPaginados.map((med) => (
                  <div
                    key={med.id}
                    className={`${styles.medCard} ${
                      med.status === "inativo" ? styles.cardInativo : ""
                    }`}
                  >
                    <div className={styles.cardHeader}>
                      <img
                        src={med.imagem || imagemPadrao}
                        alt={med.nome}
                        className={styles.cardImage}
                        onError={(e) => {
                          e.target.src = imagemPadrao;
                        }}
                      />
                      <div className={styles.cardStatus}>
                        <button
                          onClick={() => toggleStatus(med.id)}
                          className={`${styles.statusBadge} ${
                            med.status === "ativo"
                              ? styles.statusAtivo
                              : styles.statusInativo
                          }`}
                        >
                          {med.status === "ativo" ? "Ativo" : "Inativo"}
                        </button>
                      </div>
                    </div>

                    <div
                      className={styles.cardBody}
                      onClick={() => abrirDetalhes(med)}
                    >
                      <h3 className={styles.cardTitle}>{med.nome}</h3>
                      <p className={styles.cardLab}>{med.laboratorio}</p>
                      <p className={styles.cardDosage}>
                        {med.dosagem} • {med.forma}
                      </p>

                      <div className={styles.cardDetails}>
                        <div className={styles.cardDetail}>
                          <span className={styles.detailLabel}>
                            Quantidade:
                          </span>
                          <span
                            className={`${styles.detailValue} ${
                              med.quantidade <= 5 ? styles.estoqueBaixo : ""
                            }`}
                          >
                            {med.quantidade}
                          </span>
                        </div>
                        <div className={styles.cardDetail}>
                          <span className={styles.detailLabel}>Preço:</span>
                          <span className={styles.detailValue}>
                            {currency.format(Number(med.preco ?? 0))}
                          </span>
                        </div>
                        <div className={styles.cardDetail}>
                          <span className={styles.detailLabel}>Categoria:</span>
                          <span className={styles.detailValue}>
                            {med.categoria}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      <button
                        className={`${styles.botao} ${styles.botaoDetalhes}`}
                        onClick={() => abrirDetalhes(med)}
                        title="Ver detalhes"
                      >
                        👁️ Detalhes
                      </button>
                      <button
                        className={`${styles.botao} ${styles.botaoEditar}`}
                        onClick={() => handleEditar(med.id)}
                        title="Editar medicamento"
                      >
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Código de Barras */}
      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Medicamento</h2>
              <button className={styles.modalClose} onClick={fecharModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {!medicamentoExistente && !produtoNaoEncontrado ? (
                <>
                  <p>Digite o código de barras do medicamento:</p>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      value={codigoBarras}
                      onChange={(e) => setCodigoBarras(e.target.value)}
                      className={styles.inputCodigo}
                      placeholder="Código de barras"
                      autoFocus
                      onKeyPress={(e) =>
                        e.key === "Enter" && verificarCodigoBarras()
                      }
                    />
                    <button
                      className={styles.botaoSecundario}
                      onClick={verificarCodigoBarras}
                    >
                      Verificar
                    </button>
                  </div>
                  {erro && <p className={styles.erro}>{erro}</p>}
                </>
              ) : medicamentoExistente ? (
                <>
                  <p className={styles.aviso}>
                    Este medicamento já está cadastrado:
                  </p>
                  <div className={styles.medicamentoInfo}>
                    <img
                      src={medicamentoExistente.imagem || imagemPadrao}
                      alt={medicamentoExistente.nome}
                      className={styles.imgThumbModal}
                      onError={(e) => {
                        e.target.src = imagemPadrao;
                      }}
                    />
                    <div>
                      <h3>{medicamentoExistente.nome}</h3>
                      <p>
                        {medicamentoExistente.dosagem} -{" "}
                        {medicamentoExistente.laboratorio}
                      </p>
                      <p className={styles.medCodigoModal}>
                        Código: {medicamentoExistente.codigoBarras}
                      </p>
                    </div>
                  </div>
                  <p className={styles.pergunta}>
                    Deseja continuar com o cadastro?
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.aviso}>
                    Produto não encontrado em nossa base de dados.
                  </p>
                  <p>Deseja cadastrar este novo medicamento?</p>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.botao} ${styles.botaoSecundario}`}
                onClick={fecharModal}
              >
                Cancelar
              </button>
              <button
                className={`${styles.botao} ${styles.botaoPrincipal}`}
                onClick={
                  medicamentoExistente
                    ? continuarCadastro
                    : produtoNaoEncontrado
                    ? redirecionarParaCadastro
                    : verificarCodigoBarras
                }
              >
                {medicamentoExistente
                  ? "Continuar"
                  : produtoNaoEncontrado
                  ? "Cadastrar"
                  : "Verificar"}
              </button>
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
                className={styles.modalClose}
                onClick={fecharModalDetalhes}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detalhesMedicamento}>
                <div className={styles.detalhesImagem}>
                  <img
                    src={medicamentoSelecionado.imagem || imagemPadrao}
                    alt={medicamentoSelecionado.nome}
                    className={styles.imgDetalhes}
                    onError={(e) => {
                      e.target.src = imagemPadrao;
                    }}
                  />
                </div>

                <div className={styles.detalhesInfo}>
                  <h3>{medicamentoSelecionado.nome}</h3>
                  <p className={styles.detalhesLab}>
                    {medicamentoSelecionado.laboratorio}
                  </p>

                  <div className={styles.detalhesGrid}>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>Dosagem:</span>
                      <span className={styles.detalhesValue}>
                        {medicamentoSelecionado.dosagem}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>
                        Forma Farmacêutica:
                      </span>
                      <span className={styles.detalhesValue}>
                        {medicamentoSelecionado.forma}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>Tipo:</span>
                      <span className={styles.detalhesValue}>
                        {medicamentoSelecionado.tipo}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>Categoria:</span>
                      <span className={styles.detalhesValue}>
                        {medicamentoSelecionado.categoria}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>
                        Quantidade em Estoque:
                      </span>
                      <span
                        className={`${styles.detalhesValue} ${
                          medicamentoSelecionado.quantidade <= 5
                            ? styles.estoqueBaixo
                            : ""
                        }`}
                      >
                        {medicamentoSelecionado.quantidade} unidades
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>Preço:</span>
                      <span className={styles.detalhesValue}>
                        {currency.format(
                          Number(medicamentoSelecionado.preco ?? 0)
                        )}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>
                        Código de Barras:
                      </span>
                      <span className={styles.detalhesValue}>
                        {medicamentoSelecionado.codigoBarras}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>Lote:</span>
                      <span className={styles.detalhesValue}>
                        {medicamentoSelecionado.lote || "N/A"}
                      </span>
                    </div>
                    <div className={styles.detalhesItem}>
                      <span className={styles.detalhesLabel}>Status:</span>
                      <span className={styles.detalhesValue}>
                        <button
                          onClick={() => {
                            toggleStatus(medicamentoSelecionado.id);
                            setMedicamentoSelecionado({
                              ...medicamentoSelecionado,
                              status:
                                medicamentoSelecionado.status === "ativo"
                                  ? "inativo"
                                  : "ativo",
                            });
                          }}
                          className={`${styles.statusBadge} ${
                            medicamentoSelecionado.status === "ativo"
                              ? styles.statusAtivo
                              : styles.statusInativo
                          }`}
                        >
                          {medicamentoSelecionado.status === "ativo"
                            ? "Ativo"
                            : "Inativo"}
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className={styles.detalhesItemFull}>
                    <span className={styles.detalhesLabel}>Descrição:</span>
                    <p className={styles.detalhesDescricao}>
                      {medicamentoSelecionado.descricao}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.botao} ${styles.botaoExcluir}`}
                onClick={() => handleExcluir(med.id)}
                title="Excluir medicamento"
              >
                🗑️
              </button>
              <button
                className={`${styles.botao} ${styles.botaoPrincipal}`}
                onClick={() => {
                  fecharModalDetalhes();
                  handleEditar(medicamentoSelecionado.id);
                }}
              >
                ✏️ Editar Medicamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListagemMedicamentos;
