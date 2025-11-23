"use client"; // Diretiva obrigatória para componentes que usam hooks (useState, useEffect) no Next.js App Router

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation"; // Hook de navegação
import Link from "next/link";
import useSWR from "swr"; // Biblioteca poderosa para buscar dados (Data Fetching) com cache e revalidação
import { Toaster, toast } from "react-hot-toast"; // Biblioteca de notificações visuais
import styles from "./page.module.css"; // Importação do CSS Modular

// Ícones da interface
import { MdEdit, MdDelete, MdError, MdSearch, MdPersonAdd } from "react-icons/md";

// Serviços e Hooks personalizados
import api from "../../../../services/api"; 
import { useDebounce } from "../../../../hooks/useDebounce"; 

// Função 'fetcher': É usada pelo SWR para saber como buscar os dados. 
// Aqui, ela usa nossa instância do Axios ('api') para fazer o GET.
const fetcher = (url) => api.get(url).then((res) => res.data);

// Objeto auxiliar para mapear o texto do 'nível de acesso' para a classe CSS correspondente (cores das badges)
const badgeClasses = {
  administrador: styles.administrador,
  farmacêutico: styles.farmaceutico,
  funcionário: styles.funcionario,
};

export default function ListaFuncionariosPage() {
  const router = useRouter();
  
  // --- ESTADOS (State) ---
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controla se o menu lateral está aberto (mobile)
  const [filtro, setFiltro] = useState(""); // Armazena o texto digitado na busca
  const [farmaciaInfo, setFarmaciaInfo] = useState(null); // Dados da farmácia logada (para exibir no menu)
  const [farmaciaId, setFarmaciaId] = useState(null); // ID usado para fazer as requisições à API

  // --- DEBOUNCE ---
  // O hook useDebounce atrasa a atualização do valor 'filtro' em 300ms.
  // Isso evita que a lista seja filtrada a cada letra digitada, melhorando a performance.
  const debouncedFiltro = useDebounce(filtro, 300);

  // --- EFEITO: VERIFICAÇÃO DE AUTENTICAÇÃO ---
  // Roda apenas uma vez ao carregar a página.
  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setFarmaciaInfo(userData);
        // Define o ID da farmácia. O SWR precisa desse ID para disparar a busca.
        setFarmaciaId(userData.farm_id);
      } else {
        // Se não houver dados no localStorage, força o logout
        toast.error("Usuário não autenticado. Faça o login.");
        router.push("/home");
      }
    } catch (e) {
      console.error("Erro ao ler localStorage:", e);
      toast.error("Erro ao carregar dados do usuário.");
    }
  }, [router]);

  // --- SWR: DATA FETCHING INTELIGENTE ---
  // 'apiUrl' é a chave do SWR. Se for null (farmaciaId ainda não carregou), o SWR não faz a requisição (Conditional Fetching).
  const apiUrl = farmaciaId ? `/funcionario?farmacia_id=${farmaciaId}` : null;
  
  const {
    data: apiResponse, // Os dados retornados pela API
    error: swrError,   // Erro, se houver
    isLoading,         // Verdadeiro enquanto está carregando
    mutate: refetchFuncionarios // Função para forçar a atualização da lista manualmente (útil após deletar)
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: true, // Recarrega os dados se o usuário trocar de aba e voltar
  });

  // --- MEMOIZAÇÃO: PROCESSAMENTO DE DADOS ---
  // useMemo garante que essa transformação de dados só ocorra quando 'apiResponse' mudar.
  const funcionarios = useMemo(() => {
    if (!apiResponse?.sucesso) return [];

    // Transforma os dados brutos do banco em um formato mais amigável para o Frontend
    return apiResponse.dados.map((func) => ({
      id: func.func_id,
      nome: func.func_nome,
      email: func.func_email,
      telefone: func.func_telefone,
      cpf: func.func_cpf,
      dataNascimento: func.func_dtnasc,
      endereco: func.func_endereco,
      usuario: func.func_usuario,
      nivelAcesso: func.func_nivel,
      // Converte string de data para objeto Date para formatação correta na tabela
      dataCadastro: func.func_data_cadastro
        ? new Date(func.func_data_cadastro)
        : null,
    }));
  }, [apiResponse]);

  // --- MEMOIZAÇÃO: FILTRAGEM ---
  // Filtra a lista de funcionários com base no texto digitado (debouncedFiltro).
  const funcionariosFiltrados = useMemo(() => {
    const filtroLower = debouncedFiltro.toLowerCase();
    
    // Se não houver filtro, retorna a lista completa
    return funcionarios.filter(
      (funcionario) =>
        funcionario.nome.toLowerCase().includes(filtroLower) ||
        funcionario.email.toLowerCase().includes(filtroLower) ||
        (funcionario.nivelAcesso && funcionario.nivelAcesso.toLowerCase().includes(filtroLower)) ||
        funcionario.usuario.toLowerCase().includes(filtroLower)
    );
  }, [funcionarios, debouncedFiltro]);

  // Lógica para extrair mensagem de erro (seja da API ou da rede)
  const errorMessage =
    (apiResponse && !apiResponse.sucesso ? apiResponse.mensagem : null) ||
    swrError?.response?.data?.mensagem ||
    swrError?.message;

  // --- HANDLERS (Funções de Ação) ---

  const handleEditar = (id) => {
    router.push(`/farmacias/cadastro/funcionario/editar/${id}`);
  };

  const handleNovoFuncionario = () => {
    router.push("/farmacias/cadastro/funcionario");
  };

  // --- LÓGICA DE EXCLUSÃO: PARTE 2 (EXECUÇÃO) ---
  // Esta função é chamada apenas quando o usuário clica em "Sim" no modal.
  const confirmarExclusao = async (funcionario, toastId) => {
    toast.dismiss(toastId); // Fecha o modal de pergunta

    try {
      // Chama a API passando o ID do funcionário na URL e o ID da farmácia como parâmetro de segurança
      const response = await api.delete(`/funcionario/${funcionario.id}`, {
        params: { farmacia_id: farmaciaId },
      });

      if (response.data.sucesso) {
        toast.success(`Funcionário ${funcionario.nome} excluído com sucesso!`);
        refetchFuncionarios(); // Atualiza a lista na tela imediatamente sem recarregar a página
      } else {
        toast.error(response.data.mensagem || "Erro ao excluir funcionário.");
      }
    } catch (err) {
      const msg = err.response?.data?.mensagem || err.message || "Erro ao excluir.";
      toast.error(msg);
    }
  };

  // --- LÓGICA DE EXCLUSÃO: PARTE 1 (CONFIRMAÇÃO VISUAL) ---
  // Substitui o window.confirm nativo por um Toast customizado e bonito.
  const handleExcluir = (funcionario) => {
    // Regra de Negócio: Administradores não podem ser apagados por segurança básica
    if (funcionario.nivelAcesso === "Administrador") {
      toast.error("Não é possível excluir um usuário Administrador.");
      return;
    }

    // Exibe o Toast customizado (funciona como um Modal pequeno)
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', minWidth: '280px' }}>
        <span style={{ fontSize: '1.4rem', color: '#333', textAlign: 'center', lineHeight: '1.5' }}>
          Tem certeza que deseja excluir <br /> <strong>{funcionario.nome}</strong>?
        </span>
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
          {/* Botão Cancelar: Apenas fecha o toast */}
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#374151',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: '600', flex: 1
            }}
          >
            Cancelar
          </button>
          {/* Botão Confirmar: Chama a função que realmente apaga */}
          <button
            onClick={() => confirmarExclusao(funcionario, t.id)}
            style={{
              padding: '8px 16px', backgroundColor: '#dc2626', color: 'white',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: '600', flex: 1
            }}
          >
            Sim, excluir
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // Não some sozinho, obriga o usuário a clicar
      style: {
        padding: '20px', background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid #e5e7eb'
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // Gera uma cor de fundo baseada no nome para o avatar (estética)
  const getAvatarColor = (nome) => {
    const colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c", "#d35400"];
    const index = (nome.charCodeAt(0) + (nome.length || 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className={styles.dashboard}>
      {/* Configuração global das notificações (Toasts) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.6rem' },
          success: { style: { background: '#458B00' } },
          error: { style: { background: '#dc2626' } },
        }}
      />

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
          <h1 className={styles.title}>Lista de Funcionários</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* SIDEBAR (Menu Lateral) */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (
                <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />
              )}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "Pharma-X"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
          </div>
          <nav className={styles.nav}>
            {/* Links de Navegação */}
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>

        {/* Overlay para fechar o menu no mobile */}
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        {/* CONTEÚDO PRINCIPAL */}
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            
            {/* Exibição de Erros Críticos */}
            {errorMessage && (
              <div className={styles.errorMessage}>
                <MdError size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Lista + Botão Novo */}
            <div className={styles.listaHeader}>
              <div>
                <h2>Funcionários Cadastrados</h2>
                <p>Gerencie os funcionários do sistema</p>
              </div>
              <button
                className={styles.actionButton}
                onClick={handleNovoFuncionario}
                disabled={isLoading} // Desabilita enquanto carrega
              >
                <span>+</span>
                Novo Funcionário
              </button>
            </div>

            {/* Campo de Filtro */}
            <div className={styles.filtroContainer}>
              <input
                type="text"
                placeholder="Buscar por nome, e-mail, usuário..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className={styles.filtroInput}
                disabled={isLoading}
              />
            </div>

            {/* Tabela de Dados */}
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
                  {/* Estado de Loading */}
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingRow}>
                        <div className={styles.spinner}></div>Carregando...
                      </td>
                    </tr>
                  ) : funcionariosFiltrados.length > 0 ? (
                    // Renderização da Lista Filtrada
                    funcionariosFiltrados.map((funcionario) => (
                      <tr key={funcionario.id}>
                        <td data-label="Nome">
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
                        <td data-label="E-mail">{funcionario.email}</td>
                        <td data-label="Telefone">{funcionario.telefone}</td>

                        <td data-label="Nível">
                          <span
                            className={`${styles.nivelBadge} ${
                              badgeClasses[funcionario.nivelAcesso?.toLowerCase()] || styles.funcionario
                              }`}
                          >
                            {funcionario.nivelAcesso || "N/A"}
                          </span>
                        </td>

                        <td data-label="Cadastro">
                          {funcionario.dataCadastro
                            ? funcionario.dataCadastro.toLocaleDateString("pt-BR")
                            : "N/A"}
                        </td>
                        <td data-label="Ações">
                          <div className={styles.acoes}>
                            <button
                              className={styles.editarButton}
                              onClick={() => handleEditar(funcionario.id)}
                              title="Editar"
                              disabled={isLoading}
                            >
                              <MdEdit size={16} />
                            </button>
                            <button
                              className={`${styles.excluirButton}`}
                              onClick={() => handleExcluir(funcionario)}
                              title={
                                funcionario.nivelAcesso === "Administrador"
                                  ? "Não é possível excluir administradores"
                                  : "Excluir"
                              }
                              disabled={
                                isLoading ||
                                funcionario.nivelAcesso === "Administrador"
                              }
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Estado Vazio
                    <tr>
                      <td colSpan="6" className={styles.semRegistros}>
                        {filtro
                          ? "Nenhum resultado para sua busca"
                          : "Nenhum funcionário cadastrado"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rodapé da Lista */}
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