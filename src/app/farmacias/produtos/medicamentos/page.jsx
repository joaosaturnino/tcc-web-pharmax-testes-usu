"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css"; // CORREÇÃO: caminho relativo

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
    codigoBarras: "7891234567890"
  },
  {
    id: 2,
    nome: "Dipirona",
    dosagem: "1g",
    quantidade: 10,
    tipo: "Similar",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "Neo Química",
    preco: 8.9,
    imagem: "",
    codigoBarras: "7890987654321"
  },
];

// Simulação de banco de dados
const bancoDeDados = {
  medicamentos: medicamentosIniciais,
  buscarPorCodigoBarras: function(codigo) {
    return this.medicamentos.find(med => med.codigoBarras === codigo);
  }
};

function ListagemMedicamentos() {
  const [medicamentos, setMedicamentos] = useState(medicamentosIniciais);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [medicamentoExistente, setMedicamentoExistente] = useState(null);
  const [produtoNaoEncontrado, setProdutoNaoEncontrado] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      setMedicamentos(medicamentos.filter((med) => med.id !== id));
    }
  };

  const handleEditar = (id) => {
    router.push(`/farmacias/produtos/medicamentos/editar/${id}`);
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

  const verificarCodigoBarras = () => {
    // Validação básica
    if (!codigoBarras.trim()) {
      setErro("Por favor, digite um código de barras válido.");
      return;
    }

    // Simulação de busca no banco de dados
    const medicamento = bancoDeDados.buscarPorCodigoBarras(codigoBarras);
    
    if (medicamento) {
      setMedicamentoExistente(medicamento);
      setProdutoNaoEncontrado(false);
      setErro("");
    } else {
      // Se não encontrado, mostra mensagem de produto não encontrado
      setProdutoNaoEncontrado(true);
      setMedicamentoExistente(null);
      setErro("");
    }
  };

  const continuarCadastro = () => {
    router.push(`/farmacias/produtos/medicamentos/precadastro?codigoBarras=${codigoBarras}`);
  };

  const redirecionarParaCadastro = () => {
    router.push(`/farmacias/produtos/medicamentos/cadastro?codigoBarras=${codigoBarras}`);
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
          <h1 className={styles.titulo}> Painel de Medicamentos</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={abrirModal}
            className={styles.botaoPrincipal}
          >
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
              ✕ {/* CORREÇÃO: ícone melhor */}
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
          </nav>
        </aside>

        {/* Overlay para mobile - CORREÇÃO: condicional correto */}
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <h3>{medicamentos.length}</h3>
                <p>Total de Medicamentos</p>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {medicamentos.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Nenhum medicamento cadastrado</h3>
                <p>Comece cadastrando seu primeiro medicamento.</p>
                <button
                  onClick={abrirModal}
                  className={styles.botaoPrincipal}
                >
                  ➕ Novo Medicamento
                </button>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.tabela}>
                  <thead>
                    <tr>
                      <th>Imagem</th>
                      <th>Nome</th>
                      <th>Dosagem</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                      <th>Tipo</th>
                      <th>Forma</th>
                      <th>Laboratório</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicamentos.map((med) => (
                      <tr key={med.id} className={styles.tableRow}>
                        <td>
                          <img
                            src={med.imagem || imagemPadrao}
                            alt={med.nome}
                            className={styles.imgThumb}
                            onError={(e) => {
                              e.target.src = imagemPadrao;
                            }}
                          />
                        </td>
                        <td>
                          <span className={styles.medName}>{med.nome}</span>
                        </td>
                        <td>
                          <span className={styles.medDosage}>
                            {med.dosagem}
                          </span>
                        </td>
                        <td>
                          <span className={styles.medQuantity}>
                            {med.quantidade}
                          </span>
                        </td>
                        <td className={styles.money}>
                          {currency.format(Number(med.preco ?? 0))}
                        </td>
                        <td>
                          <span className={styles.medType}>{med.tipo}</span>
                        </td>
                        <td>
                          <span className={styles.medForm}>{med.forma}</span>
                        </td>
                        <td>
                          <span className={styles.medLab}>
                            {med.laboratorio}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={`${styles.botao} ${styles.botaoEditar}`}
                              onClick={() => handleEditar(med.id)}
                              title="Editar medicamento"
                            >
                              ✏️
                            </button>
                            <button
                              className={`${styles.botao} ${styles.botaoExcluir}`}
                              onClick={() => handleExcluir(med.id)}
                              title="Excluir medicamento"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <input
                    type="text"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    className={styles.inputCodigo}
                    placeholder="Código de barras"
                    autoFocus
                  />
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
                      <p>{medicamentoExistente.dosagem} - {medicamentoExistente.laboratorio}</p>
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
                onClick={medicamentoExistente ? continuarCadastro : produtoNaoEncontrado ? redirecionarParaCadastro : verificarCodigoBarras}
              >
                {medicamentoExistente ? "Continuar" : produtoNaoEncontrado ? "Cadastrar" : "Verificar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListagemMedicamentos;