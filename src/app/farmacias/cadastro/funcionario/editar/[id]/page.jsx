"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./index.module.css";
import api from "../../../../../services/api"; 
import Link from "next/link";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Pega o ID do funcionário da URL

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // ADICIONADO: Estado para armazenar os dados da farmácia
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
    func_nivel: "",
  });

  // NOVO: useEffect para buscar os dados do funcionário ao carregar a página
  useEffect(() => {
    if (id) {
      const fetchFuncionario = async () => {
        setLoading(true);
        setError("");
        try {
          const userDataString = localStorage.getItem("userData");
          if (!userDataString) throw new Error("Usuário não autenticado.");
          
          const userData = JSON.parse(userDataString);
          // ADICIONADO: Salva os dados da farmácia no estado
          setFarmaciaInfo(userData);

          const idDaFarmacia = userData.farm_id;
          if (!idDaFarmacia) throw new Error("ID da farmácia não encontrado no seu login.");

          // Busca o funcionário pelo ID, enviando o ID da farmácia para validação no backend
          const response = await api.get(`/funcionario/${id}?farmacia_id=${idDaFarmacia}`);

          if (response.data.sucesso) {
            const funcionarioData = response.data.dados;
            // Formata a data para o formato que o input[type=date] aceita
            const dataFormatada = funcionarioData.func_dtnasc ? new Date(funcionarioData.func_dtnasc).toISOString().split('T')[0] : "";

            // Preenche o formulário com os dados recebidos
            setForm({
              func_nome: funcionarioData.func_nome,
              func_email: funcionarioData.func_email,
              func_telefone: funcionarioData.func_telefone || "",
              func_cpf: funcionarioData.func_cpf,
              func_dtnasc: dataFormatada,
              func_endereco: funcionarioData.func_endereco || "",
              func_usuario: funcionarioData.func_usuario,
              func_senha: "", // Senha sempre começa em branco por segurança
              func_nivel: funcionarioData.func_nivel,
            });
          } else {
             throw new Error(response.data.mensagem);
          }
        } catch (err) {
          console.error("Erro ao buscar dados do funcionário:", err);
          setError(err.response?.data?.mensagem || err.message || 'Não foi possível carregar os dados.');
          // Opcional: redirecionar se o erro for crítico
          // router.push("/farmacias/cadastro/funcionario/lista");
        } finally {
          setLoading(false);
        }
      };
      fetchFuncionario();
    }
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // ALTERADO: A função agora envia uma requisição de ATUALIZAÇÃO (PATCH ou PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("Usuário não autenticado.");
      
      const userData = JSON.parse(userDataString);
      const idDaFarmacia = userData.farm_id;
      if (!idDaFarmacia) throw new Error("ID da farmácia não encontrado para realizar a atualização.");

      const dadosParaEnviar = { ...form, farmacia_id: idDaFarmacia };

      // Não envia o campo de senha se estiver em branco
      if (!dadosParaEnviar.func_senha || dadosParaEnviar.func_senha.trim() === "") {
        delete dadosParaEnviar.func_senha;
      }
    
      // ALTERADO: Usa o método PATCH para atualizar, enviando o ID na URL
      const response = await api.patch(`/funcionario/${id}`, dadosParaEnviar);
  
      if (response.data.sucesso) {
        alert("Funcionário atualizado com sucesso!");
        router.push("/farmacias/cadastro/funcionario/lista");
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      setError(err.response?.data?.mensagem || err.message || 'Ocorreu um erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.func_nome) { // Mostra loading inicial
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Carregando...</span>
      </div>
    );
  }
  
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
             ☰
          </button>
          <h1 className={styles.title}>Editar Funcionário</h1>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        {/* INÍCIO DA MODIFICAÇÃO DO SIDEBAR */}
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
                  <span className={styles.logoText}>PharmaX</span>
                )}
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
            </div>
            {/* FIM DA MODIFICAÇÃO DO SIDEBAR HEADER */}
            <nav className={styles.nav}>
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
        </aside>
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Funcionário</h2>
              <p>Atualize os dados do colaborador</p>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome Completo *</label>
                    <input className={styles.modernInput} type="text" name="func_nome" value={form.func_nome} onChange={handleChange} required />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>CPF *</label>
                      <input className={styles.modernInput} type="text" name="func_cpf" value={form.func_cpf} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Data de Nascimento</label>
                      <input className={styles.modernInput} type="date" name="func_dtnasc" value={form.func_dtnasc} onChange={handleChange} />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>E-mail *</label>
                    <input className={styles.modernInput} type="email" name="func_email" value={form.func_email} onChange={handleChange} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Telefone</label>
                    <input className={styles.modernInput} type="tel" name="func_telefone" value={form.func_telefone} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Endereço</label>
                    <input className={styles.modernInput} type="text" name="func_endereco" value={form.func_endereco} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Acesso ao Sistema</h3>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome de Usuário *</label>
                    <input className={styles.modernInput} type="text" name="func_usuario" value={form.func_usuario} onChange={handleChange} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nova Senha</label>
                    <input className={styles.modernInput} type="password" name="func_senha" value={form.func_senha} onChange={handleChange} placeholder="Deixe em branco para não alterar" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nível de Acesso *</label>
                    <select className={styles.modernInput} name="func_nivel" value={form.func_nivel} onChange={handleChange} required >
                      <option value="">Selecione</option>
                      <option value="1">Funcionário</option>
                        <option value="2">Farmacêutico</option>
                        <option value="3">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/cadastro/funcionario/lista")} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Atualizando...' : 'Atualizar Funcionário'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}