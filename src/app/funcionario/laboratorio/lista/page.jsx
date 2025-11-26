"use client"; // Diretiva do Next.js: Indica que este componente roda no navegador (necessário para Hooks)

import { useEffect, useState } from "react";
import Link from "next/link"; // Link otimizado do Next.js (não recarrega a página)
import { useRouter } from "next/navigation";
import styles from "./laboratorio.module.css"; 
import api from "../../../services/api"; 

// Biblioteca para notificações visuais (substitui o alert() feio do navegador)
import toast, { Toaster } from "react-hot-toast";

export default function ListaLaboratorios() {
  // --- GERENCIAMENTO DE ESTADO ---
  const [laboratorios, setLaboratorios] = useState([]); // Lista principal de dados
  const [sidebarOpen, setSidebarOpen] = useState(false); // Menu mobile (aberto/fechado)
  const [filtro, setFiltro] = useState(""); // Valor do input de busca
  const [loading, setLoading] = useState(true); // Controle do Spinner de carregamento
  const [farmaciaInfo, setFarmaciaInfo] = useState(null); // Dados do cabeçalho

  const router = useRouter();

  // --- EFEITO DE MONTAGEM (Executa 1x ao abrir a tela) ---
  useEffect(() => {
    // 1. Recupera dados da sessão (LocalStorage)
    const carregarInfoFarmacia = () => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        setFarmaciaInfo(JSON.parse(userDataString));
      }
    };

    carregarInfoFarmacia();
    listarLaboratorios(); // 2. Busca os dados na API
  }, []); 

  // --- FUNÇÃO DE BUSCA (API) ---
  async function listarLaboratorios() {
    try {
      setLoading(true); // Liga o spinner
      const response = await api.get('/todoslab');

      if (response.data.sucesso === true) {
        // Padrão de Adaptação (Data Mapping):
        // O banco devolve snake_case (lab_nome), mas o React prefere camelCase (nome).
        // Fazemos essa conversão aqui para deixar o JSX mais limpo.
        const labsFormatados = response.data.dados.map(lab => ({
          id: lab.lab_id,
          nome: lab.lab_nome,
          endereco: lab.lab_endereco,
          telefone: lab.lab_telefone,
          email: lab.lab_email,
          status: lab.lab_ativo ? "Ativo" : "Inativo", // Tratamento visual de booleano
          dataCadastro: lab.lab_data_cadastro,
          cnpj: lab.lab_cnpj,
          logoUrl: lab.lab_logo_url
        }));
        setLaboratorios(labsFormatados);
      } else {
        toast.error('Erro ao carregar laboratórios: ' + response.data.mensagem);
      }
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
      toast.error('Não foi possível carregar os dados. Verifique sua conexão.');
    } finally {
      setLoading(false); // Desliga o spinner (independente de sucesso ou erro)
    }
  }

  // --- EXCLUSÃO PARTE 2: AÇÃO REAL ---
  // Chamada apenas quando o usuário clica em "Sim" no Toast
  const confirmarExclusao = async (id, nome, toastId) => {
    toast.dismiss(toastId); // Fecha a notificação de pergunta

    try {
      const response = await api.delete(`/laboratorios/${id}`);

      if (response.data.sucesso === true) {
        toast.success(`Laboratório ${nome} excluído com sucesso!`);

        // ATUALIZAÇÃO OTIMISTA DA UI:
        // Em vez de chamar listarLaboratorios() novamente (o que gastaria rede),
        // nós apenas filtramos o item removido da lista local. É instantâneo para o usuário.
        setLaboratorios((prev) => prev.filter(lab => lab.id !== id));
      } else {
        toast.error('Erro ao excluir: ' + response.data.mensagem);
      }
    } catch (error) {
      console.error('Erro ao excluir laboratório:', error);
      toast.error('Não foi possível excluir o laboratório. Tente novamente.');
    }
  };

  // --- EXCLUSÃO PARTE 1: INTERFACE ---
  // Cria uma notificação personalizada com botões "Cancelar" e "Sim"
  const handleExcluir = (id, nome) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', minWidth: '280px' }}>
        <span style={{ fontSize: '1.4rem', color: '#333', textAlign: 'center', lineHeight: '1.5' }}>
          Tem certeza que deseja excluir o laboratório <br /> <strong>{nome}</strong>?
        </span>
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={() => toast.dismiss(t.id)} // Apenas fecha
            style={{
              padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#374151',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '1.3rem', fontWeight: '600', flex: 1
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => confirmarExclusao(id, nome, t.id)} // Chama a exclusão real
            style={{
              padding: '8px 16px', backgroundColor: '#dc2626', color: 'white',
              border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontSize: '1.3rem', fontWeight: '600', flex: 1
            }}
          >
            Sim, excluir
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // Não some sozinho, obriga interação
      style: {
        padding: '20px', background: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid #e5e7eb'
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // --- FILTRAGEM CLIENT-SIDE ---
  // Filtra a lista que já está na memória baseada no input.
  // Muito eficiente para listas de tamanho médio.
  const laboratoriosFiltrados = laboratorios.filter(
    (lab) =>
      lab.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      lab.email.toLowerCase().includes(filtro.toLowerCase()) ||
      (lab.endereco && lab.endereco.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className={styles.dashboard}>
      {/* Configuração global dos Toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.6rem' },
          success: { style: { background: '#458B00' } },
          error: { style: { background: '#dc2626' } },
        }}
      />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <h1 className={styles.title}>Laboratórios</h1>
        </div>
        <div className={styles.headerActions}>
          {/* Input de Busca com estado 'filtro' */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Pesquisar laboratórios..."
              className={styles.searchInput}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          <Link href="/farmacias/laboratorio/cadastro" className={styles.submitButton}>
            <span className={styles.buttonIcon}>➕</span>
            Novo Laboratório
          </Link>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Responsiva */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          {/* ... Conteúdo da Sidebar (mantido igual) ... */}
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              {farmaciaInfo ? (
                <div className={styles.logoContainer}>
                  {farmaciaInfo.farm_logo_url && (
                    <img src={farmaciaInfo.farm_logo_url} alt={`Logo`} className={styles.logoImage} />
                  )}
                  <span className={styles.logoText}>{farmaciaInfo.farm_nome}</span>
                </div>
              ) : (
                <span className={styles.logoText}>Pharma-X</span>
              )}
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <nav className={styles.nav}>
            {/* ... Links de navegação ... */}
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

          {/* RENDERIZAÇÃO CONDICIONAL: Loading ou Tabela */}
          {loading ? (
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
                              {/* Lógica de exibição de imagem: URL ou Placeholder */}
                              {lab.logoUrl ? (
                                <img
                                  src={lab.logoUrl}
                                  alt={`Logo do ${lab.nome}`}
                                  className={styles.labAvatar}
                                  style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee' }}
                                />
                              ) : (
                                <div className={styles.labAvatar} style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: '8px' }}>
                                  {lab.nome.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className={styles.labNome}>{lab.nome}</div>
                                <div className={styles.labEmail}>{lab.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{lab.endereco}</td>
                          <td>{lab.telefone}</td>
                          {/* Classe CSS dinâmica baseada no status (ativo/inativo) */}
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
                      /* Estado Vazio (se filtro não retornar nada) */
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