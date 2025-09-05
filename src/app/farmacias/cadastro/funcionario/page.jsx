"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./funcionario.module.css";
// import "../../../../styles/globals";

export default function CadastroFuncionarioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", form);
    router.push("/farmacias/cadastro/funcionario/lista");
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
          </button>
          <h1 className={styles.title}> Cadastro de Funcionário</h1>
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
              <span className={styles.logoText}>PharmaX</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            >
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a href="/farmacias/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a
                href="/farmacias/produtos/medicamentos"
                className={styles.navLink}
              >
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>
          </nav>
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
            <div className={styles.formHeader}>
              <h2>Novo Funcionário</h2>
              <p>Preencha os dados do novo colaborador</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Pessoais */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Pessoais
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome Completo </label>
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
                      <label className={styles.inputLabel}>CPF</label>
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
                      <label className={styles.inputLabel}>
                        Data de Nascimento
                      </label>
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
                    <label className={styles.inputLabel}>E-mail</label>
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
                    <label className={styles.inputLabel}>
                      Nome de Usuário
                    </label>
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
                    <label className={styles.inputLabel}>Senha</label>
                    <input
                      className={styles.modernInput}
                      type="password"
                      name="senha"
                      value={form.senha}
                      onChange={handleChange}
                      placeholder="Digite a senha"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Nível de Acesso
                    </label>
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
                    <label className={styles.inputLabel}>
                      Permissões Especiais
                    </label>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="acessoRelatorios" />
                        <span className={styles.checkboxText}>
                          Acesso a relatórios
                        </span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="acessoEstoque" />
                        <span className={styles.checkboxText}>
                          Gerenciar estoque
                        </span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="acessoFinanceiro" />
                        <span className={styles.checkboxText}>
                          Acesso financeiro
                        </span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="acessoConfiguracoes" />
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
                  onClick={() => router.back()}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Cadastrar Funcionário
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
