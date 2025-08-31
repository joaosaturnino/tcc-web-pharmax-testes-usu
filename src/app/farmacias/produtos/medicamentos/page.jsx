"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../app/farmacias/produtos/medicamentos/cadastro.module.css";

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
  },
];

function ListagemMedicamentos() {
  const [medicamentos, setMedicamentos] = useState(medicamentosIniciais);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      setMedicamentos(medicamentos.filter((med) => med.id !== id));
    }
  };

  const handleEditar = (id) => {
    router.push(`/produtos/medicamentos/editar/${id}`);
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
          <h1 className={styles.titulo}>💊 Painel de Medicamentos</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Buscar medicamentos..." 
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <Link href="/medicamentos/cadastro" className={styles.botaoPrincipal}>
            ➕ Novo Medicamento
          </Link>
          <div className={styles.userMenu}>
            <span className={styles.userAvatar}>👤</span>
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>💊</span>
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
                <span className={styles.navIcon}>⭐</span>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>💊</span>
                <span className={styles.navText}>Medicamentos</span>
                <span className={styles.notificationBadge}>{medicamentos.length}</span>
              </a>
            </div>
            
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a href="/farmacias/cadastro/funcionario" className={styles.navLink}>
                <span className={styles.navIcon}>👩‍⚕️</span>
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navIcon}>🏭</span>
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>
            
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Sistema</p>
              <a href="/config" className={styles.navLink}>
                <span className={styles.navIcon}>⚙️</span>
                <span className={styles.navText}>Configurações</span>
              </a>
              <button className={styles.navLink}>
                <span className={styles.navIcon}>🚪</span>
                <span className={styles.navText}>Sair</span>
              </button>
            </div>
          </nav>
          
          <div className={styles.userPanel}>
            <div className={styles.userAvatar}>
              <span>👤</span>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Administrador</p>
              <p className={styles.userRole}>Supervisor</p>
            </div>
          </div>
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
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💊</div>
              <div className={styles.statContent}>
                <h3>{medicamentos.length}</h3>
                <p>Total de Medicamentos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📦</div>
              <div className={styles.statContent}>
                <h3>{medicamentos.reduce((acc, med) => acc + med.quantidade, 0)}</h3>
                <p>Unidades em Estoque</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <h3>{currency.format(medicamentos.reduce((acc, med) => acc + (med.preco * med.quantidade), 0))}</h3>
                <p>Valor Total</p>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {medicamentos.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💊</div>
                <h3>Nenhum medicamento cadastrado</h3>
                <p>Comece cadastrando seu primeiro medicamento.</p>
                <Link href="/medicamentos/cadastro" className={styles.botaoPrincipal}>
                  ➕ Novo Medicamento
                </Link>
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
                          />
                        </td>
                        <td>
                          <span className={styles.medName}>{med.nome}</span>
                        </td>
                        <td>
                          <span className={styles.medDosage}>{med.dosagem}</span>
                        </td>
                        <td>
                          <span className={styles.medQuantity}>{med.quantidade}</span>
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
                          <span className={styles.medLab}>{med.laboratorio}</span>
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
    </div>
  );
}

export default ListagemMedicamentos;