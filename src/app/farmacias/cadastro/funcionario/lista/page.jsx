"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ListaFuncionariosPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtro, setFiltro] = useState("");

  // Dados de exemplo (em uma aplicação real, viriam de uma API)
  useEffect(() => {
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
      },
      {
        id: 4,
        nome: "Pedro Oliveira",
        email: "pedro.oliveira@pharmax.com",
        telefone: "(11) 96666-6666",
        cpf: "789.123.456-00",
        dataNascimento: "1988-12-05",
        endereco: "Rua Consolação, 789 - São Paulo/SP",
        usuario: "pedro.oliveira",
        nivelAcesso: "Supervisor",
        dataCadastro: "2023-04-15",
      },
      {
        id: 5,
        nome: "Carla Rodrigues",
        email: "carla.rodrigues@pharmax.com",
        telefone: "(11) 95555-5555",
        cpf: "321.654.987-00",
        dataNascimento: "1995-07-20",
        endereco: "Alameda Santos, 456 - São Paulo/SP",
        usuario: "carla.rodrigues",
        nivelAcesso: "Visitante",
        dataCadastro: "2023-05-22",
      },
    ];
    setFuncionarios(dadosExemplo);
  }, []);

  const handleEditar = (id) => {
    router.push(`/farmacias/cadastro/funcionario/editar/${id}`);
  };

  const handleNovoFuncionario = () => {
    router.push("/farmacias/cadastro/funcionario");
  };

  const handleExcluir = (id) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios(funcionarios.filter((func) => func.id !== id));
    }
  };

  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      funcionario.nivelAcesso.toLowerCase().includes(filtro.toLowerCase())
  );

  // Função para gerar cor baseada no nome
  const getAvatarColor = (nome) => {
    const colors = [
      "#3498db",
      "#2ecc71",
      "#e74c3c",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
      "#d35400",
      "#c0392b",
      "#16a085",
      "#27ae60",
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
          {/* <h1 className={styles.title}>👥 Lista de Funcionários</h1> */}
          <h1 className={styles.title}> Lista de Funcionários</h1>
        </div>
        {/* <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Buscar funcionários..." 
              className={styles.searchInput}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <div className={styles.userMenu}>
            <span className={styles.userAvatar}>👤</span>
          </div>
        </div> */}
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
              {/* <span className={styles.logoIcon}>💊</span> */}
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
              <a href="/farmacias/favoritos" className={styles.navLink}>
                {/* <span className={styles.navIcon}>⭐</span> */}
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a
                href="/farmacias/produtos/medicamentos"
                className={styles.navLink}
              >
                {/* <span className={styles.navIcon}>💊</span> */}
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className={`${styles.navLink} ${styles.active}`}
              >
                {/* <span className={styles.navIcon}>👩‍⚕️</span> */}
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                {/* <span className={styles.navIcon}>🏭</span> */}
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>

            {/* <div className={styles.navSection}>
              <p className={styles.navLabel}>Sistema</p>
              <a href="../../../configuracoes" className={styles.navLink}>
                <span className={styles.navIcon}>⚙️</span>
                <span className={styles.navText}>Configurações</span>
              </a>
              <a href="/farmacias/perfil" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>👤</span>
                <span className={styles.navText}>Meu Perfil</span>
              </a>
              <button className={styles.navLink}>
                <span className={styles.navIcon}>🚪</span>
                <span className={styles.navText}>Sair</span>
              </button>
            </div> */}
          </nav>

          {/* <div className={styles.userPanel}>
            <div className={styles.userAvatar}>
              <span>👤</span>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Administrador</p>
              <p className={styles.userRole}>Supervisor</p>
            </div>
          </div> */}
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
                <h2>Funcionários Cadastrados</h2>
                <p>Gerencie os funcionários do sistema</p>
              </div>
              <button
                className={styles.submitButton}
                onClick={handleNovoFuncionario}
              >
                <span className={styles.buttonIcon}>➕</span>
                Novo Funcionário
              </button>
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
                  {funcionariosFiltrados.length > 0 ? (
                    funcionariosFiltrados.map((funcionario) => (
                      <tr key={funcionario.id}>
                        <td>
                          <div className={styles.funcionarioInfo}>
                            <div
                              className={styles.funcionarioAvatar}
                              style={{
                                backgroundColor: getAvatarColor(
                                  funcionario.nome
                                ),
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
                          {new Date(
                            funcionario.dataCadastro
                          ).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          <div className={styles.acoes}>
                            <button
                              className={styles.editarButton}
                              onClick={() => handleEditar(funcionario.id)}
                              title="Editar funcionário"
                            >
                              ✏️
                            </button>
                            <button
                              className={styles.excluirButton}
                              onClick={() => handleExcluir(funcionario.id)}
                              title="Excluir funcionário"
                            >
                              🗑️
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
