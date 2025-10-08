"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // CORREÇÃO: Importado para navegação SPA
import { useRouter } from "next/navigation";
import styles from "./laboratorio.module.css";
import api from "../../../services/api";

export default function ListaLaboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const carregarInfoFarmacia = () => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        setFarmaciaInfo(JSON.parse(userDataString));
      }
    };
    
    carregarInfoFarmacia();
    listarLaboratorios();
  }, []);

  async function listarLaboratorios() {
    try {
      setLoading(true);
      const response = await api.get('/laboratorios');
      
      if (response.data.sucesso === true) {
        const labsFormatados = response.data.dados.map(lab => ({
          id: lab.lab_id,
          nome: lab.lab_nome,
          endereco: lab.lab_endereco,
          telefone: lab.lab_telefone,
          email: lab.lab_email,
          status: lab.lab_ativo ? "Ativo" : "Inativo",
          dataCadastro: lab.lab_data_cadastro,
          cnpj: lab.lab_cnpj,
          logoUrl: lab.lab_logo_url
        }));
        setLaboratorios(labsFormatados);
      } else {
        alert('Erro ao carregar laboratórios: ' + response.data.mensagem);
      }
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      alert('Não foi possível carregar os dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }

  const handleExcluir = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o laboratório ${nome}?`)) {
      try {
        const response = await api.delete(`/laboratorios/${id}`);
        
        if (response.data.sucesso === true) {
          alert(`Laboratório ${nome} excluído com sucesso!`);
          // Atualiza a lista removendo o item excluído sem precisar de uma nova chamada à API
          setLaboratorios(laboratorios.filter(lab => lab.id !== id));
        } else {
          alert('Erro ao excluir: ' + response.data.mensagem);
        }
      } catch (error) {
        console.error('Erro ao excluir laboratório:', error);
        alert('Não foi possível excluir o laboratório. Tente novamente.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const laboratoriosFiltrados = laboratorios.filter(
    (lab) =>
      lab.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.email.toLowerCase().includes(filtro.toLowerCase()) ||
      (lab.endereco && lab.endereco.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.menuToggle} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu" // NOVO: Acessibilidade
          >
            ☰
          </button>
          <h1 className={styles.title}>Laboratórios</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Pesquisar laboratórios..." className={styles.searchInput} value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <Link href="/farmacias/laboratorio/cadastro" className={styles.submitButton}>
            <span className={styles.buttonIcon}>➕</span>
            Novo Laboratório
          </Link>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logo}>
                {farmaciaInfo ? (
                  <div className={styles.logoContainer}>
                    {farmaciaInfo.farm_logo_url && (
                      <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />
                    )}
                    <span className={styles.logoText}>{farmaciaInfo.farm_nome}</span>
                  </div>
                ) : (
                  <span className={styles.logoText}>Pharma-X</span>
                )}
              </div>
              <button 
                className={styles.sidebarClose} 
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar menu" // NOVO: Acessibilidade
              >
                ×
              </button>
            </div>
            
            {/* CORREÇÃO: Trocados <a> por <Link> para navegação mais rápida */}
            <nav className={styles.nav}>
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
        </aside>

        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        <main className={styles.mainContent}>
            <div className={styles.listaHeader}>
                <h2>Laboratórios Cadastrados</h2>
                <p>Gerencie os laboratórios parceiros da sua farmácia</p>
            </div>

            {loading ? (
              // MELHORIA: Spinner de carregamento visual
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando laboratórios...</p>
              </div>
            ) : (
              <>
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
                                {lab.logoUrl ? (<img src={lab.logoUrl} alt={`Logo do ${lab.nome}`} className={styles.labAvatar} />) : (<div className={styles.labAvatar}>{lab.nome.charAt(0)}</div>)}
                                <div>
                                  <div className={styles.labNome}>{lab.nome}</div>
                                  <div className={styles.labEmail}>{lab.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{lab.endereco}</td>
                            <td>{lab.telefone}</td>
                            <td><span className={`${styles.statusBadge} ${styles[lab.status.toLowerCase()]}`}>{lab.status}</span></td>
                            <td>{new Date(lab.dataCadastro).toLocaleDateString("pt-BR")}</td>
                            <td>
                              <div className={styles.acoes}>
                                <Link href={`/farmacias/laboratorio/cadastro/editar/${lab.id}`} className={styles.editarButton} title="Editar laboratório">✏️</Link>
                                <button className={styles.excluirButton} onClick={() => handleExcluir(lab.id, lab.nome)} title="Excluir laboratório">🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className={styles.semRegistros}>
                            {filtro ? "Nenhum laboratório encontrado com o filtro aplicado." : "Nenhum laboratório cadastrado."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={styles.listaFooter}>
                  <div className={styles.totalRegistros}>Total: {laboratoriosFiltrados.length} laboratório(s)</div>
                </div>
              </>
            )}
        </main>
      </div>
    </div>
  );
}