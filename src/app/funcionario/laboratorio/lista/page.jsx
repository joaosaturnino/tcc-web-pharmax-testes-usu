"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./laboratorio.module.css";

// Função para formatar CNPJ
const formatarCnpj = (value) => {
  const cnpjLimpo = value.replace(/\D/g, '');
  const cnpjLimitado = cnpjLimpo.slice(0, 14);
  
  if (cnpjLimitado.length <= 2) {
    return cnpjLimitado;
  } else if (cnpjLimitado.length <= 5) {
    return `${cnpjLimitado.slice(0, 2)}.${cnpjLimitado.slice(2)}`;
  } else if (cnpjLimitado.length <= 8) {
    return `${cnpjLimitado.slice(0, 2)}.${cnpjLimitado.slice(2, 5)}.${cnpjLimitado.slice(5)}`;
  } else if (cnpjLimitado.length <= 12) {
    return `${cnpjLimitado.slice(0, 2)}.${cnpjLimitado.slice(2, 5)}.${cnpjLimitado.slice(5, 8)}/${cnpjLimitado.slice(8)}`;
  } else {
    return `${cnpjLimitado.slice(0, 2)}.${cnpjLimitado.slice(2, 5)}.${cnpjLimitado.slice(5, 8)}/${cnpjLimitado.slice(8, 12)}-${cnpjLimitado.slice(12, 14)}`;
  }
};

