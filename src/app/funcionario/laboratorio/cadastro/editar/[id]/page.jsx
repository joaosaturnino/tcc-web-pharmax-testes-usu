"use client"; // Indica componente Client-Side (React + Hooks)

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // useParams pega o ID da URL
import Link from "next/link";
import styles from "./edita.module.css";
import api from "../../../../../services/api";
import toast, { Toaster } from "react-hot-toast"; // Biblioteca de notificações

export default function EditarLaboratorioPage() {
  const router = useRouter();
  const params = useParams();
  const { id: lab_id } = params; // Extrai o ID da URL (ex: /editar/15)

  // --- ESTADOS ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Controla o spinner
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [form, setForm] = useState({
    lab_nome: "",
    lab_cnpj: "",
    lab_endereco: "",
    lab_telefone: "",
    lab_email: "",
    lab_ativo: 1,
  });

  // Estados específicos para imagem
  const [logoFile, setLogoFile] = useState(null); // O arquivo binário (novo upload)
  const [preview, setPreview] = useState(null);   // URL para exibir a imagem (nova ou antiga)
  const [dataCadastro, setDataCadastro] = useState("");

  // --- BUSCA DE DADOS INICIAL ---
  useEffect(() => {
    // 1. Carrega dados do usuário (Sessão)
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }

    // 2. Busca dados do laboratório para preencher o formulário
    if (lab_id) {
      const fetchLaboratorio = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/laboratorios/${lab_id}`);

          if (response.data.sucesso) {
            const laboratorioData = response.data.dados;

            // Popula o estado do formulário
            setForm({
              lab_nome: laboratorioData.lab_nome || "",
              lab_cnpj: laboratorioData.lab_cnpj || "",
              lab_endereco: laboratorioData.lab_endereco || "",
              lab_telefone: laboratorioData.lab_telefone || "",
              lab_email: laboratorioData.lab_email || "",
              lab_ativo: laboratorioData.lab_ativo,
            });

            // Formata data para exibição
            setDataCadastro(new Date(laboratorioData.lab_data_cadastro).toISOString().split('T')[0]);

            // Tratamento da URL da Logo (Caminho absoluto vs relativo)
            if (laboratorioData.lab_logo) {
              let logoUrl = laboratorioData.lab_logo;
              if (!logoUrl.startsWith('http')) {
                const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
                const logoPath = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
                logoUrl = `${baseUrl}${logoPath}`;
              }
              setPreview(logoUrl); // Mostra a logo atual do banco
            }
          } else {
            toast.error('Laboratório não encontrado!');
            router.push('/farmacias/laboratorio/lista');
          }
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
          toast.error('Não foi possível carregar os dados do laboratório.');
        } finally {
          setLoading(false);
        }
      };
      fetchLaboratorio();
    }
  }, [lab_id, router]);

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Lógica especial para INPUT DE ARQUIVO
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setLogoFile(file); // Salva o arquivo para envio
      setPreview(URL.createObjectURL(file)); // Cria preview local imediato
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Uso de FORMDATA: Essencial para envio de arquivos + texto
    const formData = new FormData();
    formData.append("lab_nome", form.lab_nome);
    formData.append("lab_cnpj", form.lab_cnpj);
    formData.append("lab_endereco", form.lab_endereco);
    formData.append("lab_telefone", form.lab_telefone);
    formData.append("lab_email", form.lab_email);
    formData.append("lab_ativo", form.lab_ativo);

    // Só anexa 'lab_logo' se o usuário selecionou um NOVO arquivo.
    // Se não, o backend mantém a logo antiga.
    if (logoFile) {
      formData.append("lab_logo", logoFile);
    }

    try {
      // Método PUT para atualização
      await api.put(`/laboratorios/${lab_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Laboratório atualizado com sucesso!');
      setTimeout(() => {
        router.push('/farmacias/laboratorio/lista');
      }, 1500);

    } catch (error) {
      console.error("Erro ao atualizar:", error);
      const errorMsg = error.response?.data?.mensagem || "Verifique os dados e tente novamente.";
      toast.error(`Erro ao atualizar: ${errorMsg}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  return (
    <div className={styles.dashboard}>
      {/* Configuração do Toast Notification */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.6rem' },
          success: { style: { background: '#458B00' } },
          error: { style: { background: '#dc2626' } },
        }}
      />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className={styles.title}>Editar Laboratório</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Dinâmica */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (
                <img src={farmaciaInfo.farm_logo_url} alt="Logo" className={styles.logoImage} />
              )}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "Pharma-X"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
          </div>

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
                  {/* COLUNA 1 */}
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Informações do Laboratório</h3>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Nome do Laboratório</label><input className={styles.modernInput} type="text" name="lab_nome" value={form.lab_nome} onChange={handleChange} required /></div>
                    <div className={styles.formRow}><div className={styles.formGroup}><label className={styles.inputLabel}>CNPJ</label><input className={styles.modernInput} type="text" name="lab_cnpj" value={form.lab_cnpj} onChange={handleChange} required /></div><div className={styles.formGroup}><label className={styles.inputLabel}>Data de Cadastro</label><input className={styles.modernInput} type="date" value={dataCadastro} disabled /></div></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>E-mail</label><input className={styles.modernInput} type="email" name="lab_email" value={form.lab_email} onChange={handleChange} required /></div>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Telefone</label><input className={styles.modernInput} type="tel" name="lab_telefone" value={form.lab_telefone} onChange={handleChange} /></div>
                  </div>

                  {/* COLUNA 2 */}
                  <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Localização e Identidade Visual</h3>
                    <div className={styles.formGroup}><label className={styles.inputLabel}>Endereço Completo</label><input className={styles.modernInput} type="text" name="lab_endereco" value={form.lab_endereco} onChange={handleChange} required /></div>

                    {/* Upload de Logo */}
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Alterar Logo</label>
                      <div className={styles.fileUploadGroup}>
                        <input type="file" name="logo" onChange={handleChange} className={styles.fileInput} id="logo-upload" accept="image/*" />
                        <label htmlFor="logo-upload" className={styles.fileLabel}>
                          <span>📁</span>{logoFile ? "Alterar arquivo" : "Selecionar novo arquivo"}
                        </label>
                        {logoFile && (<span className={styles.fileName}>{logoFile.name}</span>)}
                      </div>
                    </div>

                    {/* Pré-visualização (Mostra a antiga ou a nova) */}
                    {preview && (
                      <div className={styles.formGroup}>
                        <label className={styles.inputLabel}>Pré-visualização</label>
                        <div className={styles.imagePreview}>
                          <img src={preview} alt="Pré-visualização do logo" className={styles.previewImage} />
                        </div>
                      </div>
                    )}
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