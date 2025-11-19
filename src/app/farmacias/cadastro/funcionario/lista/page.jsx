"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css";
import { MdEdit, MdDelete, MdError } from "react-icons/md";
import api from "../../../../services/api";
import { useDebounce } from "../../../../hooks/useDebounce";

const fetcher = (url) => api.get(url).then((res) => res.data);

// Mapeamento de classes (com acentos)
const badgeClasses = {
  administrador: styles.administrador,
  farmacêutico: styles.farmaceutico,
  funcionário: styles.funcionario,
};

export default function ListaFuncionariosPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  const [farmaciaId, setFarmaciaId] = useState(null);

  const debouncedFiltro = useDebounce(filtro, 300);

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setFarmaciaInfo(userData);
        setFarmaciaId(userData.farm_id);
      } else {
        toast.error("Usuário não autenticado. Faça o login.");
        router.push("/home");
      }
    } catch (e) {
      console.error("Erro ao ler localStorage:", e);
      toast.error("Erro ao carregar dados do usuário.");
    }
  }, [router]);

  const apiUrl = farmaciaId ? `/funcionario?farmacia_id=${farmaciaId}` : null;
  const {
    data: apiResponse,
    error: swrError,
    isLoading,
    mutate: refetchFuncionarios
  } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: true,
  });

  // --- 1ª CORREÇÃO (useMemo) ---
  const funcionarios = useMemo(() => {
    if (!apiResponse?.sucesso) return [];

    return apiResponse.dados.map((func) => ({
      id: func.func_id,
      nome: func.func_nome,
      email: func.func_email,
      telefone: func.func_telefone,
      cpf: func.func_cpf,
      dataNascimento: func.func_dtnasc,
      endereco: func.func_endereco,
      usuario: func.func_usuario,

      // Apenas usamos o valor que vem da API (ex: "Farmacêutico")
      nivelAcesso: func.func_nivel,

      dataCadastro: func.func_data_cadastro
        ? new Date(func.func_data_cadastro)
        : null,
    }));
  }, [apiResponse]);
  // --- FIM DA 1ª CORREÇÃO ---

  const funcionariosFiltrados = useMemo(() => {
    const filtroLower = debouncedFiltro.toLowerCase();
    return funcionarios.filter(
      (funcionario) =>
        funcionario.nome.toLowerCase().includes(filtroLower) ||
        funcionario.email.toLowerCase().includes(filtroLower) ||
        (funcionario.nivelAcesso && funcionario.nivelAcesso.toLowerCase().includes(filtroLower)) ||
        funcionario.usuario.toLowerCase().includes(filtroLower)
    );
  }, [funcionarios, debouncedFiltro]);

  const errorMessage =
    (apiResponse && !apiResponse.sucesso ? apiResponse.mensagem : null) ||
    swrError?.response?.data?.mensagem ||
    swrError?.message;

  const handleEditar = (id) => {
    router.push(`/farmacias/cadastro/funcionario/editar/${id}`);
  };

  const handleNovoFuncionario = () => {
    router.push("/farmacias/cadastro/funcionario");
  };

  const handleExcluir = async (funcionario) => {
    if (funcionario.nivelAcesso === "Administrador") {
      toast.error("Não é possível excluir um usuário Administrador.");
      return;
    }

    const exclusaoPromise = api.delete(`/funcionario/${funcionario.id}`, {
      params: { farmacia_id: farmaciaId },
    });

    toast.promise(exclusaoPromise, {
      loading: `Excluindo ${funcionario.nome}...`,
      success: (response) => {
        if (response.data.sucesso) {
          refetchFuncionarios();
          return "Funcionário excluído com sucesso!";
        } else {
          throw new Error(response.data.mensagem);
        }
      },
      error: (err) => {
        return (
          err.response?.data?.mensagem ||
          err.message ||
          "Erro ao excluir funcionário."
        );
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const getAvatarColor = (nome) => {
    const colors = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c", "#d35400"];
    const index = (nome.charCodeAt(0) + (nome.length || 0)) % colors.length;
    return colors[index];
  };

  return (
    <div className={styles.dashboard}>
      <Toaster position="top-right" reverseOrder={false} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <h1 className={styles.title}>Lista de Funcionários</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (
                <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />
              )}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "Pharma-X"}</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >×</button>
          </div>
          <nav className={styles.nav}>
            {/* ... (Menu) ... */}
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>

        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {errorMessage && (
              <div className={styles.errorMessage}>
                <MdError size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className={styles.listaHeader}>
              {/* ... (Header) ... */}
              <div>
                <h2>Funcionários Cadastrados</h2>
                <p>Gerencie os funcionários do sistema</p>
              </div>
              <button
                className={styles.actionButton}
                onClick={handleNovoFuncionario}
                disabled={isLoading}
              >
                <span>+</span>
                Novo Funcionário
              </button>
            </div>

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
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className={styles.loadingRow}>
                        <div className={styles.spinner}></div>Carregando...
                      </td>
                    </tr>
                  ) : funcionariosFiltrados.length > 0 ? (
                    funcionariosFiltrados.map((funcionario) => (
                      <tr key={funcionario.id}>
                        <td data-label="Nome">
                          {/* ... (Info Funcionário) ... */}
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

                        {/* --- 2ª CORREÇÃO (tbody) --- */}
                        <td data-label="Nível">
                          <span
                            className={`${styles.nivelBadge} ${
                              // Removemos o .replace('ê', 'e')
                              // Agora ("farmacêutico") busca a classe correta
                              badgeClasses[
                              funcionario.nivelAcesso?.toLowerCase()
                              ] || styles.funcionario
                              }`}
                          >
                            {funcionario.nivelAcesso || "N/A"}
                          </span>
                        </td>
                        {/* --- FIM DA 2ª CORREÇÃO --- */}

                        <td data-label="Cadastro">
                          {funcionario.dataCadastro
                            ? funcionario.dataCadastro.toLocaleDateString("pt-BR")
                            : "N/A"}
                        </td>
                        <td data-label="Ações">
                          <div className={styles.acoes}>
                            {/* ... (Botões de Ação) ... */}
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
                    <tr>
                      <td colSpan="6" className={styles.semRegistros}>
                        {filtro
                          ? "Nenhum resultado"
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