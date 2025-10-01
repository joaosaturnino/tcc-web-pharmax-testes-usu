"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { MdEdit, MdDelete, MdError } from "react-icons/md";
import api from "../../../../services/api";

export default function ListaFuncionariosPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true); // Inicia como true para carregar dados
  const [error, setError] = useState("");

  useEffect(() => {
    listarFuncionarios();
  }, []);

  // CORRIGIDO: A função agora busca o farmacia_id e o envia para a API.
  const listarFuncionarios = async () => {
    setLoading(true);
    setError("");
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        throw new Error("Usuário não autenticado. Faça o login.");
      }
      const userData = JSON.parse(userDataString);
      const farmaciaId = userData.farm_id; // Usando a chave 'id' que já confirmamos

      if (!farmaciaId) {
        throw new Error("ID da farmácia não encontrado no seu login.");
      }

      // Envia o ID da farmácia como parâmetro de query
      const response = await api.get(`/funcionario?farmacia_id=${farmaciaId}`);
      
      if (response.data.sucesso) {
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
          // Garante que a data de cadastro seja um valor válido
          dataCadastro: func.func_data_cadastro ? new Date(func.func_data_cadastro).toISOString().split('T')[0] : 'N/A'
        }));
        
        setFuncionarios(funcionariosFormatados);
      } else {
        setError("Erro ao carregar funcionários: " + response.data.mensagem);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(err.response?.data?.mensagem || err.message || "Erro ao conectar com o servidor.");
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

  // CORRIGIDO: A função agora envia o farmacia_id no corpo da requisição DELETE.
  const handleExcluir = async (funcionario) => {
    if (funcionario.nivelAcesso === "Administrador") {
      alert("Não é possível excluir um usuário com nível de acesso Administrador.");
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o funcionário ${funcionario.nome}?`)) {
      setLoading(true);
      
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("Usuário não autenticado.");
        const userData = JSON.parse(userDataString);
        const farmaciaId = userData.farm_id;
        if (!farmaciaId) throw new Error("ID da farmácia não encontrado.");

        const response = await api.delete(`/funcionario/${funcionario.id}`, {
          // Envia o farmacia_id no corpo da requisição para validação no backend
          data: { farmacia_id: farmaciaId }
        });
        
        if (response.data.sucesso) {
          setFuncionarios(funcionarios.filter((func) => func.id !== funcionario.id));
          alert("Funcionário excluído com sucesso!");
        } else {
          alert("Erro ao excluir funcionário: " + response.data.mensagem);
        }
      } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
        alert(error.response?.data?.mensagem || "Erro ao excluir funcionário.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.nivelAcesso.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.usuario.toLowerCase().includes(filtro.toLowerCase())
  );

  const getAvatarColor = (nome) => {
    const colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c", "#d35400"];
    const index = (nome.charCodeAt(0) + (nome.length || 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className={styles.title}>Lista de Funcionários</h1>
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
                <a href="/farmacias/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Favoritos</span>
                </a>
                <a href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <a href="/farmacias/cadastro/funcionario/lista" className={`${styles.navLink} ${styles.active}`}>
                  <span className={styles.navText}>Funcionários</span>
                </a>
                <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <a href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </a>
                <a href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </a>
                <a href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <a href="/farmacias/perfil" className={styles.navLink}>
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
          {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
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
              <button className={styles.submitButton} onClick={handleNovoFuncionario} disabled={loading}>
                <span className={styles.buttonIcon}>+</span>
                Novo Funcionário
              </button>
            </div>
            <div className={styles.filtroContainer}>
              <div className={styles.filtroGroup}>
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, usuário..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className={styles.filtroInput}
                  disabled={loading}
                />
                {filtro && (<button className={styles.limparFiltro} onClick={() => setFiltro("")} disabled={loading}>×</button>)}
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
                    <tr><td colSpan="6" className={styles.loadingRow}><div className={styles.loadingSpinner}></div>Carregando...</td></tr>
                  ) : funcionariosFiltrados.length > 0 ? (
                    funcionariosFiltrados.map((funcionario) => (
                      <tr key={funcionario.id}>
                        <td>
                          <div className={styles.funcionarioInfo}>
                            <div className={styles.funcionarioAvatar} style={{backgroundColor: getAvatarColor(funcionario.nome)}}>
                              {funcionario.nome.charAt(0)}
                            </div>
                            <div>
                              <div className={styles.funcionarioNome}>{funcionario.nome}</div>
                              <div className={styles.funcionarioUsuario}>@{funcionario.usuario}</div>
                            </div>
                          </div>
                        </td>
                        <td>{funcionario.email}</td>
                        <td>{funcionario.telefone}</td>
                        <td>
                          <span className={`${styles.nivelBadge} ${styles[(funcionario.nivelAcesso || '').toLowerCase()]}`}>
                            {funcionario.nivelAcesso}
                          </span>
                        </td>
                        <td>{new Date(funcionario.dataCadastro).toLocaleDateString("pt-BR")}</td>
                        <td>
                          <div className={styles.acoes}>
                            <button className={styles.editarButton} onClick={() => handleEditar(funcionario.id)} title="Editar" disabled={loading}><MdEdit size={16} /></button>
                            <button
                              className={`${styles.excluirButton} ${funcionario.nivelAcesso === "Administrador" ? styles.disabledButton : ""}`}
                              onClick={() => handleExcluir(funcionario)}
                              title={funcionario.nivelAcesso === "Administrador" ? "Não é possível excluir administradores" : "Excluir"}
                              disabled={loading || funcionario.nivelAcesso === "Administrador"}
                            ><MdDelete size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className={styles.semRegistros}>{filtro ? "Nenhum resultado" : "Nenhum funcionário cadastrado"}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.listaFooter}>
              <div className={styles.totalRegistros}>
                Total: {funcionariosFiltrados.length} funcionário(s)
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}