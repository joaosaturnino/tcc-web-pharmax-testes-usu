"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./edita.module.css";

export default function EdicaoLaboratorio() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Estado do laboratório
  const [laboratorio, setLaboratorio] = useState({
    id: "",
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    website: "",
    responsavelTecnico: "",
    registroAnvisa: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [laboratoriosExistentes, setLaboratoriosExistentes] = useState([]);
  const [editando, setEditando] = useState(false);

  // Carregar laboratórios existentes
  useEffect(() => {
    const carregarLaboratorios = () => {
      try {
        const laboratoriosSalvos = localStorage.getItem("laboratorios");
        if (laboratoriosSalvos) {
          const parsed = JSON.parse(laboratoriosSalvos);
          setLaboratoriosExistentes(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("Erro ao carregar laboratórios:", error);
        setLaboratoriosExistentes([]);
      }
    };

    carregarLaboratorios();
  }, []);

  // Verificar se está editando um laboratório existente
  useEffect(() => {
    const laboratorioEditavel = localStorage.getItem("laboratorioEditavel");
    if (laboratorioEditavel) {
      try {
        const dados = JSON.parse(laboratorioEditavel);
        setLaboratorio(dados);
        setEditando(true);
        
        if (dados.logo && typeof dados.logo === 'string') {
          setPreview(dados.logo);
        }
        
        localStorage.removeItem("laboratorioEditavel");
      } catch (error) {
        console.error("Erro ao carregar laboratório para edição:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaboratorio({ ...laboratorio, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLaboratorio({ ...laboratorio, logo: file });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLaboratorioExistenteClick = (lab) => {
    setLaboratorio(lab);
    setEditando(true);
    if (lab.logo) {
      setPreview(lab.logo);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (!laboratorio.nome || !laboratorio.cnpj || !laboratorio.email) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    // Validar CNPJ
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(laboratorio.cnpj)) {
      alert("Por favor, insira um CNPJ válido no formato 00.000.000/0000-00");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(laboratorio.email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    try {
      const dadosParaSalvar = {
        ...laboratorio,
        id: editando ? laboratorio.id : Date.now(),
        timestamp: new Date().toISOString(),
        logo: preview
      };

      let laboratoriosAtualizados = [];
      
      if (editando) {
        laboratoriosAtualizados = laboratoriosExistentes.map(lab =>
          lab.id === laboratorio.id ? dadosParaSalvar : lab
        );
      } else {
        laboratoriosAtualizados = [...laboratoriosExistentes, dadosParaSalvar];
      }

      localStorage.setItem("laboratorios", JSON.stringify(laboratoriosAtualizados));
      
      alert(`Laboratório ${editando ? 'atualizado' : 'cadastrado'} com sucesso!`);
      router.push("/farmacias/laboratorio/lista");
      
    } catch (error) {
      console.error("Erro ao salvar laboratório:", error);
      alert("Erro ao salvar laboratório. Tente novamente.");
    }
  };

  const handleCancelar = () => {
    if (editando) {
      setEditando(false);
      setLaboratorio({
        id: "",
        nome: "",
        cnpj: "",
        endereco: "",
        telefone: "",
        email: "",
        website: "",
        responsavelTecnico: "",
        registroAnvisa: "",
        logo: null,
      });
      setPreview(null);
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Não Fixa */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
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

          <div className={styles.navSection}>
            <p className={styles.navLabel}>Sistema</p>
            <a href="/config" className={styles.navLink}>
              <span className={styles.navIcon}>⚙️</span>
              <span className={styles.navText}>Configurações</span>
            </a>
            <button className={styles.navLink}>
              <span className={styles.navIcon}>🚪</span>
              <span className={styles.navText}>Sair</span>
            </button>
          </div>
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
          <div>
            <h1 className={styles.pageTitle}>
              {editando ? 'Editar Laboratório' : 'Cadastro de Laboratório'}
            </h1>
            <p className={styles.pageSubtitle}>
              {editando 
                ? 'Atualize as informações do laboratório' 
                : 'Cadastre um novo laboratório no sistema'}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.notificationBtn}>
              <span className={styles.bellIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
            <div className={styles.userMenu}>
              <span className={styles.userInitials}>AD</span>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Seção de Laboratórios Existentes */}
          {laboratoriosExistentes.length > 0 && !editando && (
            <div className={styles.existingSection}>
              <h3 className={styles.sectionTitle}>Laboratórios Existentes</h3>
              <p className={styles.sectionDescription}>
                Selecione um laboratório para editar ou cadastre um novo.
              </p>
              
              <div className={styles.laboratoriosGrid}>
                {laboratoriosExistentes.slice(0, 4).map((lab) => (
                  <div 
                    key={lab.id} 
                    className={styles.laboratorioCard}
                    onClick={() => handleLaboratorioExistenteClick(lab)}
                  >
                    <div className={styles.labImage}>
                      {lab.logo ? (
                        <img src={lab.logo} alt={lab.nome} className={styles.labPreview} />
                      ) : (
                        <span className={styles.labIcon}>🏭</span>
                      )}
                    </div>
                    <div className={styles.labInfo}>
                      <h4 className={styles.labNome}>{lab.nome}</h4>
                      <p className={styles.labCnpj}>{lab.cnpj}</p>
                      <p className={styles.labEmail}>{lab.email}</p>
                    </div>
                    <div className={styles.labAction}>
                      <span className={styles.editBadge}>Editar</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulário de Laboratório */}
          <div className={styles.formSection}>
            <div className={styles.contentCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  {/* Coluna 1 - Informações Básicas */}
                  <div className={styles.formColumn}>
                    <h3 className={styles.columnTitle}>Informações Básicas</h3>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Nome do Laboratório *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        placeholder="Ex: Laboratório PharmaX"
                        value={laboratorio.nome}
                        onChange={handleChange}
                        required
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        CNPJ *
                      </label>
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
                      <label className={styles.inputLabel}>
                        E-mail *
                      </label>
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
                      <label className={styles.inputLabel}>
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        placeholder="(00) 00000-0000"
                        value={laboratorio.telefone}
                        onChange={handleChange}
                        className={styles.modernInput}
                      />
                    </div>
                  </div>

                  {/* Coluna 2 - Informações Adicionais */}
                  <div className={styles.formColumn}>
                    <h3 className={styles.columnTitle}>Informações Adicionais</h3>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Endereço Completo
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        placeholder="Endereço completo do laboratório"
                        value={laboratorio.endereco}
                        onChange={handleChange}
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        placeholder="https://www.laboratorio.com"
                        value={laboratorio.website}
                        onChange={handleChange}
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Responsável Técnico
                      </label>
                      <input
                        type="text"
                        name="responsavelTecnico"
                        placeholder="Nome do responsável técnico"
                        value={laboratorio.responsavelTecnico}
                        onChange={handleChange}
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Registro ANVISA
                      </label>
                      <input
                        type="text"
                        name="registroAnvisa"
                        placeholder="Número do registro"
                        value={laboratorio.registroAnvisa}
                        onChange={handleChange}
                        className={styles.modernInput}
                      />
                    </div>
                  </div>

                  {/* Coluna 3 - Logo */}
                  <div className={styles.formColumn}>
                    <h3 className={styles.columnTitle}>Logo do Laboratório</h3>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Logo/Marca
                      </label>
                      <div className={styles.fileUpload}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className={styles.fileInput}
                          id="laboratorio-logo"
                        />
                        <label htmlFor="laboratorio-logo" className={styles.fileLabel}>
                          <span className={styles.uploadIcon}>📷</span>
                          {laboratorio.logo ? 'Alterar logo' : 'Selecionar logo'}
                        </label>
                      </div>
                    </div>

                    {preview && (
                      <div className={styles.previewContainer}>
                        <label className={styles.inputLabel}>Pré-visualização</label>
                        <div className={styles.previewBox}>
                          <img
                            src={preview}
                            alt="Pré-visualização do logo"
                            className={styles.logoPreview}
                          />
                          <button
                            type="button"
                            className={styles.removeImageBtn}
                            onClick={() => {
                              setPreview(null);
                              setLaboratorio({ ...laboratorio, logo: null });
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCancelar}
                  >
                    {editando ? 'Cancelar Edição' : 'Cancelar'}
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    <span className={styles.buttonIcon}>💾</span>
                    {editando ? 'Atualizar Laboratório' : 'Cadastrar Laboratório'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}