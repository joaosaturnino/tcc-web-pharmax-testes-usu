"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./cadastro.module.css";
import api from "../../../../services/api";

import { MdCheckCircle, MdError, MdUploadFile } from "react-icons/md";

export default function CadastroMedicamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ADICIONADO: Estado para armazenar os dados da farmácia
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [form, setForm] = useState({
    nome: "", dosagem: "", quantidade: "", tipo: "", forma: "",
    descricao: "", preco: "", laboratorio: "", imagem: null,
    codigoBarras: "",
  });

  const [errors, setErrors] = useState({
    nome: [], dosagem: [], quantidade: [], tipo: [], forma: [],
    descricao: [], preco: [], laboratorio: [], imagem: [], codigoBarras: []
  });

  const [touched, setTouched] = useState({});
  const [fileName, setFileName] = useState("");

  // useEffect para carregar dados da farmácia e código de barras da URL
  useEffect(() => {
    // ADICIONADO: Carrega informações da farmácia do localStorage
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }

    const codigoBarrasUrl = searchParams.get('codigoBarras');
    
    if (codigoBarrasUrl) {
      setForm(prevForm => ({ ...prevForm, codigoBarras: codigoBarrasUrl }));
      setTouched(prevTouched => ({ ...prevTouched, codigoBarras: true }));
      validateField('codigoBarras', codigoBarrasUrl);
    }
  }, [searchParams]); // Dependência atualizada para searchParams

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    if (name !== 'imagem') {
      validateField(name, form[name]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagem" && files) {
      const file = files[0] || null;
      setForm({ ...form, imagem: file });
      setFileName(file ? file.name : "");
      validateField(name, file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateField = (name, value) => {
    let fieldErrors = [];
    switch (name) {
      case 'nome':
        if (!value) fieldErrors.push('O nome do medicamento é obrigatório');
        else if (value.length < 3) fieldErrors.push('O nome deve ter pelo menos 3 caracteres');
        break;
      case 'dosagem':
        if (!value) fieldErrors.push('A dosagem é obrigatória');
        else if (!/^\d+(\.\d+)?(mg|mcg|g|ml|UI|%|ppm)$/i.test(value)) fieldErrors.push('Formato inválido (ex: 500mg, 10ml)');
        break;
      case 'quantidade':
        if (!value) fieldErrors.push('A quantidade é obrigatória');
        else if (!/^\d+\s+[a-zA-Z]+(s)?$/i.test(value)) {
            fieldErrors.push('Formato inválido. Use número seguido da unidade (ex: 30 comprimidos, 100 ml)');
        }
        break;
      case 'tipo':
        if (!value) fieldErrors.push('Selecione o tipo de produto');
        break;
      case 'forma':
        if (!value) fieldErrors.push('Selecione a forma farmacêutica');
        break;
      case 'descricao':
        if (!value) fieldErrors.push('A descrição é obrigatória');
        else if (value.length < 10) fieldErrors.push('A descrição deve ter pelo menos 10 caracteres');
        break;
      case 'preco':
        if (!value) fieldErrors.push('O preço é obrigatório');
        else if (parseFloat(value) <= 0) fieldErrors.push('O preço deve ser maior que zero');
        else if (parseFloat(value) > 10000) fieldErrors.push('O preço não pode ser superior a R$ 10.000,00');
        break;
      case 'laboratorio':
        if (!value) fieldErrors.push('Selecione o laboratório');
        break;
      case 'imagem':
        if (value) {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          const maxSize = 5 * 1024 * 1024; // 5MB

          if (!allowedTypes.includes(value.type)) {
            fieldErrors.push('Tipo de arquivo inválido. Use JPG, PNG, WEBP ou GIF.');
          }
          if (value.size > maxSize) {
            fieldErrors.push('A imagem não pode ter mais de 5MB.');
          }
        }
        break;
      case 'codigoBarras':
        if (!value) fieldErrors.push('O código de barras é obrigatório');
        else if (!/^\d{8,14}$/.test(value)) fieldErrors.push('Código de barras inválido (8-14 dígitos numéricos)');
        break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: fieldErrors }));
    return fieldErrors.length === 0;
  };

  const tipoMap = { 'Alopático': 1, 'Fitoterápico': 2, 'Genérico': 3, 'Homeopático': 4, 'Manipulado': 5, 'Referência': 6, 'Similar': 7 };
  const formaMap = { 'Comprimido': 1, 'Cápsula': 2, 'Pastilhas': 3, 'Drágeas': 4, 'Pós para Reconstituição': 5, 'Gotas': 6, 'Xarope': 7, 'Solução Oral': 8, 'Suspensão': 9, 'Comprimidos Sublinguais': 10, 'Soluções': 11, 'Suspensões Injetáveis': 12, 'Soluções Tópicas': 13, 'Pomadas': 14, 'Cremes': 15, 'Loção': 16, 'Gel': 17, 'Adesivos': 18, 'Spray': 19, 'Gotas Nasais': 20, 'Colírios': 21, 'Pomadas Oftálmicas': 22, 'Gotas Auriculares ou Otológicas': 23, 'Pomadas Auriculares': 24, 'Aerosol': 25, 'Comprimidos Vaginais': 26, 'Óvulos': 27, 'Supositórios': 28, 'Enemas': 29 };
  const laboratorioMap = { 'Neo Química': 1, 'EMS': 2, 'Eurofarma': 3, 'Aché': 4, 'União Química': 5, 'Medley': 6, 'Sanofi': 7, 'Geolab': 8, 'Merck': 9, 'Legrand': 10, 'Natulab': 11, 'Germed': 12, 'Prati Donaduzzi': 13, 'Biolab': 14, 'Hipera CH': 15, 'Sandoz': 16, 'Med Química': 17, 'Mantecorp Farmasa': 18 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isFormValid = true;
    setTouched(Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    for (const field in form) {
      if (!validateField(field, form[field])) {
        isFormValid = false;
      }
    }

    if (!isFormValid) {
      alert("Por favor, corrija os erros no formulário.");
      return;
    }

    setLoading(true);

    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        alert("Erro: Usuário não autenticado. Faça o login novamente.");
        setLoading(false);
        return;
      }
      
      const userData = JSON.parse(userDataString);
      const farmaciaId = userData.farm_id; 

      if (!farmaciaId) {
        alert("Erro: ID da farmácia não encontrado nos dados do usuário.");
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('med_nome', form.nome);
      formData.append('med_dosagem', form.dosagem);
      formData.append('med_quantidade', form.quantidade);
      formData.append('med_descricao', form.descricao);
      formData.append('med_preco', parseFloat(form.preco));
      formData.append('med_cod_barras', form.codigoBarras);
      formData.append('tipo_id', tipoMap[form.tipo]);
      formData.append('forma_id', formaMap[form.forma]);
      formData.append('lab_id', laboratorioMap[form.laboratorio]);
      formData.append('farmacia_id', farmaciaId);

      if (form.imagem) {
        formData.append('med_imagem', form.imagem);
      }
      
      const response = await api.post('/medicamentos', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.sucesso) {
          alert("Medicamento cadastrado com sucesso!");
          router.push("/farmacias/produtos/medicamentos");
      } else {
          alert(`Erro ao cadastrar: ${response.data.mensagem}`);
      }
    } catch (error) {
        if (error.response) {
            alert(error.response.data.mensagem + '\n' + (error.response.data.dados || ''));
        } else {
            alert('Erro na comunicação com o servidor. Tente novamente.');
            console.error("Erro ao enviar dados:", error);
        }
    } finally {
        setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const getValidationClass = (fieldName) => {
    if (!touched[fieldName]) return styles.formControl;
    return errors[fieldName]?.length > 0 ? `${styles.formControl} ${styles.error}` : `${styles.formControl} ${styles.success}`;
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className={styles.title}> Cadastro de Medicamento</h1>
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
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><a href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></a><a href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Medicamentos</span></a></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><a href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></a><a href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></a></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><a href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></a><a href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></a><a href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></a></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><a href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></a><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
          </aside>
          {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Novo Medicamento</h2>
              <p>Preencha os dados do novo medicamento</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações Básicas</h3>
                  <div className={getValidationClass('nome')}>
                    <label className={styles.inputLabel}>Nome do Medicamento</label>
                    <div className={styles.divInput}>
                      <input className={styles.modernInput} type="text" name="nome" value={form.nome} onChange={handleChange} onBlur={handleBlur} placeholder="Digite o nome do medicamento" required />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {touched.nome && errors.nome.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                  </div>
                  <div className={styles.formRow}>
                    <div className={getValidationClass('dosagem')}>
                      <label className={styles.inputLabel}>Dosagem</label>
                      <div className={styles.divInput}>
                        <input className={styles.modernInput} type="text" name="dosagem" value={form.dosagem} onChange={handleChange} onBlur={handleBlur} placeholder="Ex: 500mg" required />
                        <MdCheckCircle className={styles.sucesso} />
                        <MdError className={styles.erro} />
                      </div>
                      {touched.dosagem && errors.dosagem.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                    </div>
                    <div className={getValidationClass('quantidade')}>
                      <label className={styles.inputLabel}>Quantidade</label>
                      <div className={styles.divInput}>
                        <input className={styles.modernInput} type="text" name="quantidade" value={form.quantidade} onChange={handleChange} onBlur={handleBlur} placeholder="Ex: 30 comprimidos" required />
                        <MdCheckCircle className={styles.sucesso} />
                        <MdError className={styles.erro} />
                      </div>
                      {touched.quantidade && errors.quantidade.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={getValidationClass('preco')}>
                      <label className={styles.inputLabel}>Preço (R$)</label>
                      <div className={styles.divInput}>
                        <input className={styles.modernInput} type="number" name="preco" value={form.preco} onChange={handleChange} onBlur={handleBlur} min="0" step="0.01" placeholder="0,00" required />
                        <MdCheckCircle className={styles.sucesso} />
                        <MdError className={styles.erro} />
                      </div>
                      {touched.preco && errors.preco.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                    </div>
                    <div className={getValidationClass('codigoBarras')}>
                      <label className={styles.inputLabel}>Código de Barras</label>
                      <div className={styles.divInput}>
                          <input className={styles.modernInput} type="text" name="codigoBarras" value={form.codigoBarras} onChange={handleChange} onBlur={handleBlur} placeholder="Digite o código de barras" required />
                          <MdCheckCircle className={styles.sucesso} />
                          <MdError className={styles.erro} />
                      </div>
                      {touched.codigoBarras && errors.codigoBarras.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações Técnicas</h3>
                  <div className={getValidationClass('tipo')}>
                    <label className={styles.inputLabel}>Tipo de Produto</label>
                    <div className={styles.divInput}>
                      <select className={styles.modernSelect} name="tipo" value={form.tipo} onChange={handleChange} onBlur={handleBlur} required>
                        <option value="">Selecione o tipo</option>
                        {Object.keys(tipoMap).map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                      </select>
                    </div>
                    {touched.tipo && errors.tipo.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                  </div>
                  <div className={getValidationClass('forma')}>
                    <label className={styles.inputLabel}>Forma Farmacêutica</label>
                    <div className={styles.divInput}>
                      <select className={styles.modernSelect} name="forma" value={form.forma} onChange={handleChange} onBlur={handleBlur} required>
                        <option value="">Selecione a forma</option>
                        {Object.keys(formaMap).map(forma => <option key={forma} value={forma}>{forma}</option>)}
                      </select>
                    </div>
                    {touched.forma && errors.forma.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                  </div>
                  <div className={getValidationClass('laboratorio')}>
                    <label className={styles.inputLabel}>Laboratório</label>
                    <div className={styles.divInput}>
                      <select className={styles.modernSelect} name="laboratorio" value={form.laboratorio} onChange={handleChange} onBlur={handleBlur} required>
                        <option value="">Selecione o laboratório</option>
                        {Object.keys(laboratorioMap).map(lab => <option key={lab} value={lab}>{lab}</option>)}
                      </select>
                    </div>
                    {touched.laboratorio && errors.laboratorio.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                  </div>
                  <div className={getValidationClass('imagem')}>
                    <label className={styles.inputLabel}>Imagem do Produto</label>
                    <div className={styles.divInput}>
                      <input 
                        id="file-upload" 
                        className={styles.fileInput} 
                        type="file" 
                        name="imagem" 
                        onChange={handleChange} 
                        onBlur={handleBlur} 
                        accept="image/png, image/jpeg, image/webp, image/gif"
                      />
                      <label htmlFor="file-upload" className={styles.fileInputLabel}>
                        <MdUploadFile />
                        <span>{fileName || "Escolher arquivo (Opcional)"}</span>
                      </label>
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {touched.imagem && errors.imagem.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                  </div>
                </div>
              </div>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Descrição</h3>
                <div className={getValidationClass('descricao')}>
                  <label className={styles.inputLabel}>Descrição</label>
                  <div className={styles.divInput}>
                    <textarea className={styles.modernTextarea} name="descricao" value={form.descricao} onChange={handleChange} onBlur={handleBlur} rows="4" placeholder="Digite uma descrição para o medicamento" required></textarea>
                  </div>
                  {touched.descricao && errors.descricao.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/produtos/medicamentos")} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? (<><span className={styles.loadingSpinnerSmall}></span>Cadastrando...</>) : (<>Cadastrar Medicamento</>)}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}