"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./cadastro.module.css";
import api from "../../../../services/api";
import { MdCheckCircle, MdError, MdUploadFile } from "react-icons/md";
// === MUDANÇA: Importado o 'react-hot-toast' ===
import toast, { Toaster } from "react-hot-toast";

export default function CadastroMedicamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [form, setForm] = useState({
    nome: "", dosagem: "", quantidade: "", tipo: "", forma: "",
    descricao: "", preco: "", laboratorio: "", imagem: null,
    codigoBarras: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [fileName, setFileName] = useState("");

  // Estados para Tipo de Produto
  const [tiposList, setTiposList] = useState([]);
  const [tiposError, setTiposError] = useState(null);
  const [loadingTipos, setLoadingTipos] = useState(true);

  // Estados para Forma Farmacêutica
  const [formaList, setFormaList] = useState([]);
  const [formaError, setFormaError] = useState(null);
  const [loadingFormas, setLoadingFormas] = useState(true);

  // Estados para Laboratório
  const [labList, setLabList] = useState([]);
  const [labError, setLabError] = useState(null);
  const [loadingLabs, setLoadingLabs] = useState(true);

  useEffect(() => {
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
  }, [searchParams]);

  // useEffect para buscar os Tipos de Produto
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setLoadingTipos(true);
        setTiposError(null);
        const response = await api.get('/tipoproduto');

        if (response.data && Array.isArray(response.data.dados)) {
          setTiposList(response.data.dados);
        } else {
          setTiposError("Formato de resposta inesperado (Tipos).");
        }
      } catch (error) {
        console.error("Erro ao buscar tipos:", error);
        setTiposError("Não foi possível carregar os tipos.");
      } finally {
        setLoadingTipos(false);
      }
    };
    fetchTipos();
  }, []);

  // useEffect para buscar as Formas Farmacêuticas
  useEffect(() => {
    const fetchFormas = async () => {
      try {
        setLoadingFormas(true);
        setFormaError(null);
        const response = await api.get('/farmaceutica');

        if (response.data && Array.isArray(response.data.dados)) {
          setFormaList(response.data.dados);
        } else {
          setFormaError("Formato de resposta inesperado (Formas).");
        }
      } catch (error) {
        console.error("Erro ao buscar formas:", error);
        setFormaError("Não foi possível carregar as formas.");
      } finally {
        setLoadingFormas(false);
      }
    };
    fetchFormas();
  }, []);

  // useEffect para buscar os Laboratórios
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoadingLabs(true);
        setLabError(null);
        const response = await api.get('/todoslab');

        if (response.data && Array.isArray(response.data.dados)) {
          setLabList(response.data.dados);
        } else {
          setLabError("Formato de resposta inesperado (Laboratórios).");
        }
      } catch (error) {
        console.error("Erro ao buscar laboratórios:", error);
        setLabError("Não foi possível carregar os laboratórios.");
      } finally {
        setLoadingLabs(false);
      }
    };
    fetchLabs();
  }, []);


  const handleBlur = (e) => {
    const { name } = e.target;
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
    validateField(name, form[name]);
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
      if (touched[name]) {
        validateField(name, value);
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isFormValid = true;
    const allTouched = Object.keys(form).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    for (const field in form) {
      if (!validateField(field, form[field])) {
        isFormValid = false;
      }
    }

    if (tiposError || formaError || labError) {
      // === MUDANÇA: Substituído alert() por toast.error() ===
      toast.error("Erro ao carregar dados (tipos, formas ou laboratórios). Recarregue a página.", { duration: 5000 });
      return;
    }

    if (!isFormValid) {
      // === MUDANÇA: Substituído alert() por toast.error() ===
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    setLoading(true);

    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) throw new Error("Usuário não autenticado. Faça o login novamente.");

      const userData = JSON.parse(userDataString);
      const farmaciaId = userData.farm_id;
      if (!farmaciaId) throw new Error("ID da farmácia não encontrado nos dados do usuário.");

      const formData = new FormData();
      formData.append('med_nome', form.nome);
      formData.append('med_dosagem', form.dosagem);
      formData.append('med_quantidade', form.quantidade);
      formData.append('med_descricao', form.descricao);
      formData.append('med_preco', parseFloat(form.preco));
      formData.append('med_cod_barras', form.codigoBarras);
      formData.append('tipo_id', form.tipo);
      formData.append('forma_id', form.forma);
      formData.append('lab_id', form.laboratorio);
      formData.append('farmacia_id', farmaciaId);

      if (form.imagem) {
        formData.append('med_imagem', form.imagem);
      }

      const response = await api.post('/medicamentos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.sucesso) {
        // === MUDANÇA: Substituído alert() por toast.success() ===
        toast.success("Medicamento cadastrado com sucesso!");
        router.push("/farmacias/produtos/medicamentos");
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error) {
      // === MUDANÇA: Substituído alert() por toast.error() ===
      if (error.response) {
        const errorMsg = error.response.data.mensagem + '\n' + (error.response.data.dados || '');
        toast.error(errorMsg, { duration: 5000 });
      } else {
        toast.error(error.message || 'Erro na comunicação com o servidor. Tente novamente.');
        console.error("Erro ao enviar dados:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
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
      {/* === MUDANÇA: Adicionado o <Toaster /> === */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '1.5rem',
            padding: '1.6rem',
          },
          success: {
            style: {
              background: '#458B00',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">☰</button>
          <h1 className={styles.title}>Cadastro de Medicamento</h1>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
              {farmaciaInfo?.farm_logo_url && (<img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />)}
              <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button>
          </div>
          <nav className={styles.nav}>
            <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Medicamentos</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
            <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ all: 'unset', cursor: 'pointer', width: '100%' }}><span className={styles.navText}>Sair</span></button></div>
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
              <h3 className={styles.sectionTitle}>Informações Básicas</h3>
              <div className={styles.formGrid}>
                <div className={getValidationClass('nome')}><label className={styles.inputLabel}>Nome do Medicamento</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="nome" value={form.nome} onChange={handleChange} onBlur={handleBlur} placeholder="Digite o nome do medicamento" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{touched.nome && errors.nome?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>
                <div className={styles.formRow}>
                  <div className={getValidationClass('dosagem')}><label className={styles.inputLabel}>Dosagem</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="dosagem" value={form.dosagem} onChange={handleChange} onBlur={handleBlur} placeholder="Ex: 500mg" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{touched.dosagem && errors.dosagem?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>
                  <div className={getValidationClass('quantidade')}><label className={styles.inputLabel}>Quantidade</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="quantidade" value={form.quantidade} onChange={handleChange} onBlur={handleBlur} placeholder="Ex: 30 comprimidos" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{touched.quantidade && errors.quantidade?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>
                </div>
                <div className={getValidationClass('preco')}><label className={styles.inputLabel}>Preço (R$)</label><div className={styles.divInput}><input className={styles.modernInput} type="number" name="preco" value={form.preco} onChange={handleChange} onBlur={handleBlur} min="0" step="0.01" placeholder="0,00" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{touched.preco && errors.preco?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>
                <div className={getValidationClass('codigoBarras')}><label className={styles.inputLabel}>Código de Barras</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="codigoBarras" value={form.codigoBarras} onChange={handleChange} onBlur={handleBlur} placeholder="Digite o código de barras" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{touched.codigoBarras && errors.codigoBarras?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>
              </div>

              <h3 className={styles.sectionTitle}>Informações Técnicas</h3>
              <div className={styles.formGrid}>

                {/* Campo Tipo de Produto (Dinâmico) */}
                <div className={getValidationClass('tipo')}>
                  <label className={styles.inputLabel}>Tipo de Produto</label>
                  <div className={styles.divInput}>
                    <select
                      className={styles.modernSelect}
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={loadingTipos}
                    >
                      <option value="">
                        {loadingTipos ? "Carregando tipos..." : "Selecione o tipo"}
                      </option>
                      {tiposList.map(tipo => (
                        <option key={tipo.tipo_id} value={tipo.tipo_id}>
                          {tipo.nome_tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  {tiposError && <small className={styles.small}>{tiposError}</small>}
                  {touched.tipo && errors.tipo?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                </div>

                {/* MODIFICADO: Campo Forma Farmacêutica (Dinâmico) */}
                <div className={getValidationClass('forma')}>
                  <label className={styles.inputLabel}>Forma Farmacêutica</label>
                  <div className={styles.divInput}>
                    <select
                      className={styles.modernSelect}
                      name="forma"
                      value={form.forma}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={loadingFormas}
                    >
                      <option value="">
                        {loadingFormas ? "Carregando formas..." : "Selecione a forma"}
                      </option>

                      {formaList.map(forma => (
                        <option key={forma.forma_id} value={forma.forma_id}>
                          {forma.forma_nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formaError && <small className={styles.small}>{formaError}</small>}
                  {touched.forma && errors.forma?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                </div>

                {/* MODIFICADO: Campo Laboratório (Dinâmico) */}
                <div className={getValidationClass('laboratorio')}>
                  <label className={styles.inputLabel}>Laboratório</label>
                  <div className={styles.divInput}>
                    <select
                      className={styles.modernSelect}
                      name="laboratorio"
                      value={form.laboratorio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={loadingLabs}
                    >
                      <option value="">
                        {loadingLabs ? "Carregando laboratórios..." : "Selecione o laboratório"}
                      </option>

                      {labList.map(lab => (
                        <option key={lab.lab_id} value={lab.lab_id}>
                          {lab.lab_nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  {labError && <small className={styles.small}>{labError}</small>}
                  {touched.laboratorio && errors.laboratorio?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}
                </div>

                {/* Campo Imagem (permanece igual) */}
                <div className={getValidationClass('imagem')}><label className={styles.inputLabel}>Imagem do Produto</label><div className={styles.divInput}><input id="file-upload" className={styles.fileInput} type="file" name="imagem" onChange={handleChange} onBlur={handleBlur} accept="image/png, image/jpeg, image/webp, image/gif" /><label htmlFor="file-upload" className={styles.fileInputLabel}><MdUploadFile /><span>{fileName || "Escolher arquivo (Opcional)"}</span></label></div>{touched.imagem && errors.imagem?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>
              </div>

              <h3 className={styles.sectionTitle}>Descrição</h3>
              <div className={getValidationClass('descricao')}><label className={styles.inputLabel}>Descrição do Medicamento</label><div className={styles.divInput}><textarea className={styles.modernTextarea} name="descricao" value={form.descricao} onChange={handleChange} onBlur={handleBlur} rows="4" placeholder="Fale sobre a indicação, contraindicação, etc." required></textarea></div>{touched.descricao && errors.descricao?.map(msg => <small key={msg} className={styles.small}>{msg}</small>)}</div>

              <div className={styles.formActions}><button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/produtos/medicamentos")} disabled={loading}>Cancelar</button><button type="submit" className={styles.submitButton} disabled={loading}>{loading ? (<><span className={styles.loadingSpinnerSmall}></span>Cadastrando...</>) : "Cadastrar Medicamento"}</button></div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}