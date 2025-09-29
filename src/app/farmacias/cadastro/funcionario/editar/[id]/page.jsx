"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./index.module.css";
import api from "../../../../../services/api"; // Verifique se o caminho para a sua 'api.js' está correto

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Captura o ID da URL

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // O estado inicial do formulário está correto
  const [form, setForm] = useState({
    func_nome: "",
    func_email: "",
    func_telefone: "",
    func_cpf: "",
    func_dtnasc: "",
    func_endereco: "",
    func_usuario: "",
    func_senha: "",
    func_nivel: "",
    farmacia_id: 1,
  });

  // CORREÇÃO: Usar a rota correta da API para buscar dados
  useEffect(() => {
    // Só executa se o ID estiver presente na URL
    if (id) {
      const fetchFuncionario = async () => {
        setLoading(true);
        try {
          // Utiliza a rota específica para buscar um funcionário pelo ID
          const response = await api.get(`/funcionario/${id}`);
          
          if (response.data.sucesso) {
            const funcionarioData = response.data.dados;
            // Formata a data para o formato YYYY-MM-DD que o input 'date' espera
            const dataFormatada = new Date(funcionarioData.func_dtnasc).toISOString().split('T')[0];

            setForm({
              func_nome: funcionarioData.func_nome,
              func_email: funcionarioData.func_email,
              func_telefone: funcionarioData.func_telefone,
              func_cpf: funcionarioData.func_cpf,
              func_dtnasc: dataFormatada,
              func_endereco: funcionarioData.func_endereco,
              func_usuario: funcionarioData.func_usuario,
              func_senha: "", // Campo de senha sempre inicia vazio por segurança
              func_nivel: funcionarioData.func_nivel,
              farmacia_id: funcionarioData.farmacia_id,
            });
          } else {
             // Exibe a mensagem de erro vinda da API
             alert(response.data.mensagem);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do funcionário:", error);
          if (error.response) {
            // Exibe o erro da API, como "Funcionário não encontrado"
            alert(`Erro: ${error.response.data.mensagem}`);
          } else {
            // Erro de rede ou de conexão com a API
            alert('Não foi possível carregar os dados. Verifique a conexão com a API.');
          }
          // Em caso de erro, volta para a lista
          router.push("/farmacias/cadastro/funcionario/lista");
        } finally {
          setLoading(false);
        }
      };
      fetchFuncionario();
    } else {
      setLoading(false);
    }
  }, [id, router]); // Adicionado 'router' às dependências do useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Lógica de envio já está correta, usando PUT para /funcionarios/:id
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cria um objeto para enviar, removendo a senha se estiver vazia
      const dadosParaEnviar = { ...form };
      if (!dadosParaEnviar.func_senha) {
        delete dadosParaEnviar.func_senha;
      }

      // Sua API espera o método PUT para edição
      const response = await api.patch(`/funcionario/${id}`, dadosParaEnviar);

      if (response.data.sucesso) {
        alert("Funcionário atualizado com sucesso!");
        router.push("/farmacias/cadastro/funcionario/lista");
      } else {
        alert("Erro ao atualizar funcionário: " + response.data.mensagem);
      }
    } catch (error) {
        if (error.response) {
            alert(error.response.data.mensagem + '\n' + (error.response.data.dados || ''));
        } else {
            alert('Erro no front-end: ' + error.message);
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

  // O restante do código permanece o mesmo

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Carregando dados do funcionário...</span>
      </div>
    );
  }

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
          <h1 className={styles.title}> Editar Funcionário</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
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
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Funcionário</h2>
              <p>Atualize os dados do colaborador</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Pessoais */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Pessoais
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome Completo *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="func_nome"
                      value={form.func_nome}
                      onChange={handleChange}
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>CPF *</label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="func_cpf"
                        value={form.func_cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Data de Nascimento</label>
                      <input
                        className={styles.modernInput}
                        type="date"
                        name="func_dtnasc"
                        value={form.func_dtnasc}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>E-mail *</label>
                    <input
                      className={styles.modernInput}
                      type="email"
                      name="func_email"
                      value={form.func_email}
                      onChange={handleChange}
                      placeholder="funcionario@empresa.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Telefone</label>
                    <input
                      className={styles.modernInput}
                      type="tel"
                      name="func_telefone"
                      value={form.func_telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Endereço</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="func_endereco"
                      value={form.func_endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>

                {/* Informações de Acesso */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Acesso ao Sistema
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome de Usuário *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="func_usuario"
                      value={form.func_usuario}
                      onChange={handleChange}
                      placeholder="Digite o nome de usuário"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nova Senha</label>
                    <input
                      className={styles.modernInput}
                      type="password"
                      name="func_senha"
                      value={form.func_senha}
                      onChange={handleChange}
                      placeholder="Deixe em branco para não alterar"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nível de Acesso *</label>
                    <select
                      className={styles.modernInput}
                      name="func_nivel"
                      value={form.func_nivel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o nível de acesso</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Funcionário">Funcionário</option>
                      <option value="Visitante">
                        Visitante (Somente leitura)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() =>
                    router.push("/farmacias/cadastro/funcionario/lista")
                  }
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Atualizar Funcionário
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}