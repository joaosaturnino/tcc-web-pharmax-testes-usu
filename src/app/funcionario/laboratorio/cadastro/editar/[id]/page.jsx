"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./edita.module.css";

export default function EditarLaboratorioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    logo: null,
    dataCadastro: "",
  });

  const [preview, setPreview] = useState(null);

  // Carrega os dados do localStorage ao inicializar o componente
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("laboratorio");
    if (dadosSalvos) {
      const laboratorioData = JSON.parse(dadosSalvos);
      setForm({
        nome: laboratorioData.nome || "",
        cnpj: laboratorioData.cnpj || "",
        endereco: laboratorioData.endereco || "",
        telefone: laboratorioData.telefone || "",
        email: laboratorioData.email || "",
        logo: laboratorioData.logo || null,
        dataCadastro:
          laboratorioData.dataCadastro ||
          new Date().toISOString().split("T")[0],
      });
      setPreview(laboratorioData.logo || null);
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setForm({
        ...form,
        [name]: file,
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Atualiza no localStorage
    const dados = { ...form, logo: preview };
    localStorage.setItem("laboratorio", JSON.stringify(dados));

    alert("Laboratório atualizado com sucesso!");
    router.push("/funcionario/laboratorio/lista");
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este laboratório?")) {
      localStorage.removeItem("laboratorio");
      alert("Laboratório excluído com sucesso!");
      router.push("/funcionario/laboratorio/lista");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Carregando dados do laboratório...</span>
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
          </button>
          <h1 className={styles.title}> Editar Laboratório</h1>
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
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>

              <a href="/funcionario/produtos/medicamentos" className={styles.navLink}>
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <a
                href="/funcionario/laboratorio/lista"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Laboratórios</span>
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
              <h2>Editar Laboratório</h2>
              <p>Atualize as informações do laboratório farmacêutico</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações do Laboratório */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações do Laboratório</h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome do Laboratório </label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome do laboratório"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>CNPJ</label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="cnpj"
                        value={form.cnpj}
                        onChange={handleChange}
                        placeholder="00.000.000/0000-00"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Data de Cadastro</label>
                      <input
                        className={styles.modernInput}
                        type="date"
                        name="dataCadastro"
                        value={form.dataCadastro}
                        onChange={handleChange}
                        disabled
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
                      placeholder="contato@laboratorio.com"
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
                </div>

                {/* Endereço e Logo */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Localização e Identidade Visual
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Endereço Completo</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Logo do Laboratório</label>
                    <div className={styles.fileUploadGroup}>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        className={styles.fileInput}
                        id="logo-upload"
                        accept="image/*"
                      />
                      <label htmlFor="logo-upload" className={styles.fileLabel}>
                        {form.logo ? "Alterar arquivo" : "Selecionar arquivo"}
                      </label>
                      {form.logo && (
                        <span className={styles.fileName}>
                          {typeof form.logo === "string"
                            ? "Imagem carregada"
                            : form.logo.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {preview && (
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Pré-visualização</label>
                      <div className={styles.imagePreview}>
                        <img
                          src={preview}
                          alt="Pré-visualização do logo"
                          className={styles.previewImage}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => router.push("/funcionario/laboratorio/lista")}
                >
                  Cancelar
                </button>

                <button type="submit" className={styles.submitButton}>
                  Atualizar Laboratório
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}