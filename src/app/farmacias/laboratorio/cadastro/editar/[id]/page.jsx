"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edita.module.css";
import api from "../../../../../services/api"; // Ajuste o caminho conforme sua estrutura

export default function EditarLaboratorioPage() {
  const router = useRouter();
  const params = useParams(); // Hook para pegar parâmetros da URL, como o ID
  const { id: lab_id } = params; // Renomeando id para lab_id para clareza

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    lab_nome: "",
    lab_cnpj: "",
    lab_endereco: "",
    lab_telefone: "",
    lab_email: "",
    lab_ativo: 1, // Assumindo 1 como 'ativo'
  });
  const [logoFile, setLogoFile] = useState(null); // Estado separado para o arquivo do logo
  const [preview, setPreview] = useState(null); // Estado para a pré-visualização do logo
  const [dataCadastro, setDataCadastro] = useState("");

  // Carrega os dados da API ao inicializar o componente
  useEffect(() => {
    if (lab_id) {
      const fetchLaboratorio = async () => {
        setLoading(true);
        try {
          const response = await api.get("/laboratorios");
          const laboratorioData = response.data.dados.find(
            (lab) => lab.lab_id == lab_id
          );

          if (laboratorioData) {
            setForm({
              lab_nome: laboratorioData.lab_nome || "",
              lab_cnpj: laboratorioData.lab_cnpj || "",
              lab_endereco: laboratorioData.lab_endereco || "",
              lab_telefone: laboratorioData.lab_telefone || "",
              lab_email: laboratorioData.lab_email || "",
              lab_ativo: laboratorioData.lab_ativo,
            });
            
            // Formata e define a data de cadastro
            const data = new Date(laboratorioData.lab_data_cadastro);
            setDataCadastro(data.toISOString().split('T')[0]);

            if (laboratorioData.lab_logo) {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL;
              const apiPorta = process.env.NEXT_PUBLIC_API_PORTA;
              setPreview(`${apiUrl}:${apiPorta}${laboratorioData.lab_logo}`);
            }
          } else {
            alert("Laboratório não encontrado!");
            router.push("/farmacias/laboratorio/lista");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do laboratório:", error);
          alert("Não foi possível carregar os dados do laboratório.");
        } finally {
          setLoading(false);
        }
      };
      fetchLaboratorio();
    }
  }, [lab_id, router]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("lab_nome", form.lab_nome);
    formData.append("lab_cnpj", form.lab_cnpj);
    formData.append("lab_endereco", form.lab_endereco);
    formData.append("lab_telefone", form.lab_telefone);
    formData.append("lab_email", form.lab_email);
    formData.append("lab_ativo", form.lab_ativo);

    if (logoFile) {
      formData.append("lab_logo", logoFile);
    }

    try {
      await api.put(`/laboratorios/${lab_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Laboratório atualizado com sucesso!");
      router.push("/farmacias/laboratorio/lista");
    } catch (error) {
      console.error("Erro ao atualizar o laboratório:", error);
      const errorMsg = error.response?.data?.mensagem || "Verifique os dados e tente novamente.";
      alert(`Erro ao atualizar: ${errorMsg}`);
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este laboratório?")) {
      try {
        await api.delete(`/laboratorios/${lab_id}`);
        alert("Laboratório excluído com sucesso!");
        router.push("/farmacias/laboratorio/lista");
      } catch (error) {
        console.error("Erro ao excluir o laboratório:", error);
        alert("Não foi possível excluir o laboratório.");
      }
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

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/home");
    }
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
            ☰
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
                ×
              </button>
            </div>
            <nav className={styles.nav}>
              {/* Seus links de navegação aqui */}
              <a href="/farmacias/laboratorio/lista" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
              {/* ...outros links... */}
              <button
                  onClick={handleLogout}
                  className={styles.navLink}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <span className={styles.navText}>Sair</span>
                </button>
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
                  <h3 className={styles.sectionTitle}>
                    Informações do Laboratório
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome do Laboratório *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="lab_nome"
                      value={form.lab_nome}
                      onChange={handleChange}
                      placeholder="Digite o nome do laboratório"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>CNPJ *</label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="lab_cnpj"
                        value={form.lab_cnpj}
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
                        value={dataCadastro}
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>E-mail *</label>
                    <input
                      className={styles.modernInput}
                      type="email"
                      name="lab_email"
                      value={form.lab_email}
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
                      name="lab_telefone"
                      value={form.lab_telefone}
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
                    <label className={styles.inputLabel}>Endereço Completo *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="lab_endereco"
                      value={form.lab_endereco}
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
                        {logoFile ? "Alterar arquivo" : "Selecionar arquivo"}
                      </label>
                      {logoFile && (
                        <span className={styles.fileName}>
                          {logoFile.name}
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
                  onClick={() => router.push("/farmacias/laboratorio/lista")}
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