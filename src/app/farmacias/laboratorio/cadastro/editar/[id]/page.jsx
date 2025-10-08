"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link"; // CORREÇÃO: Importado para navegação SPA
import styles from "./edita.module.css";
import api from "../../../../../services/api";

export default function EditarLaboratorioPage() {
  const router = useRouter();
  const params = useParams();
  const { id: lab_id } = params;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  
  const [form, setForm] = useState({
    lab_nome: "",
    lab_cnpj: "",
    lab_endereco: "",
    lab_telefone: "",
    lab_email: "",
    lab_ativo: 1,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dataCadastro, setDataCadastro] = useState("");

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }

    if (lab_id) {
      const fetchLaboratorio = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/laboratorios/${lab_id}`);
          
          if (response.data.sucesso) {
            const laboratorioData = response.data.dados;
            setForm({
              lab_nome: laboratorioData.lab_nome || "",
              lab_cnpj: laboratorioData.lab_cnpj || "",
              lab_endereco: laboratorioData.lab_endereco || "",
              lab_telefone: laboratorioData.lab_telefone || "",
              lab_email: laboratorioData.lab_email || "",
              lab_ativo: laboratorioData.lab_ativo,
            });
            
            setDataCadastro(new Date(laboratorioData.lab_data_cadastro).toISOString().split('T')[0]);

            if (laboratorioData.lab_logo) {
              let logoUrl = laboratorioData.lab_logo;
              if (!logoUrl.startsWith('http')) {
                const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
                const logoPath = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
                logoUrl = `${baseUrl}${logoPath}`;
              }
              setPreview(logoUrl);
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
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Laboratório atualizado com sucesso!");
      router.push("/farmacias/laboratorio/lista");
    } catch (error) {
      console.error("Erro ao atualizar o laboratório:", error);
      const errorMsg = error.response?.data?.mensagem || "Verifique os dados e tente novamente.";
      alert(`Erro ao atualizar: ${errorMsg}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.menuToggle} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu" // NOVO: Acessibilidade
          >
            ☰
          </button>
          <h1 className={styles.title}>Editar Laboratório</h1>
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
                aria-label="Fechar menu" // NOVO: Acessibilidade
              >
                ×
              </button>
            </div>
            
            {/* CORREÇÃO: Trocadas <a> por <Link> para navegação mais rápida */}
            <nav className={styles.nav}>
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
        </aside>

        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        <main className={styles.mainContent}>
          {loading ? (
            // MELHORIA: Spinner de carregamento dentro do layout principal
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
              <span>Carregando dados do laboratório...</span>
            </div>
          ) : (
            <div className={styles.formContainer}>
              <div className={styles.formHeader}>
                <h2>Editar Laboratório</h2>
                <p>Atualize as informações do laboratório farmacêutico</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Informações do Laboratório</h3>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Nome do Laboratório</label><input className={styles.modernInput} type="text" name="lab_nome" value={form.lab_nome} onChange={handleChange} required /></div>
                    <div className={styles.formRow}><div className={styles.formGroup}><label className={styles.inputLabel}>CNPJ</label><input className={styles.modernInput} type="text" name="lab_cnpj" value={form.lab_cnpj} onChange={handleChange} required /></div><div className={styles.formGroup}><label className={styles.inputLabel}>Data de Cadastro</label><input className={styles.modernInput} type="date" value={dataCadastro} disabled /></div></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>E-mail</label><input className={styles.modernInput} type="email" name="lab_email" value={form.lab_email} onChange={handleChange} required /></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Telefone</label><input className={styles.modernInput} type="tel" name="lab_telefone" value={form.lab_telefone} onChange={handleChange} /></div>
                  </div>
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Localização e Identidade Visual</h3>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Endereço Completo</label><input className={styles.modernInput} type="text" name="lab_endereco" value={form.lab_endereco} onChange={handleChange} required /></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Alterar Logo</label><div className={styles.fileUploadGroup}><input type="file" name="logo" onChange={handleChange} className={styles.fileInput} id="logo-upload" accept="image/*" /><label htmlFor="logo-upload" className={styles.fileLabel}><span>📁</span>{logoFile ? "Alterar arquivo" : "Selecionar novo arquivo"}</label>{logoFile && (<span className={styles.fileName}>{logoFile.name}</span>)}</div></div>
                    {preview && (<div className={styles.formGroup}><label className={styles.inputLabel}>Pré-visualização</label><div className={styles.imagePreview}><img src={preview} alt="Pré-visualização do logo" className={styles.previewImage} /></div></div>)}
                  </div>
                </div>
                <div className={styles.formActions}><button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/laboratorio/lista")}>Cancelar</button><button type="submit" className={styles.submitButton}>Atualizar Laboratório</button></div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}