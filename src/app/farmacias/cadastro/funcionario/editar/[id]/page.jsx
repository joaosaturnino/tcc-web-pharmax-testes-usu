"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    usuario: "",
    senha: "",
    nivelAcesso: "",
    acessoRelatorios: false,
    acessoEstoque: false,
    acessoFinanceiro: false,
    acessoConfiguracoes: false,
  });

  // Dados de exemplo (em uma aplicação real, viriam de uma API)
  useEffect(() => {
    // Simulando busca de dados do funcionário
    setTimeout(() => {
      const funcionario = {
        id: 1,
        nome: "Maria Silva",
        email: "maria.silva@pharmax.com",
        telefone: "(11) 99999-9999",
        cpf: "123.456.789-00",
        dataNascimento: "1990-05-15",
        endereco: "Rua das Flores, 123 - São Paulo/SP",
        usuario: "maria.silva",
        senha: "********",
        nivelAcesso: "Administrador",
        acessoRelatorios: true,
        acessoEstoque: true,
        acessoFinanceiro: true,
        acessoConfiguracoes: true,
        dataCadastro: "2023-01-15",
      };

      setForm({
        nome: funcionario.nome,
        email: funcionario.email,
        telefone: funcionario.telefone,
        cpf: funcionario.cpf,
        dataNascimento: funcionario.dataNascimento,
        endereco: funcionario.endereco,
        usuario: funcionario.usuario,
        senha: funcionario.senha,
        nivelAcesso: funcionario.nivelAcesso,
        acessoRelatorios: funcionario.acessoRelatorios,
        acessoEstoque: funcionario.acessoEstoque,
        acessoFinanceiro: funcionario.acessoFinanceiro,
        acessoConfiguracoes: funcionario.acessoConfiguracoes,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados atualizados:", form);
    alert("Funcionário atualizado com sucesso!");
    router.push("/farmacias/cadastro/funcionario/lista");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Carregando dados do funcionário...</span>
      </div>
    );
  }

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
          <h1 className={styles.title}> Editar Funcionário</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          
          <div className={styles.sidebarHeader}>
            
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
            
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            >
              x
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a href="/farmacias/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className={styles.navLink}
              >
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>

            <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <a
                  href="/farmacias/relatorios/favoritos"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Favoritos</span>
                </a>
                <a
                  href="/farmacias/relatorios/funcionarios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Funcionários</span>
                </a>
                <a
                  href="/farmacias/relatorios/laboratorios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Laboratórios</span>
                </a>
              </div>
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Funcionário</h2>
              <p>Atualize os dados do colaborador</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Pessoais */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Pessoais
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome Completo *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>CPF *</label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="cpf"
                        value={form.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Data de Nascimento</label>
                      <input
                        className={styles.modernInput}
                        type="date"
                        name="dataNascimento"
                        value={form.dataNascimento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>E-mail *</label>
                    <input
                      className={styles.modernInput}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="funcionario@empresa.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Telefone</label>
                    <input
                      className={styles.modernInput}
                      type="tel"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Endereço</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>

                {/* Informações de Acesso */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Acesso ao Sistema
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome de Usuário *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="usuario"
                      value={form.usuario}
                      onChange={handleChange}
                      placeholder="Digite o nome de usuário"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Senha *</label>
                    <input
                      className={styles.modernInput}
                      type="password"
                      name="senha"
                      value={form.senha}
                      onChange={handleChange}
                      placeholder="Digite a nova senha"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nível de Acesso *</label>
                    <select
                      className={styles.modernInput}
                      name="nivelAcesso"
                      value={form.nivelAcesso}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o nível de acesso</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Funcionário">Funcionário</option>
                      <option value="Visitante">
                        Visitante (Somente leitura)
                      </option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Permissões Especiais</label>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="acessoRelatorios"
                          checked={form.acessoRelatorios}
                          onChange={handleChange}
                        />
                        <span className={styles.checkboxText}>
                          Acesso a relatórios
                        </span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="acessoEstoque"
                          checked={form.acessoEstoque}
                          onChange={handleChange}
                        />
                        <span className={styles.checkboxText}>Gerenciar estoque</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="acessoFinanceiro"
                          checked={form.acessoFinanceiro}
                          onChange={handleChange}
                        />
                        <span className={styles.checkboxText}>Acesso financeiro</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="acessoConfiguracoes"
                          checked={form.acessoConfiguracoes}
                          onChange={handleChange}
                        />
                        <span className={styles.checkboxText}>
                          Configurações do sistema
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() =>
                    router.push("/farmacias/cadastro/funcionario/lista")
                  }
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Atualizar Funcionário
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}