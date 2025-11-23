"use client"; // Indica componente Client-Side (interativo)

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./index.module.css";
import api from "../../../../../services/api";
import Link from "next/link";
// Import do Toast para feedback visual padronizado
import toast, { Toaster } from "react-hot-toast";

export default function EditarFuncionarioPage() {
  const router = useRouter(); // Hook para redirecionamento
  const params = useParams(); // Hook para pegar o ID da URL
  const { id } = params; // Extrai o ID do funcionário (ex: .../editar/15)

  // Estados da UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Mostra spinner enquanto carrega
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  // Estado do Formulário (Objeto único para facilitar manutenção)
  const [form, setForm] = useState({
    func_nome: "",
    func_email: "",
    func_telefone: "",
    func_cpf: "",
    func_dtnasc: "",
    func_endereco: "",
    func_usuario: "",
    func_senha: "", // Começa vazia (só envia se o usuário digitar)
    func_nivel: "",
  });

  // --- BUSCA DADOS INICIAIS ---
  useEffect(() => {
    if (id) {
      const fetchFuncionario = async () => {
        setLoading(true);
        try {
          // 1. Verifica sessão e segurança
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) throw new Error("Usuário não autenticado.");

          const userData = JSON.parse(userDataString);
          setFarmaciaInfo(userData);

          const idDaFarmacia = userData.farm_id;
          if (!idDaFarmacia) throw new Error("ID da farmácia não encontrado no seu login.");

          // 2. Faz a requisição para a API
          // Passamos farmacia_id na query para garantir que só acessa dados da própria farmácia
          const response = await api.get(`/funcionario/${id}?farmacia_id=${idDaFarmacia}`);

          if (response.data.sucesso) {
            const funcionarioData = response.data.dados;
            
            // Formata data ISO para YYYY-MM-DD (necessário para input type="date")
            const dataFormatada = funcionarioData.func_dtnasc ? new Date(funcionarioData.func_dtnasc).toISOString().split('T')[0] : "";

            // 3. Preenche o state do formulário
            setForm({
              func_nome: funcionarioData.func_nome,
              func_email: funcionarioData.func_email,
              func_telefone: funcionarioData.func_telefone || "",
              func_cpf: funcionarioData.func_cpf,
              func_dtnasc: dataFormatada,
              func_endereco: funcionarioData.func_endereco || "",
              func_usuario: funcionarioData.func_usuario,
              func_senha: "", // Senha vem vazia por segurança
              func_nivel: funcionarioData.func_nivel,
            });
          } else {
            throw new Error(response.data.mensagem);
          }
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
          const errorMsg = err.response?.data?.mensagem || err.message || 'Não foi possível carregar os dados.';
          toast.error(errorMsg);
          // Redireciona para a lista após 2 segundos se der erro crítico
          setTimeout(() => router.push("/farmacias/cadastro/funcionario/lista"), 2000);
        } finally {
          setLoading(false);
        }
      };
      fetchFuncionario();
    }
  }, [id, router]);

  // --- HANDLERS ---

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // Envia os dados editados
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne reload da página
    setLoading(true);

    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("Usuário não autenticado.");

      const userData = JSON.parse(userDataString);
      const idDaFarmacia = userData.farm_id;

      // Cria cópia dos dados para manipular antes de enviar
      const dadosParaEnviar = { ...form, farmacia_id: idDaFarmacia };

      // REGRA DE NEGÓCIO: Se o campo senha estiver vazio, removemos ele do objeto.
      // Assim, a API mantém a senha antiga e não a substitui por string vazia.
      if (!dadosParaEnviar.func_senha || dadosParaEnviar.func_senha.trim() === "") {
        delete dadosParaEnviar.func_senha;
      }

      // Envia PATCH (Atualização parcial)
      const response = await api.patch(`/funcionario/${id}`, dadosParaEnviar);

      if (response.data.sucesso) {
        toast.success("Funcionário atualizado com sucesso!");
        // Aguarda o Toast aparecer antes de redirecionar
        setTimeout(() => {
          router.push("/farmacias/cadastro/funcionario/lista");
        }, 1500);
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      toast.error(err.response?.data?.mensagem || err.message || 'Ocorreu um erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  // Mostra Loading antes de renderizar o formulário
  if (loading && !form.func_nome) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Carregando dados...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Componente Toast Global */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '1.5rem',
            padding: '1.6rem',
          },
          success: { style: { background: '#458B00' } }, // Verde Sucesso
          error: { style: { background: '#dc2626' } }, // Vermelho Erro
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
          <h1 className={styles.title}>Editar Funcionário</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Dinâmica */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (
                <img src={farmaciaInfo.farm_logo_url}
                  alt={`Logo de ${farmaciaInfo.farm_nome}`}
                  className={styles.logoImage} />
              )}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "Pharma-X"}</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fechar menu"
            >×</button>
          </div>
          
          {/* Menu de Navegação */}
          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <Link href="/farmacias/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </Link>
              <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                <span className={styles.navText}>Medicamentos</span>
              </Link>
            </div>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <Link href="/farmacias/cadastro/funcionario/lista" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navText}>Funcionários</span>
              </Link>
              <Link href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </Link>
            </div>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Relatórios</p>
              <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Medicamentos Favoritos</span>
              </Link>
              <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                <span className={styles.navText}>Relatório de Funcionarios</span>
              </Link>
              <Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                <span className={styles.navText}>Relatório de Laboratorios</span>
              </Link>
            </div>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Conta</p>
              <Link href="/farmacias/perfil" className={styles.navLink}>
                <span className={styles.navText}>Meu Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className={styles.navLink}
                style={{
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}>
                <span className={styles.navText}>Sair</span>
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Overlay para fechar menu no mobile */}
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Funcionário</h2>
              <p>Atualize os dados do colaborador</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                
                {/* COLUNA 1: DADOS PESSOAIS */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome Completo</label>
                    <input className={styles.modernInput}
                      type="text"
                      name="func_nome"
                      value={form.func_nome}
                      onChange={handleChange}
                      required />
                  </div>
                  
                  {/* Grid Interno para CPF e Data */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>CPF</label>
                      <input className={styles.modernInput}
                        type="text"
                        name="func_cpf"
                        value={form.func_cpf}
                        onChange={handleChange}
                        required />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Data de Nascimento</label>
                      <input className={styles.modernInput}
                        type="date"
                        name="func_dtnasc"
                        value={form.func_dtnasc}
                        onChange={handleChange} />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>E-mail</label>
                    <input className={styles.modernInput}
                      type="email"
                      name="func_email"
                      value={form.func_email}
                      onChange={handleChange}
                      required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Telefone</label>
                    <input className={styles.modernInput}
                      type="tel"
                      name="func_telefone"
                      value={form.func_telefone}
                      onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Endereço</label>
                    <input className={styles.modernInput}
                      type="text"
                      name="func_endereco"
                      value={form.func_endereco}
                      onChange={handleChange} />
                  </div>
                </div>

                {/* COLUNA 2: ACESSO */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Acesso ao Sistema</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome de Usuário</label>
                    <input className={styles.modernInput}
                      type="text"
                      name="func_usuario"
                      value={form.func_usuario}
                      onChange={handleChange}
                      required />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nova Senha</label>
                    <input className={styles.modernInput}
                      type="password"
                      name="func_senha"
                      value={form.func_senha}
                      onChange={handleChange}
                      placeholder="Deixe em branco para não alterar" />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nível de Acesso</label>
                    <select className={styles.modernInput}
                      name="func_nivel"
                      value={form.func_nivel}
                      onChange={handleChange}
                      required >
                      <option value="" disabled>Selecione</option>
                      <option value="Funcionário">Funcionário</option>
                      <option value="Farmacêutico">Farmacêutico</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BOTÕES FINAIS */}
              <div className={styles.formActions}>
                <button type="button"
                  className={styles.cancelButton}
                  onClick={() => router.push("/farmacias/cadastro/funcionario/lista")}
                  disabled={loading}>Cancelar</button>
                <button type="submit"
                  className={styles.submitButton}
                  disabled={loading}>{loading ? 'Atualizando...' : 'Atualizar Funcionário'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}