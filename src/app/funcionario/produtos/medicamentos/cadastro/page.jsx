"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./cadastro.module.css";

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando processamento
    setTimeout(() => {
      // Aqui você pode adicionar a lógica para enviar os dados para o backend
      console.log("Dados enviados:", form);
      alert("Medicamento cadastrado com sucesso!");
      setLoading(false);
      
      // Redireciona para a página de listagem de medicamentos após o cadastro
      router.push("/funcionario/produtos/medicamentos");
    }, 1500);
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
            
          </button>
          <h1 className={styles.title}> Cadastro de Medicamento</h1>
          {/* <h1 className={styles.title}>💊 Cadastro de Medicamento</h1> */}
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              {/* <span className={styles.logoIcon}>💊</span> */}
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
                href="/farmacias/produtos/medicamentos"
                className={`${styles.navLink} ${styles.active}`}
              >
                {/* <span className={styles.navIcon}>💊</span> */}
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              
              <a href="/funcionario/laboratorio/lista" className={styles.navLink}>
                {/* <span className={styles.navIcon}>🏭</span> */}
                <span className={styles.navText}>Laboratórios</span>
              </a>
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
                    {/* <span className={styles.sectionIcon}>📋</span> */}
                    Informações Básicas
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome do Medicamento *</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome do medicamento"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Dosagem *</label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="dosagem"
                        value={form.dosagem}
                        onChange={handleChange}
                        placeholder="Ex: 500mg"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Quantidade *</label>
                      <input
                        className={styles.modernInput}
                        type="number"
                        name="quantidade"
                        value={form.quantidade}
                        onChange={handleChange}
                        min="1"
                        placeholder="Quantidade em estoque"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Preço (R$) *</label>
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
                  </div>
                </div>

                {/* Informações Técnicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    {/* <span className={styles.sectionIcon}>🔬</span> */}
                    Informações Técnicas
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Tipo de Produto *</label>
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
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Forma Farmacêutica *</label>
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
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Laboratório *</label>
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
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Imagem (URL)</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="imagem"
                      value={form.imagem}
                      onChange={handleChange}
                      placeholder="Cole a URL da imagem"
                    />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}></span>
                  Descrição
                </h3>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Descrição *</label>
                  <textarea
                    className={styles.modernTextarea}
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Digite uma descrição para o medicamento"
                    required
                  ></textarea>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => router.push("/funcionario/produtos/medicamentos")}
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
                      {/* <span className={styles.buttonIcon}>💾</span> */}
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