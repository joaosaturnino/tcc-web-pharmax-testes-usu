"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./laboratorio.module.css";
import api from "../../../services/api";

// Ícones para validação visual nos inputs
import { MdCheckCircle, MdError } from "react-icons/md";
// Toast: Biblioteca para notificações flutuantes bonitas
import toast, { Toaster } from "react-hot-toast";

export default function CadastroLaboratorioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  // --- ESTADO DO FORMULÁRIO ---
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    logo: null, // Armazena o objeto File da imagem
  });

  // Estado para a URL de pré-visualização da imagem
  const [preview, setPreview] = useState(null);

  // Classes CSS para controle visual de validação
  const valDefault = styles.formControl;
  const valSucesso = `${styles.formControl} ${styles.success}`;
  const valErro = `${styles.formControl} ${styles.error}`;

  // Estado que controla se cada campo é válido ou inválido
  const [valida, setValida] = useState({
    nome: { validado: valDefault, mensagem: [] },
    cnpj: { validado: valDefault, mensagem: [] },
    endereco: { validado: valDefault, mensagem: [] },
    telefone: { validado: valDefault, mensagem: [] },
    email: { validado: valDefault, mensagem: [] },
    logo: { validado: valDefault, mensagem: [] },
  });

  // Carrega dados da farmácia do LocalStorage na montagem
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }
  }, []);

  // --- HANDLER GENÉRICO DE INPUTS ---
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // LÓGICA ESPECÍFICA PARA ARQUIVOS (IMAGEM)
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      
      // Validação Imediata do Arquivo
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
          setValida(prev => ({ ...prev, logo: { validado: valErro, mensagem: ["O arquivo deve ter no máximo 5MB."] } }));
          setPreview(null);
        } else {
          setValida(prev => ({ ...prev, logo: { validado: valSucesso, mensagem: [] } }));
          // Cria uma URL temporária para mostrar a imagem antes do upload
          setPreview(URL.createObjectURL(file));
        }
      } else {
        setValida(prev => ({ ...prev, logo: { validado: valErro, mensagem: ["Por favor, selecione um arquivo de imagem."] } }));
        setPreview(null);
      }
    } else {
      // Lógica padrão para campos de texto
      setForm({ ...form, [name]: value });
    }
  };

  // --- FUNÇÕES DE VALIDAÇÃO (Retornam true/false e atualizam visual) ---
  function validaNome() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.nome === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome do laboratório é obrigatório');
    } else if (form.nome.length < 3) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome deve ter pelo menos 3 caracteres');
    }
    setValida(prev => ({ ...prev, nome: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaCNPJ() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const cnpj = form.cnpj.replace(/\D/g, '');
    if (cnpj === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CNPJ é obrigatório');
    } else if (cnpj.length !== 14 || !validaDigitosCNPJ(cnpj)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('CNPJ inválido');
    }
    setValida(prev => ({ ...prev, cnpj: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  // Placeholder para lógica real de dígitos verificadores
  function validaDigitosCNPJ(cnpj) { return true; }

  function validaEndereco() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.endereco === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O endereço é obrigatório');
    }
    setValida(prev => ({ ...prev, endereco: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaTelefone() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const telefone = form.telefone.replace(/\D/g, '');
    if (telefone && (telefone.length < 10 || telefone.length > 11)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Telefone inválido');
    }
    setValida(prev => ({ ...prev, telefone: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaEmail() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (form.email === "") {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O e-mail é obrigatório');
    } else if (!emailRegex.test(form.email)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um e-mail válido');
    }
    setValida(prev => ({ ...prev, email: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaLogo() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.logo) {
      if (!form.logo.type.startsWith("image/")) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('O arquivo deve ser uma imagem.');
      } else if (form.logo.size > 5 * 1024 * 1024) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('O arquivo deve ter no máximo 5MB.');
      }
    }
    setValida(prev => ({ ...prev, logo: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  // --- ENVIO DO FORMULÁRIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifica todas as validações antes de enviar
    if (!validaNome() || !validaCNPJ() || !validaEndereco() || !validaTelefone() || !validaEmail() || !validaLogo()) {
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    // USO DE FORMDATA: Essencial para enviar arquivos (binários) + dados de texto
    const formData = new FormData();
    formData.append('lab_nome', form.nome);
    formData.append('lab_cnpj', form.cnpj.replace(/\D/g, '')); // Remove formatação
    formData.append('lab_endereco', form.endereco);
    formData.append('lab_telefone', form.telefone.replace(/\D/g, ''));
    formData.append('lab_email', form.email);
    
    if (form.logo) {
      formData.append('lab_logo', form.logo); // Anexa o arquivo
    }
    
    // Campos automáticos
    formData.append('lab_data_cadastro', new Date().toISOString());
    formData.append('lab_data_atualizacao', new Date().toISOString());
    formData.append('lab_ativo', 1);

    try {
      // O Axios detecta FormData e ajusta o Content-Type para 'multipart/form-data' automaticamente,
      // mas é boa prática explicitar ou verificar headers.
      const response = await api.post('/laboratorios', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      if (response.data.sucesso) {
        toast.success("Laboratório cadastrado com sucesso!");
        setTimeout(() => {
          router.push("/farmacias/laboratorio/lista");
        }, 1500);
      } else {
        toast.error('Erro ao cadastrar: ' + response.data.mensagem);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.mensagem || 'Erro na comunicação com o servidor. Tente novamente.';
      toast.error(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  return (
    <div className={styles.dashboard}>
      {/* Configuração Global do Toast */}
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
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">
            ☰
          </button>
          <h1 className={styles.title}>Cadastro de Laboratório</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && <img src={farmaciaInfo.farm_logo_url} alt={`Logo`} className={styles.logoImage} />}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "Pharma-X"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
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
              <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                <span className={styles.navText}>Funcionários</span>
              </Link>
              <Link href="/farmacias/laboratorio/lista" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navText}>Laboratórios</span>
              </Link>
            </div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>

        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}

        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Novo Laboratório</h2>
              <p>Preencha os dados do novo laboratório farmacêutico</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGrid}>
                
                {/* Coluna 1: Informações Básicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações do Laboratório</h3>
                  
                  <div className={valida.nome.validado}>
                      <label className={styles.inputLabel}>Nome do Laboratório</label>
                      <div className={styles.divInput}>
                          <input className={styles.modernInput} type="text" name="nome" value={form.nome} onChange={handleChange} onBlur={validaNome} placeholder="Digite o nome" required />
                          <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                      </div>
                      {valida.nome.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}
                  </div>

                  <div className={valida.cnpj.validado}>
                      <label className={styles.inputLabel}>CNPJ</label>
                      <div className={styles.divInput}>
                          <input className={styles.modernInput} type="text" name="cnpj" value={form.cnpj} onChange={handleChange} onBlur={validaCNPJ} placeholder="00.000.000/0000-00" required />
                          <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                      </div>
                      {valida.cnpj.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}
                  </div>

                  <div className={valida.email.validado}>
                      <label className={styles.inputLabel}>E-mail</label>
                      <div className={styles.divInput}>
                          <input className={styles.modernInput} type="email" name="email" value={form.email} onChange={handleChange} onBlur={validaEmail} placeholder="contato@laboratorio.com" required />
                          <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                      </div>
                      {valida.email.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}
                  </div>

                  <div className={valida.telefone.validado}>
                      <label className={styles.inputLabel}>Telefone</label>
                      <div className={styles.divInput}>
                          <input className={styles.modernInput} type="tel" name="telefone" value={form.telefone} onChange={handleChange} onBlur={validaTelefone} placeholder="(00) 00000-0000" />
                          <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                      </div>
                      {valida.telefone.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}
                  </div>
                </div>

                {/* Coluna 2: Endereço e Logo */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Localização e Identidade Visual</h3>
                  
                  <div className={valida.endereco.validado}>
                      <label className={styles.inputLabel}>Endereço Completo</label>
                      <div className={styles.divInput}>
                          <input className={styles.modernInput} type="text" name="endereco" value={form.endereco} onChange={handleChange} onBlur={validaEndereco} placeholder="Endereço completo" required />
                          <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                      </div>
                      {valida.endereco.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}
                  </div>

                  {/* Upload de Arquivo */}
                  <div className={valida.logo.validado}>
                      <label className={styles.inputLabel}>Logo do Laboratório</label>
                      <div className={styles.fileUploadGroup}>
                          <input type="file" name="logo" onChange={handleChange} className={styles.fileInput} id="logo-upload" accept="image/*" />
                          <label htmlFor="logo-upload" className={styles.fileLabel}>
                              <span>📁</span>Selecionar arquivo
                          </label>
                          {form.logo && (<span className={styles.fileName}>{form.logo.name}</span>)}
                      </div>
                      {valida.logo.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}
                  </div>

                  {/* Pré-visualização da Imagem */}
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

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/laboratorio/lista")}>Cancelar</button>
                <button type="submit" className={styles.submitButton}>Cadastrar Laboratório</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}