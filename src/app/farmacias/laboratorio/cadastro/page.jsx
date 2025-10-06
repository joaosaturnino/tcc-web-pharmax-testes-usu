"use client";

import { useState, useEffect } from "react"; // ADICIONADO: useEffect
import { useRouter } from "next/navigation";
import styles from "./laboratorio.module.css";
import api from "../../../services/api";

// Ícones para validação
import { MdCheckCircle, MdError } from "react-icons/md";

export default function CadastroLaboratorioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ADICIONADO: Estado para armazenar os dados da farmácia
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);

  const valDefault = styles.formControl;
  const valSucesso = `${styles.formControl} ${styles.success}`;
  const valErro = `${styles.formControl} ${styles.error}`;

  const [valida, setValida] = useState({
    nome: { validado: valDefault, mensagem: [] },
    cnpj: { validado: valDefault, mensagem: [] },
    endereco: { validado: valDefault, mensagem: [] },
    telefone: { validado: valDefault, mensagem: [] },
    email: { validado: valDefault, mensagem: [] },
    logo: { validado: valDefault, mensagem: [] },
  });

  // ADICIONADO: useEffect para carregar dados da farmácia ao montar a página
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }
  }, []);


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          setValida(prev => ({ ...prev, logo: { validado: valErro, mensagem: ["O arquivo deve ter no máximo 5MB."] } }));
        } else {
          setValida(prev => ({ ...prev, logo: { validado: valSucesso, mensagem: [] } }));
          setPreview(URL.createObjectURL(file));
        }
      } else {
        setValida(prev => ({ ...prev, logo: { validado: valErro, mensagem: ["Por favor, selecione apenas arquivos de imagem."] } }));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // --- Funções de validação (permanecem as mesmas) ---
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
    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaCNPJ() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const cnpj = form.cnpj.replace(/\D/g, '');
    if (cnpj === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CNPJ é obrigatório');
    } else if (cnpj.length !== 14) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CNPJ deve ter 14 dígitos');
    } else if (!validaDigitosCNPJ(cnpj)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('CNPJ inválido');
    }
    setValida(prev => ({ ...prev, cnpj: objTemp }));
    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaDigitosCNPJ(cnpj) {
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    return true;
  }

  function validaEndereco() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.endereco === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O endereço é obrigatório');
    } else if (form.endereco.length < 10) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um endereço completo');
    }
    setValida(prev => ({ ...prev, endereco: objTemp }));
    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaTelefone() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const telefone = form.telefone.replace(/\D/g, '');
    if (telefone && (telefone.length < 10 || telefone.length > 11)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Telefone inválido');
    }
    setValida(prev => ({ ...prev, telefone: objTemp }));
    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function checkEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }

  function validaEmail() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.email === "") {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O e-mail é obrigatório');
    } else if (!checkEmail(form.email)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um e-mail válido');
    }
    setValida(prev => ({ ...prev, email: objTemp }));
    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaLogo() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.logo) {
      if (!form.logo.type.startsWith("image/")) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('Por favor, selecione apenas arquivos de imagem');
      } else if (form.logo.size > 5 * 1024 * 1024) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('O arquivo deve ter no máximo 5MB');
      }
    }
    setValida(prev => ({ ...prev, logo: objTemp }));
    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let itensValidados = 0;
    itensValidados += validaNome();
    itensValidados += validaCNPJ();
    itensValidados += validaEndereco();
    itensValidados += validaTelefone();
    itensValidados += validaEmail();
    itensValidados += validaLogo();

    if (itensValidados !== 6) {
      alert("Por favor, corrija os erros no formulário.");
      return;
    }

    const formData = new FormData();
    formData.append('lab_nome', form.nome);
    formData.append('lab_cnpj', form.cnpj.replace(/\D/g, ''));
    formData.append('lab_endereco', form.endereco);
    formData.append('lab_telefone', form.telefone.replace(/\D/g, ''));
    formData.append('lab_email', form.email);
    if (form.logo) {
      formData.append('lab_logo', form.logo);
    }
    formData.append('lab_data_cadastro', new Date().toISOString());
    formData.append('lab_data_atualizacao', new Date().toISOString());
    formData.append('lab_ativo', 1);

    try {
      const response = await api.post('/laboratorios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.sucesso) {
        alert("Laboratório cadastrado com sucesso!");
        router.push("/farmacias/laboratorio/lista");
      } else {
        alert('Erro ao cadastrar: ' + response.data.mensagem);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.mensagem + '\n' + error.response.data.dados);
      } else {
        alert('Erro na comunicação com o servidor. Tente novamente.');
      }
    }
  };

  const handleLogout = async () => {
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
          >
            ☰
          </button>
          <h1 className={styles.title}>Cadastro de Laboratório</h1>
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
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <a
                  href="/farmacias/favoritos"
                  className={styles.navLink}
                >
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
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Funcionários</span>
                </a>
                <a href="/farmacias/laboratorio/lista" className={`${styles.navLink} ${styles.active}`}>
                  <span className={styles.navText}>Laboratórios</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <a
                  href="/farmacias/relatorios/favoritos"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </a>
                <a
                  href="/farmacias/relatorios/funcionarios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </a>
                <a
                  href="/farmacias/relatorios/laboratorios"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </a>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <a
                  href="/farmacias/perfil"
                  className={styles.navLink}
                >
                  <span className={styles.navText}>Meu Perfil</span>
                </a>
                <button
                  onClick={handleLogout}
                  className={styles.navLink}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
        </aside>

        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Novo Laboratório</h2>
              <p>Preencha os dados do novo laboratório farmacêutico</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações do Laboratório
                  </h3>
                  <div className={valida.nome.validado}>
                    <label className={styles.inputLabel}>Nome do Laboratório *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome do laboratório"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.nome.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                  <div className={valida.cnpj.validado}>
                    <label className={styles.inputLabel}>CNPJ *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="cnpj"
                        value={form.cnpj}
                        onChange={handleChange}
                        placeholder="00.000.000/0000-00"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.cnpj.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                  <div className={valida.email.validado}>
                    <label className={styles.inputLabel}>E-mail *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contato@laboratorio.com"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.email.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                  <div className={valida.telefone.validado}>
                    <label className={styles.inputLabel}>Telefone</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="tel"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.telefone.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                </div>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Localização e Identidade Visual
                  </h3>
                  <div className={valida.endereco.validado}>
                    <label className={styles.inputLabel}>Endereço Completo *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="endereco"
                        value={form.endereco}
                        onChange={handleChange}
                        placeholder="Endereço completo"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.endereco.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                  <div className={valida.logo.validado}>
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
                        <span>📁</span>
                        Selecionar arquivo
                      </label>
                      {form.logo && (
                        <span className={styles.fileName}>
                          {form.logo.name}
                        </span>
                      )}
                    </div>
                    {valida.logo.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
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
                  Cadastrar Laboratório
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}