// Função para validar CNPJ
const validarCnpj = (cnpj) => {
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

// Dados iniciais de exemplo
const laboratoriosIniciais = [
  {
    id: 1,
    nome: "LabVida",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Flores, 123, Centro",
    telefone: "(11) 9999-9999",
    email: "contato@labvida.com",
    status: "Ativo",
    dataCadastro: "2023-01-15",
  },
  {
    id: 2,
    nome: "BioPharma",
    cnpj: "98.765.432/0001-10",
    endereco: "Av. Paulista, 456, Bela Vista",
    telefone: "(21) 9888-8888",
    email: "vendas@biopharma.com",
    status: "Ativo",
    dataCadastro: "2023-02-20",
  },
  {
    id: 3,
    nome: "PharmaTech",
    cnpj: "11.223.344/0001-55",
    endereco: "Rua da Consolação, 789, Consolação",
    telefone: "(31) 9777-7777",
    email: "info@pharmatech.com",
    status: "Inativo",
    dataCadastro: "2023-03-10",
  },
];

export default function ListaLaboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [cnpj, setCnpj] = useState("");
  const [laboratorioExistente, setLaboratorioExistente] = useState(null);
  const [laboratorioNaoEncontrado, setLaboratorioNaoEncontrado] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  // Carregar laboratórios do localStorage na inicialização
  useEffect(() => {
    const carregarLaboratorios = () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const laboratoriosSalvos = localStorage.getItem("laboratorios");
          if (laboratoriosSalvos) {
            setLaboratorios(JSON.parse(laboratoriosSalvos));
          } else {
            // Se não há dados salvos, usar os dados iniciais e salvá-los
            localStorage.setItem("laboratorios", JSON.stringify(laboratoriosIniciais));
            setLaboratorios(laboratoriosIniciais);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar laboratórios:", error);
        setLaboratorios(laboratoriosIniciais);
      }
    };

    carregarLaboratorios();
  }, []);

  // Salvar laboratórios no localStorage sempre que houver mudanças
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage && laboratorios.length > 0) {
      localStorage.setItem("laboratorios", JSON.stringify(laboratorios));
    }
  }, [laboratorios]);

  const laboratoriosFiltrados = laboratorios.filter(
    (lab) =>
      lab.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.email.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.endereco.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.cnpj.includes(filtro)
  );

  const handleExcluir = (id, nome) => {
    if (confirm(`Tem certeza que deseja excluir o laboratório ${nome}?`)) {
      const novosLaboratorios = laboratorios.filter((lab) => lab.id !== id);
      setLaboratorios(novosLaboratorios);
      
      // Fechar modal se estiver aberto
      if (modalAberto) {
        fecharModal();
      }
    }
  };

  const buscarPorCnpj = (cnpjFormatado) => {
    // Remove formatação para busca
    const cnpjLimpo = cnpjFormatado.replace(/\D/g, '');
    return laboratorios.find(lab => lab.cnpj.replace(/\D/g, '') === cnpjLimpo);
  };

  const abrirModal = () => {
    setModalAberto(true);
    setCnpj("");
    setLaboratorioExistente(null);
    setLaboratorioNaoEncontrado(false);
    setErro("");
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCnpj("");
    setLaboratorioExistente(null);
    setLaboratorioNaoEncontrado(false);
    setErro("");
  };

  const verificarCnpj = () => {
    // Remove formatação para validação
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    // Validação básica
    if (!cnpjLimpo.trim()) {
      setErro("Por favor, digite um CNPJ válido.");
      return;
    }
    
    // Validação de CNPJ
    if (!validarCnpj(cnpjLimpo)) {
      setErro("CNPJ inválido. Por favor, verifique o número digitado.");
      return;
    }

    // Busca no array de laboratórios
    const laboratorio = buscarPorCnpj(cnpj);
    
    if (laboratorio) {
      setLaboratorioExistente(laboratorio);
      setLaboratorioNaoEncontrado(false);
      setErro("");
    } else {
      // Se não encontrado, mostra mensagem de laboratório não encontrado
      setLaboratorioNaoEncontrado(true);
      setLaboratorioExistente(null);
      setErro("");
    }
  };

  const continuarParaLaboratorioExistente = () => {
    router.push(`/farmacias/laboratorio/editar/${laboratorioExistente.id}`);
  };

  const redirecionarParaCadastro = () => {
    // Limpar CNPJ para apenas números
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    router.push(`/farmacias/laboratorio/cadastro?cnpj=${cnpjNumeros}`);
  };

  // Função para adicionar um novo laboratório (simulando cadastro)
  const adicionarLaboratorio = (novoLaboratorio) => {
    const novoId = Math.max(...laboratorios.map(l => l.id), 0) + 1;
    const laboratorioComId = {
      ...novoLaboratorio,
      id: novoId,
      dataCadastro: new Date().toISOString().split('T')[0]
    };
    
    const novosLaboratorios = [...laboratorios, laboratorioComId];
    setLaboratorios(novosLaboratorios);
    localStorage.setItem("laboratorios", JSON.stringify(novosLaboratorios));
    
    fecharModal();
    return laboratorioComId;
  };

  // Função para simular cadastro rápido (apenas para demonstração)
  const simularCadastroRapido = () => {
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    const nomeLaboratorio = `Laboratório ${cnpjNumeros.slice(0, 4)}`;
    
    const novoLaboratorio = {
      nome: nomeLaboratorio,
      cnpj: cnpj,
      endereco: "Endereço a ser definido",
      telefone: "(00) 0000-0000",
      email: `contato@lab${cnpjNumeros.slice(0, 4)}.com`,
      status: "Ativo"
    };
    
    const laboratorioCriado = adicionarLaboratorio(novoLaboratorio);
    alert(`Laboratório "${laboratorioCriado.nome}" cadastrado com sucesso!`);
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
          <h1 className={styles.title}> Laboratórios</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={abrirModal}
            className={styles.submitButton}
          >
            <span className={styles.buttonIcon}>➕</span>
            Novo Laboratório
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
                className={styles.navLink}
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
              <a
                href="/farmacias/laboratorio/lista"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Laboratórios</span>
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
          <div className={styles.formContainer}>
            <div className={styles.listaHeader}>
              <div>
                <h2>Laboratórios Cadastrados</h2>
                <p>Gerencie os laboratórios parceiros</p>
              </div>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar por nome, CNPJ, email ou endereço..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.laboratoriosTable}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Endereço</th>
                    <th>Contato</th>
                    <th>Status</th>
                    <th>Data Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {laboratoriosFiltrados.length > 0 ? (
                    laboratoriosFiltrados.map((lab) => (
                      <tr key={lab.id}>
                        <td>
                          <div className={styles.labInfo}>
                            <div className={styles.labAvatar}>
                              {lab.nome.charAt(0)}
                            </div>
                            <div>
                              <div className={styles.labNome}>{lab.nome}</div>
                              <div className={styles.labEmail}>{lab.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{lab.cnpj}</td>
                        <td>{lab.endereco}</td>
                        <td>{lab.telefone}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[lab.status.toLowerCase()]
                            }`}
                          >
                            {lab.status}
                          </span>
                        </td>
                        <td>
                          {new Date(lab.dataCadastro).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td>
                          <div className={styles.acoes}>
                            <Link
                              href={`/farmacias/laboratorio/editar/${lab.id}`}
                              className={styles.editarButton}
                              title="Editar laboratório"
                            >
                              ✏️
                            </Link>
                            <button
                              className={styles.excluirButton}
                              onClick={() => handleExcluir(lab.id, lab.nome)}
                              title="Excluir laboratório"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.semRegistros}>
                        {filtro
                          ? "Nenhum laboratório encontrado com o filtro aplicado"
                          : "Nenhum laboratório cadastrado"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.listaFooter}>
              <div className={styles.totalRegistros}>
                Total: {laboratoriosFiltrados.length} laboratório(s)
              </div>
              <div className={styles.infoLocalStorage}>
                <small>Dados armazenados localmente</small>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de CNPJ */}
      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Laboratório</h2>
              <button className={styles.modalClose} onClick={fecharModal}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              {!laboratorioExistente && !laboratorioNaoEncontrado ? (
                <>
                  <p>Digite o CNPJ do laboratório:</p>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
                    className={styles.inputCnpj}
                    placeholder="00.000.000/0000-00"
                    maxLength="18"
                    autoFocus
                  />
                  {erro && <p className={styles.erro}>{erro}</p>}
                  <div className={styles.modalAjuda}>
                    <p>O CNPJ deve conter 14 dígitos numéricos.</p>
                  </div>
                </>
              ) : laboratorioExistente ? (
                <>
                  <div className={styles.modalIcon}>
                    <span>⚠️</span>
                  </div>
                  <h3 className={styles.modalTitle}>Laboratório já cadastrado</h3>
                  <p className={styles.modalMessage}>
                    Este laboratório já está cadastrado em nossa base de dados.
                  </p>
                  
                  <div className={styles.laboratorioInfo}>
                    <div className={styles.labAvatarModal}>
                      {laboratorioExistente.nome.charAt(0)}
                    </div>
                    <div className={styles.labDetails}>
                      <h4>{laboratorioExistente.nome}</h4>
                      <p><strong>CNPJ:</strong> {laboratorioExistente.cnpj}</p>
                      <p><strong>E-mail:</strong> {laboratorioExistente.email}</p>
                      <p><strong>Status:</strong> 
                        <span className={`${styles.statusBadge} ${styles[laboratorioExistente.status.toLowerCase()]}`}>
                          {laboratorioExistente.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <p className={styles.modalPergunta}>
                    Deseja utilizar este cadastro existente?
                  </p>
                </>
              ) : (
                <>
                  <div className={styles.modalIcon}>
                    <span>🔍</span>
                  </div>
                  <h3 className={styles.modalTitle}>Laboratório não encontrado</h3>
                  <p className={styles.modalMessage}>
                    Não encontramos um laboratório com o CNPJ <strong>{cnpj}</strong> em nossa base de dados.
                  </p>
                  <p className={styles.modalPergunta}>
                    Deseja cadastrar este novo laboratório?
                  </p>
                  <div className={styles.demoWarning}>
                    <small>
                      <strong>Modo demonstração:</strong> Em um sistema real, você seria redirecionado para a página de cadastro.
                    </small>
                  </div>
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
                  laboratorioExistente 
                    ? continuarParaLaboratorioExistente 
                    : laboratorioNaoEncontrado 
                      ? simularCadastroRapido  // Em vez de redirecionar, vamos simular o cadastro
                      : verificarCnpj
                }
              >
                {laboratorioExistente 
                  ? "Usar Cadastro Existente" 
                  : laboratorioNaoEncontrado 
                    ? "Cadastrar (Demo)" 
                    : "Verificar CNPJ"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}