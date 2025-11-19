"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./index.module.css";
import api from "../../../../../services/api";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [form, setForm] = useState({
    func_nome: "",
    func_email: "",
    func_telefone: "",
    func_cpf: "",
    func_dtnasc: "",
    func_endereco: "",
    func_usuario: "",
    func_senha: "",
    func_nivel: "", // O valor inicial é uma string vazia
  });

  useEffect(() => {
    if (id) {
      const fetchFuncionario = async () => {
        setLoading(true);
        try {
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) throw new Error("Usuário não autenticado.");

          const userData = JSON.parse(userDataString);
          setFarmaciaInfo(userData);

          const idDaFarmacia = userData.farm_id;
          if (!idDaFarmacia) throw new Error("ID da farmácia não encontrado no seu login.");

          const response = await api.get(`/funcionario/${id}?farmacia_id=${idDaFarmacia}`);

          if (response.data.sucesso) {
            const funcionarioData = response.data.dados;
            const dataFormatada = funcionarioData.func_dtnasc ? new Date(funcionarioData.func_dtnasc).toISOString().split('T')[0] : "";

            setForm({
              func_nome: funcionarioData.func_nome,
              func_email: funcionarioData.func_email,
              func_telefone: funcionarioData.func_telefone || "",
              func_cpf: funcionarioData.func_cpf,
              func_dtnasc: dataFormatada,
              func_endereco: funcionarioData.func_endereco || "",
              func_usuario: funcionarioData.func_usuario,
              func_senha: "",
              // === 1ª CORREÇÃO: Armazena o NOME vindo da API ===
              // (ex: "Farmacêutico")
              func_nivel: funcionarioData.func_nivel,
            });
          } else {
            throw new Error(response.data.mensagem);
          }
        } catch (err) {
          console.error("Erro ao buscar dados do funcionário:", err);
          const errorMsg = err.response?.data?.mensagem || err.message || 'Não foi possível carregar os dados.';
          toast.error(errorMsg);
          router.push("/farmacias/cadastro/funcionario/lista");
        } finally {
          setLoading(false);
        }
      };
      fetchFuncionario();
    }
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = (async () => {
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) throw new Error("Usuário não autenticado.");

        const userData = JSON.parse(userDataString);
        const idDaFarmacia = userData.farm_id;
        if (!idDaFarmacia) throw new Error("ID da farmácia não encontrado para realizar a atualização.");

        // 'dadosParaEnviar' agora contém func_nivel: "Farmacêutico" (o nome)
        const dadosParaEnviar = { ...form, farmacia_id: idDaFarmacia };

        if (!dadosParaEnviar.func_senha || dadosParaEnviar.func_senha.trim() === "") {
          delete dadosParaEnviar.func_senha;
        }

        const response = await api.patch(`/funcionario/${id}`, dadosParaEnviar);

        if (response.data.sucesso) {
          router.push("/farmacias/cadastro/funcionario/lista");
        } else {
          throw new Error(response.data.mensagem);
        }
      } catch (err) {
        console.error("Erro ao atualizar funcionário:", err);
        throw new Error(err.response?.data?.mensagem || err.message || 'Ocorreu um erro ao salvar.');
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(promise, {
      loading: 'Atualizando funcionário...',
      success: 'Funcionário atualizado com sucesso!',
      error: (err) => err.message,
    });
  };

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
      <Toaster position="top-right" reverseOrder={false} />

      <header className={styles.header}>
        {/* ... (Header JSX) ... */}
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
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          {/* ... (Sidebar JSX) ... */}
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
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Funcionário</h2>
              <p>Atualize os dados do colaborador</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  {/* ... (Formulário: Informações Pessoais) ... */}
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
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Acesso ao Sistema</h3>
                  {/* ... (Formulário: Acesso) ... */}
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

                  {/* === 2ª CORREÇÃO: Mudar o VALUE das options === */}
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nível de Acesso</label>
                    <select className={styles.modernInput}
                      name="func_nivel"
                      value={form.func_nivel} // Agora (ex: "Farmacêutico")
                      onChange={handleChange}
                      required >
                      <option value="" disabled>Selecione</option>
                      <option value="Funcionário">Funcionário</option>
                      <option value="Farmacêutico">Farmacêutico</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  {/* === FIM DAS CORREÇÕES === */}

                </div>
              </div>
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