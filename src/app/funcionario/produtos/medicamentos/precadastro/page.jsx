"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const imagemPadrao = "https://www.institutoaron.com.br/static/img/large/c28a030a59bae1283321c340cdc846df.webp";

// Simulação de banco de dados (deve ser o mesmo da listagem)
const bancoDeDados = {
  medicamentos: [
    {
      id: 1,
      nome: "Paracetamol",
      dosagem: "500mg",
      quantidade: 20,
      tipo: "Genérico",
      forma: "Comprimido",
      descricao: "Analgésico e antitérmico.",
      laboratorio: "EMS",
      preco: 12.5,
      imagem: "",
      codigoBarras: "7891234567890"
    },
    {
      id: 2,
      nome: "Dipirona",
      dosagem: "1g",
      quantidade: 10,
      tipo: "Similar",
      forma: "Comprimido",
      descricao: "Analgésico e antitérmico.",
      laboratorio: "Neo Química",
      preco: 8.9,
      imagem: "",
      codigoBarras: "7890987654321"
    },
  ],
  buscarPorCodigoBarras: function(codigo) {
    return this.medicamentos.find(med => med.codigoBarras === codigo);
  }
};

export default function CadastroMedicamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoBarras = searchParams.get('codigoBarras');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicamentoExistente, setMedicamentoExistente] = useState(null);

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
    codigoBarras: codigoBarras || ""
  });

  // Buscar medicamento existente quando o componente é montado
  useEffect(() => {
    if (codigoBarras) {
      const medicamento = bancoDeDados.buscarPorCodigoBarras(codigoBarras);
      if (medicamento) {
        setMedicamentoExistente(medicamento);
        setForm({
          nome: medicamento.nome,
          dosagem: medicamento.dosagem,
          quantidade: medicamento.quantidade.toString(),
          tipo: medicamento.tipo,
          forma: medicamento.forma,
          descricao: medicamento.descricao,
          laboratorio: medicamento.laboratorio,
          preco: medicamento.preco.toString(),
          imagem: medicamento.imagem,
          codigoBarras: medicamento.codigoBarras
        });
      }
    }
  }, [codigoBarras]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Permite alterar apenas o preço
    if (name === "preco") {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando processamento
    setTimeout(() => {
      // Aqui você pode adicionar a lógica para enviar os dados para o backend
      console.log("Dados atualizados:", form);
      alert("Preço do medicamento atualizado com sucesso!");
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
          <h1 className={styles.title}>
            {medicamentoExistente ? "Atualizar Preço do Medicamento" : "Cadastro de Medicamento"}
          </h1>
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
            <div className={styles.navSection}>
              <a
                href="/funcionario/produtos/medicamentos"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <a href="/funcionario/laboratorio/lista" className={styles.navLink}>
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
            {medicamentoExistente && (
              <div className={styles.avisoExistente}>
                <p>⚠️ Este medicamento já existe no sistema. Você pode alterar apenas o preço.</p>
              </div>
            )}

            <div className={styles.formHeader}>
              <h2>{medicamentoExistente ? "Atualizar Preço" : "Novo Medicamento"}</h2>
              <p>{medicamentoExistente ? "Ajuste o preço do medicamento existente" : "Preencha os dados do novo medicamento"}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Básicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Básicas
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Código de Barras</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="codigoBarras"
                      value={form.codigoBarras}
                      onChange={() => {}} // Bloqueia edição
                      readOnly
                      style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Nome do Medicamento</label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={() => {}} // Bloqueia edição
                      readOnly
                      style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Dosagem</label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="dosagem"
                        value={form.dosagem}
                        onChange={() => {}} // Bloqueia edição
                        readOnly
                        style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>Quantidade</label>
                      <input
                        className={styles.modernInput}
                        type="number"
                        name="quantidade"
                        value={form.quantidade}
                        onChange={() => {}} // Bloqueia edição
                        readOnly
                        style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Preço (R$)</label>
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
                      style={medicamentoExistente ? {} : {backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                      readOnly={!medicamentoExistente}
                    />
                  </div>
                </div>

                {/* Informações Técnicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Técnicas
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Tipo de Produto</label>
                    <select
                      className={styles.modernInput}
                      name="tipo"
                      value={form.tipo}
                      onChange={() => {}} // Bloqueia edição
                      disabled
                      style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
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
                    <label className={styles.inputLabel}>Forma Farmacêutica</label>
                    <select
                      className={styles.modernInput}
                      name="forma"
                      value={form.forma}
                      onChange={() => {}} // Bloqueia edição
                      disabled
                      style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
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
                    <label className={styles.inputLabel}>Laboratório</label>
                    <select
                      className={styles.modernInput}
                      name="laboratorio"
                      value={form.laboratorio}
                      onChange={() => {}} // Bloqueia edição
                      disabled
                      style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
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
                      onChange={() => {}} // Bloqueia edição
                      readOnly
                      style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                    />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  Descrição
                </h3>
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Descrição</label>
                  <textarea
                    className={styles.modernTextarea}
                    name="descricao"
                    value={form.descricao}
                    onChange={() => {}} // Bloqueia edição
                    rows="4"
                    readOnly
                    style={{backgroundColor: "#f5f5f5", cursor: "not-allowed"}}
                  ></textarea>
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
                      {medicamentoExistente ? "Atualizando..." : "Cadastrando..."}
                    </>
                  ) : (
                    <>
                      {medicamentoExistente ? "Atualizar Preço" : "Cadastrar Medicamento"}
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