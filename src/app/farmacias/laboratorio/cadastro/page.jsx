"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../cadastro.module.css";

export default function CadastroLaboratorio() {
  const router = useRouter();

  const [laboratorio, setLaboratorio] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaboratorio({ ...laboratorio, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLaboratorio({ ...laboratorio, logo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Salvar no localStorage
    const dados = { ...laboratorio, logo: preview };
    localStorage.setItem("laboratorio", JSON.stringify(dados));

    alert("Laboratório cadastrado com sucesso!");
    router.push("/laboratorio/editar");
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Moderna */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💊</span>
            <span className={styles.logoText}>PharmaX</span>
          </div>
          <button
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <p className={styles.navLabel}>Principal</p>
            <a href="/farmacias/favoritos" className={styles.navLink}>
              <span className={styles.navIcon}>⭐</span>
              <span className={styles.navText}>Favoritos</span>
            </a>
            <a
              href="/farmacias/produtos/medicamentos"
              className={styles.navLink}
            >
              <span className={styles.navIcon}>💊</span>
              <span className={styles.navText}>Medicamentos</span>
            </a>
          </div>

          <div className={styles.navSection}>
            <p className={styles.navLabel}>Gestão</p>
            <a
              href="/farmacias/cadastro/funcionario/lista"
              className={styles.navLink}
            >
              <span className={styles.navIcon}>👩‍⚕️</span>
              <span className={styles.navText}>Funcionários</span>
            </a>
            <a
              href="/farmacias/laboratorio/lista"
              className={`${styles.navLink} ${styles.active}`}
            >
              <span className={styles.navIcon}>🏭</span>
              <span className={styles.navText}>Laboratórios</span>
            </a>
          </div>

          {/* <div className={styles.navSection}>
            <p className={styles.navLabel}>Sistema</p>
            <a href="../../../configuracoes" className={styles.navLink}>
              <span className={styles.navIcon}>⚙️</span>
              <span className={styles.navText}>Configurações</span>
            </a>
            <a href="/farmacias/perfil" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>👤</span>
                <span className={styles.navText}>Meu Perfil</span>
              </a>
            <button className={styles.navLink}>
              <span className={styles.navIcon}>🚪</span>
              <span className={styles.navText}>Sair</span>
            </button>
          </div> */}
        </nav>

        <div className={styles.userPanel}>
          <div className={styles.userAvatar}>
            <span>👤</span>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Administrador</p>
            <p className={styles.userRole}>Supervisor</p>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Cadastro de Laboratório</h1>
        </header>

        <div className={styles.contentCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Nome do Laboratório</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite o nome completo"
                  value={laboratorio.nome}
                  onChange={handleChange}
                  required
                  className={styles.modernInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={laboratorio.cnpj}
                  onChange={handleChange}
                  required
                  className={styles.modernInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  placeholder="Endereço completo"
                  value={laboratorio.endereco}
                  onChange={handleChange}
                  required
                  className={styles.modernInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={laboratorio.telefone}
                  onChange={handleChange}
                  className={styles.modernInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contato@laboratorio.com"
                  value={laboratorio.email}
                  onChange={handleChange}
                  required
                  className={styles.modernInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Logo do Laboratório</label>
                <div className={styles.fileUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className={styles.fileLabel}>
                    <span className={styles.uploadIcon}>📁</span>
                    Escolher arquivo
                  </label>
                  {laboratorio.logo && (
                    <span className={styles.fileName}>
                      {laboratorio.logo.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {preview && (
              <div className={styles.previewContainer}>
                <label className={styles.inputLabel}>Pré-visualização</label>
                <div className={styles.previewBox}>
                  <img
                    src={preview}
                    alt="Pré-visualização"
                    className={styles.logoPreview}
                  />
                </div>
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.back()}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.submitButton}>
                <span className={styles.buttonIcon}>💾</span>
                Salvar Laboratório
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
