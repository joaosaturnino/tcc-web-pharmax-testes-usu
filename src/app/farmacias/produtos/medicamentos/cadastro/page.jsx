"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";

// Ícones para validação
import { MdCheckCircle, MdError } from "react-icons/md";

export default function CadastroMedicamentoPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    dosagem: "",
    quantidade: "",
    tipo: "",
    forma: "",
    descricao: "",
    preco: "",
    laboratorio: "",
    imagem: "",
    codigoBarras: "",
  });

  // Estados para validação
  const valDefault = styles.formControl;
  const valSucesso = `${styles.formControl} ${styles.success}`;
  const valErro = `${styles.formControl} ${styles.error}`;

  const [valida, setValida] = useState({
    nome: {
      validado: valDefault,
      mensagem: []
    },
    dosagem: {
      validado: valDefault,
      mensagem: []
    },
    quantidade: {
      validado: valDefault,
      mensagem: []
    },
    tipo: {
      validado: valDefault,
      mensagem: []
    },
    forma: {
      validado: valDefault,
      mensagem: []
    },
    descricao: {
      validado: valDefault,
      mensagem: []
    },
    preco: {
      validado: valDefault,
      mensagem: []
    },
    laboratorio: {
      validado: valDefault,
      mensagem: []
    },
    imagem: {
      validado: valDefault,
      mensagem: []
    },
    codigoBarras: {
      validado: valDefault,
      mensagem: []
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Funções de validação
  function validaNome() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.nome === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome do medicamento é obrigatório');
    } else if (form.nome.length < 3) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome deve ter pelo menos 3 caracteres');
    }

    setValida(prev => ({
      ...prev,
      nome: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaDosagem() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.dosagem === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A dosagem é obrigatória');
    } else if (!/^\d+(\.\d+)?(mg|mcg|g|ml|UI|%|ppm)$/i.test(form.dosagem)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Formato de dosagem inválido (ex: 500mg, 10ml)');
    }

    setValida(prev => ({
      ...prev,
      dosagem: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaQuantidade() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.quantidade === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A quantidade é obrigatória');
    } else if (parseInt(form.quantidade) <= 0) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A quantidade deve ser maior que zero');
    } else if (parseInt(form.quantidade) > 1000) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A quantidade não pode ser superior a 1000 unidades');
    }

    setValida(prev => ({
      ...prev,
      quantidade: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaTipo() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.tipo === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Selecione o tipo de produto');
    }

    setValida(prev => ({
      ...prev,
      tipo: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaForma() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.forma === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Selecione a forma farmacêutica');
    }

    setValida(prev => ({
      ...prev,
      forma: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaDescricao() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.descricao === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A descrição é obrigatória');
    } else if (form.descricao.length < 10) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A descrição deve ter pelo menos 10 caracteres');
    }

    setValida(prev => ({
      ...prev,
      descricao: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaPreco() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.preco === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O preço é obrigatório');
    } else if (parseFloat(form.preco) <= 0) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O preço deve ser maior que zero');
    } else if (parseFloat(form.preco) > 10000) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O preço não pode ser superior a R$ 10.000,00');
    }

    setValida(prev => ({
      ...prev,
      preco: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaLaboratorio() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.laboratorio === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Selecione o laboratório');
    }

    setValida(prev => ({
      ...prev,
      laboratorio: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaImagem() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    // A imagem é opcional, mas se fornecida, deve ser uma URL válida
    if (form.imagem && !/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(form.imagem)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('URL de imagem inválida');
    }

    setValida(prev => ({
      ...prev,
      imagem: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaCodigoBarras() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.codigoBarras === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O código de barras é obrigatório');
    } else if (!/^\d{8,14}$/.test(form.codigoBarras)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Código de barras inválido (deve conter apenas números, 8-14 dígitos)');
    }

    setValida(prev => ({
      ...prev,
      codigoBarras: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let itensValidados = 0;
    itensValidados += validaNome();
    itensValidados += validaDosagem();
    itensValidados += validaQuantidade();
    itensValidados += validaTipo();
    itensValidados += validaForma();
    itensValidados += validaDescricao();
    itensValidados += validaPreco();
    itensValidados += validaLaboratorio();
    itensValidados += validaImagem();
    itensValidados += validaCodigoBarras();

    if (itensValidados !== 10) {
      return; // Não prossegue se houver erros de validação
    }

    setLoading(true);
    
    // Simulando processamento
    setTimeout(() => {
      console.log("Dados enviados:", form);
      alert("Medicamento cadastrado com sucesso!");
      setLoading(false);
      router.push("/farmacias/produtos/medicamentos");
    }, 1500);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Fallback para a página home em caso de erro
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
          <h1 className={styles.title}> Cadastro de Medicamento</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa - CORRIGIDO */}
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
                  className={`${styles.navLink} ${styles.active}`}
                  
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
                <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
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

          {/* Overlay para mobile */}
          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}
        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Novo Medicamento</h2>
              <p>Preencha os dados do novo medicamento</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Básicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Básicas
                  </h3>

                  <div className={valida.nome.validado}>
                    <label className={styles.inputLabel}>Nome do Medicamento</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome do medicamento"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.nome.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={styles.formRow}>
                    <div className={valida.dosagem.validado}>
                      <label className={styles.inputLabel}>Dosagem</label>
                      <div className={styles.divInput}>
                        <input
                          className={styles.modernInput}
                          type="text"
                          name="dosagem"
                          value={form.dosagem}
                          onChange={handleChange}
                          placeholder="Ex: 500mg"
                          required
                        />
                        <MdCheckCircle className={styles.sucesso} />
                        <MdError className={styles.erro} />
                      </div>
                      {valida.dosagem.mensagem.map(mens => 
                        <small key={mens} className={styles.small}>{mens}</small>
                      )}
                    </div>

                    <div className={valida.quantidade.validado}>
                      <label className={styles.inputLabel}>Quantidade</label>
                      <div className={styles.divInput}>
                        <input
                          className={styles.modernInput}
                          type="number"
                          name="quantidade"
                          value={form.quantidade}
                          onChange={handleChange}
                          min="1"
                          placeholder="Quantidade"
                          required
                        />
                        <MdCheckCircle className={styles.sucesso} />
                        <MdError className={styles.erro} />
                      </div>
                      {valida.quantidade.mensagem.map(mens => 
                        <small key={mens} className={styles.small}>{mens}</small>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={valida.preco.validado}>
                      <label className={styles.inputLabel}>Preço (R$)</label>
                      <div className={styles.divInput}>
                        <input
                          className={styles.modernInput}
                          type="number"
                          name="preco"
                          value={form.preco}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          required
                        />
                        <MdCheckCircle className={styles.sucesso} />
                        <MdError className={styles.erro} />
                      </div>
                      {valida.preco.mensagem.map(mens => 
                        <small key={mens} className={styles.small}>{mens}</small>
                      )}
                    </div>

                    <div className={valida.codigoBarras.validado}>
                      <label className={styles.inputLabel}>Código de Barras</label>
                      <div className={styles.barcodeInputContainer}>
                        <div className={styles.divInput}>
                          <input
                            className={styles.modernInput}
                            type="text"
                            name="codigoBarras"
                            value={form.codigoBarras}
                            onChange={handleChange}
                            placeholder="Digite o código de barras"
                            required
                          />
                          <MdCheckCircle className={styles.sucesso} />
                          <MdError className={styles.erro} />
                        </div>
                      </div>
                      {valida.codigoBarras.mensagem.map(mens => 
                        <small key={mens} className={styles.small}>{mens}</small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informações Técnicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Técnicas
                  </h3>

                  <div className={valida.tipo.validado}>
                    <label className={styles.inputLabel}>Tipo de Produto</label>
                    <div className={styles.divInput}>
                      <select
                        className={styles.modernInput}
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="Alopático">Alopático</option>
                        <option value="Fitoterápico">Fitoterápico</option>
                        <option value="Genérico">Genérico</option>
                        <option value="Homeopático">Homeopático</option>
                        <option value="Manipulado">Manipulado</option>
                        <option value="Referência">Referência</option>
                        <option value="Similar">Similar</option>
                      </select>
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.tipo.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.forma.validado}>
                    <label className={styles.inputLabel}>Forma Farmacêutica</label>
                    <div className={styles.divInput}>
                      <select
                        className={styles.modernInput}
                        name="forma"
                        value={form.forma}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione a forma</option>
                        <option value="Comprimido">Comprimido</option>
                        <option value="Cápsula">Cápsula</option>
                        <option value="Pastilhas">Pastilhas</option>
                        <option value="Drágeas">Drágeas</option>
                        <option value="Pós para Reconstituição">Pós para Reconstituição</option>
                        <option value="Gotas">Gotas</option>
                        <option value="Xarope">Xarope</option>
                        <option value="Solução Oral">Solução Oral</option>
                        <option value="Suspensão">Suspensão</option>
                        <option value="Comprimidos Sublinguais">Comprimidos Sublinguais</option>
                        <option value="Soluções">Soluções</option>
                        <option value="Suspensões Injetáveis">Suspensões Injetáveis</option>
                        <option value="Soluções Tópicas">Soluções Tópicas</option>
                        <option value="Pomadas">Pomadas</option>
                        <option value="Cremes">Cremes</option>
                        <option value="Loção">Loção</option>
                        <option value="Gel">Gel</option>
                        <option value="Adesivos">Adesivos</option>
                        <option value="Spray">Spray</option>
                        <option value="Gotas Nasais">Gotas Nasais</option>
                        <option value="Colírios">Colírios</option>
                        <option value="Pomadas Oftálmicas">Pomadas Oftálmicas</option>
                        <option value="Gotas Auriculares ou Otológicas">Gotas Auriculares ou Otológicas</option>
                        <option value="Pomadas Auriculares">Pomadas Auriculares</option>
                        <option value="Aerosol">Aerosol</option>
                        <option value="Comprimidos Vaginais">Comprimidos Vaginais</option>
                        <option value="Óvulos">Óvulos</option>
                        <option value="Supositórios">Supositórios</option>
                        <option value="Enemas">Enemas</option>
                      </select>
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.forma.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.laboratorio.validado}>
                    <label className={styles.inputLabel}>Laboratório</label>
                    <div className={styles.divInput}>
                      <select
                        className={styles.modernInput}
                        name="laboratorio"
                        value={form.laboratorio}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione o laboratório</option>
                        <option value="Neo Química">Neo Química</option>
                        <option value="EMS">EMS</option>
                        <option value="Eurofarma">Eurofarma</option>
                        <option value="Aché">Aché</option>
                        <option value="União Química">União Química</option>
                        <option value="Medley">Medley</option>
                        <option value="Sanofi">Sanofi</option>
                        <option value="Geolab">Geolab</option>
                        <option value="Merck">Merck</option>
                        <option value="Legrand">Legrand</option>
                        <option value="Natulab">Natulab</option>
                        <option value="Germed">Germed</option>
                        <option value="Prati Donaduzzi">Prati Donaduzzi</option>
                        <option value="Biolab">Biolab</option>
                        <option value="Hipera CH">Hipera CH</option>
                        <option value="Sandoz">Sandoz</option>
                        <option value="Med Química">Med Química</option>
                        <option value="Mantecorp Farmasa">Mantecorp Farmasa</option>
                      </select>
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.laboratorio.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.imagem.validado}>
                    <label className={styles.inputLabel}>Imagem (URL)</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="imagem"
                        value={form.imagem}
                        onChange={handleChange}
                        placeholder="Cole a URL da imagem"
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.imagem.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  Descrição
                </h3>
                <div className={valida.descricao.validado}>
                  <label className={styles.inputLabel}>Descrição</label>
                  <div className={styles.divInput}>
                    <textarea
                      className={styles.modernTextarea}
                      name="descricao"
                      value={form.descricao}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Digite uma descrição para o medicamento"
                      required
                    ></textarea>
                    <MdCheckCircle className={styles.sucesso} />
                    <MdError className={styles.erro} />
                  </div>
                  {valida.descricao.mensagem.map(mens => 
                    <small key={mens} className={styles.small}>{mens}</small>
                  )}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => router.push("/farmacias/produtos/medicamentos")}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.loadingSpinnerSmall}></span>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      Cadastrar Medicamento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}