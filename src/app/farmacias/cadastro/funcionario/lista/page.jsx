"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

// Ícones para validação
import { MdCheckCircle, MdError, MdEdit, MdDelete } from "react-icons/md";
import api from "../../../../services/api"; // Ajuste o caminho conforme sua estrutura

export default function ListaFuncionariosPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Buscar funcionários da API
  useEffect(() => {
    listarFuncionarios();
  }, []);

  const listarFuncionarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/funcionario");
      
      if (response.data.sucesso) {
        // Mapear os dados da API para o formato usado no frontend
        const funcionariosFormatados = response.data.dados.map(func => ({
          id: func.func_id,
          nome: func.func_nome,
          email: func.func_email,
          telefone: func.func_telefone,
          cpf: func.func_cpf,
          dataNascimento: func.func_dtnasc,
          endereco: func.func_endereco,
          usuario: func.func_usuario,
          nivelAcesso: func.func_nivel,
          dataCadastro: func.func_data_cadastro || new Date().toISOString().split('T')[0] // Fallback caso não exista
        }));
        
        setFuncionarios(funcionariosFormatados);
      } else {
        setError("Erro ao carregar funcionários: " + response.data.mensagem);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setError("Erro ao conectar com o servidor. Verifique se a API está rodando.");
      
      // Fallback para dados de exemplo em caso de erro (apenas para desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.warn("Usando dados de exemplo devido ao erro na API");
        const dadosExemplo = [
          {
            id: 1,
            nome: "Maria Silva",
            email: "maria.silva@pharmax.com",
            telefone: "(11) 99999-9999",
            cpf: "123.456.789-00",
            dataNascimento: "1990-05-15",
            endereco: "Rua das Flores, 123 - São Paulo/SP",
            usuario: "maria.silva",
            nivelAcesso: "Administrador",
            dataCadastro: "2023-01-15",
          },
          {
            id: 2,
            nome: "João Santos",
            email: "joao.santos@pharmax.com",
            telefone: "(11) 98888-8888",
            cpf: "987.654.321-00",
            dataNascimento: "1985-10-22",
            endereco: "Av. Paulista, 1000 - São Paulo/SP",
            usuario: "joao.santos",
            nivelAcesso: "Gerente",
            dataCadastro: "2023-02-20",
          },
          {
            id: 3,
            nome: "Ana Costa",
            email: "ana.costa@pharmax.com",
            telefone: "(11) 97777-7777",
            cpf: "456.789.123-00",
            dataNascimento: "1992-03-30",
            endereco: "Rua Augusta, 500 - São Paulo/SP",
            usuario: "ana.costa",
            nivelAcesso: "Funcionário",
            dataCadastro: "2023-03-10",
          }
        ];
        setFuncionarios(dadosExemplo);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    router.push(`/farmacias/cadastro/funcionario/editar/${id}`);
  };

  const handleNovoFuncionario = () => {
    router.push("/farmacias/cadastro/funcionario");
  };

  const validarExclusao = (funcionario) => {
    // Não permitir exclusão de administradores
    if (funcionario.nivelAcesso === "Administrador") {
      alert("Não é possível excluir um usuário com nível de acesso Administrador.");
      return false;
    }
    
    // Verificar se é o próprio usuário logado
    const usuarioLogadoId = 1; // Em uma aplicação real, isso viria do contexto de autenticação
    if (funcionario.id === usuarioLogadoId) {
      alert("Você não pode excluir sua própria conta.");
      return false;
    }
    
    return true;
  };

  const handleExcluir = async (funcionario) => {
    if (!validarExclusao(funcionario)) {
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o funcionário ${funcionario.nome}? Esta ação não pode ser desfeita.`)) {
      setLoading(true);
      
      try {
        const response = await api.delete(`/funcionario/${funcionario.id}`);
        
        if (response.data.sucesso) {
          // Atualizar a lista local
          setFuncionarios(funcionarios.filter((func) => func.id !== funcionario.id));
          alert("Funcionário excluído com sucesso!");
        } else {
          alert("Erro ao excluir funcionário: " + response.data.mensagem);
        }
      } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
        alert("Erro ao excluir funcionário. Verifique a conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/home");
    }
  };

  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.nivelAcesso.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.telefone.includes(filtro)
  );

  // Função para gerar cor baseada no nome
  const getAvatarColor = (nome) => {
    const colors = [
      "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6",
      "#1abc9c", "#d35400", "#c0392b", "#16a085", "#27ae60",
    ];
    const index = nome.charCodeAt(0) % colors.length;
    return colors[index];
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
          <h1 className={styles.title}>Lista de Funcionários</h1>
        </div>
        
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a
                href="/farmacias/favoritos"
                className={styles.navLink}
              >
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
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Relatórios</p>
              <a
                href="/farmacias/relatorios/favoritos"
                className={styles.navLink}
              >
                <span className={styles.navText}>Medicamentos Favoritos</span>
              </a>
              <a
                href="/farmacias/relatorios/funcionarios"
                className={styles.navLink}
              >
                <span className={styles.navText}>Relatório de Funcionarios</span>
              </a>
              <a
                href="/farmacias/relatorios/laboratorios"
                className={styles.navLink}
              >
                <span className={styles.navText}>Relatório de Laboratorios</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Conta</p>
              <a
                href="/farmacias/perfil"
                className={styles.navLink}
              >
                <span className={styles.navText}>Meu Perfil</span>
              </a>
              <button
                onClick={handleLogout}
                className={styles.navLink}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className={styles.navText}>Sair</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            {/* Mensagem de erro */}
            {error && (
              <div className={styles.errorMessage}>
                <MdError size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.listaHeader}>
              <div>
                <h2>Funcionários Cadastrados</h2>
                <p>Gerencie os funcionários do sistema</p>
              </div>
              <button
                className={styles.submitButton}
                onClick={handleNovoFuncionario}
                disabled={loading}
              >
                <span className={styles.buttonIcon}>+</span>
                Novo Funcionário
              </button>
            </div>

            {/* Filtro de busca */}
            <div className={styles.filtroContainer}>
              <div className={styles.filtroGroup}>
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, usuário ou nível de acesso..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className={styles.filtroInput}
                  disabled={loading}
                />
                {filtro && (
                  <button
                    className={styles.limparFiltro}
                    onClick={() => setFiltro("")}
                    disabled={loading}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.funcionariosTable}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Nível de Acesso</th>
                    <th>Data de Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingRow}>
                        <div className={styles.loadingSpinner}></div>
                        Carregando funcionários...
                      </td>
                    </tr>
                  ) : funcionariosFiltrados.length > 0 ? (
                    funcionariosFiltrados.map((funcionario) => (
                      <tr key={funcionario.id}>
                        <td>
                          <div className={styles.funcionarioInfo}>
                            <div
                              className={styles.funcionarioAvatar}
                              style={{
                                backgroundColor: getAvatarColor(funcionario.nome),
                              }}
                            >
                              {funcionario.nome.charAt(0)}
                            </div>
                            <div>
                              <div className={styles.funcionarioNome}>
                                {funcionario.nome}
                              </div>
                              <div className={styles.funcionarioUsuario}>
                                @{funcionario.usuario}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{funcionario.email}</td>
                        <td>{funcionario.telefone}</td>
                        <td>
                          <span
                            className={`${styles.nivelBadge} ${
                              styles[funcionario.nivelAcesso.toLowerCase()]
                            }`}
                          >
                            {funcionario.nivelAcesso}
                          </span>
                        </td>
                        <td>
                          {new Date(funcionario.dataCadastro).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          <div className={styles.acoes}>
                            <button
                              className={styles.editarButton}
                              onClick={() => handleEditar(funcionario.id)}
                              title="Editar funcionário"
                              disabled={loading}
                            >
                              <MdEdit size={16} />
                            </button>
                            <button
                              className={`${styles.excluirButton} ${
                                funcionario.nivelAcesso === "Administrador" ? styles.disabledButton : ""
                              }`}
                              onClick={() => handleExcluir(funcionario)}
                              title={
                                funcionario.nivelAcesso === "Administrador" 
                                  ? "Não é possível excluir administradores" 
                                  : "Excluir funcionário"
                              }
                              disabled={loading || funcionario.nivelAcesso === "Administrador"}
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.semRegistros}>
                        {filtro
                          ? "Nenhum funcionário encontrado com o filtro aplicado"
                          : "Nenhum funcionário cadastrado"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.listaFooter}>
              <div className={styles.totalRegistros}>
                Total: {funcionariosFiltrados.length} funcionário(s)
                {filtro && ` (filtrado de ${funcionarios.length})`}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}