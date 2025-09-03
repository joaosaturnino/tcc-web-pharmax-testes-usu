"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./laboratorio.module.css";

export default function ListaLaboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    // Mock de dados (substituir por chamada API depois)
    const mockLabs = [
      {
        id: 1,
        nome: "LabVida",
        endereco: "Rua A, 123",
        telefone: "(11) 9999-9999",
        email: "contato@labvida.com",
        status: "Ativo",
        dataCadastro: "2023-01-15",
      },
      {
        id: 2,
        nome: "BioPharma",
        endereco: "Av. B, 456",
        telefone: "(21) 9888-8888",
        email: "vendas@biopharma.com",
        status: "Ativo",
        dataCadastro: "2023-02-20",
      },
      {
        id: 3,
        nome: "PharmaTech",
        endereco: "Rua C, 789",
        telefone: "(31) 9777-7777",
        email: "info@pharmatech.com",
        status: "Inativo",
        dataCadastro: "2023-03-10",
      },
      {
        id: 4,
        nome: "MedLab",
        endereco: "Av. D, 101",
        telefone: "(41) 9666-6666",
        email: "suporte@medlab.com",
        status: "Ativo",
        dataCadastro: "2023-04-15",
      },
      {
        id: 5,
        nome: "HealthSolutions",
        endereco: "Rua E, 202",
        telefone: "(51) 9555-5555",
        email: "contato@healthsolutions.com",
        status: "Ativo",
        dataCadastro: "2023-05-22",
      },
    ];
    setLaboratorios(mockLabs);
  }, []);

  const laboratoriosFiltrados = laboratorios.filter(
    (lab) =>
      lab.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.email.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.endereco.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleExcluir = (id, nome) => {
    if (confirm(`Tem certeza que deseja excluir o laboratório ${nome}?`)) {
      setLaboratorios(laboratorios.filter((lab) => lab.id !== id));
    }
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
            {/* ☰ */}
          </button>
          <h1 className={styles.title}> Laboratórios</h1>
          {/* <h1 className={styles.title}>🏭 Laboratórios</h1> */}
        </div>
        <div className={styles.headerActions}>
          <Link
            href="/farmacias/laboratorio/cadastro"
            className={styles.submitButton}
          >
            <span className={styles.buttonIcon}>➕</span>
            Novo Laboratório
          </Link>
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
                className={styles.navLink}
              >
                {/* <span className={styles.navIcon}>👩‍⚕️</span> */}
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a
                href="/farmacias/laboratorio/lista"
                className={`${styles.navLink} ${styles.active}`}
              >
                {/* <span className={styles.navIcon}>🏭</span> */}
                <span className={styles.navText}>Laboratórios</span>
                <span className={styles.notificationBadge}>
                  {laboratorios.length}
                </span>
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
                <h2>Laboratórios Cadastrados</h2>
                <p>Gerencie os laboratórios parceiros</p>
              </div>
              {/* <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🏭</div>
                  <div className={styles.statContent}>
                    <h3>{laboratorios.length}</h3>
                    <p>Total</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statContent}>
                    <h3>
                      {
                        laboratorios.filter((lab) => lab.status === "Ativo")
                          .length
                      }
                    </h3>
                    <p>Ativos</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>❌</div>
                  <div className={styles.statContent}>
                    <h3>
                      {
                        laboratorios.filter((lab) => lab.status === "Inativo")
                          .length
                      }
                    </h3>
                    <p>Inativos</p>
                  </div>
                </div>
              </div> */}
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.laboratoriosTable}>
                <thead>
                  <tr>
                    <th>Nome</th>
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
                              href={`/farmacias/laboratorio/cadastro/editar/${lab.id}`}
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
                      <td colSpan="6" className={styles.semRegistros}>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
