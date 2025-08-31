"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./edita.module.css";

export default function EditarMedicamento() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [medicamento, setMedicamento] = useState({
    nome: "",
    principioAtivo: "",
    laboratorio: "",
    concentracao: "",
    formaFarmaceutica: "",
    categoria: "",
    preco: "",
    estoque: "",
    descricao: "",
    imagem: null,
    necessitaReceita: false
  });

  const [preview, setPreview] = useState(null);

  // Simulando dados do medicamento (em uma aplicação real, viria de uma API)
  useEffect(() => {
    const dadosMedicamento = {
      id: 1,
      nome: "Paracetamol",
      principioAtivo: "Paracetamol",
      laboratorio: "MedLab",
      concentracao: "750mg",
      formaFarmaceutica: "Comprimido",
      categoria: "Analgésico",
      preco: "15.90",
      estoque: "150",
      descricao: "Analgésico e antitérmico indicado para dores e febre",
      imagem: "/api/placeholder/200/200",
      necessitaReceita: false,
      codigoBarras: "7891234567890",
      dataValidade: "2024-12-31",
      lote: "L12345"
    };
    setMedicamento(dadosMedicamento);
    setPreview(dadosMedicamento.imagem);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicamento({ 
      ...medicamento, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedicamento({ ...medicamento, imagem: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você salvaria os dados (API, localStorage, etc.)
    alert("Medicamento atualizado com sucesso!");
    router.push("/medicamentos/lista");
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
          <h1 className={styles.title}>💊 Editar Medicamento</h1>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Buscar medicamentos..." 
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <div className={styles.userMenu}>
            <span className={styles.userAvatar}>👤</span>
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>💊</span>
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
              <a href="/farmacia/favoritos" className={styles.navLink}>
                <span className={styles.navIcon}>⭐</span>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>💊</span>
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>
            
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a href="/farmacias/cadastro/funcionario" className={styles.navLink}>
                <span className={styles.navIcon}>👩‍⚕️</span>
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/laboratorio/lista" className={styles.navLink}>
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

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Editar Medicamento</h2>
              <p>Atualize as informações do medicamento</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Básicas */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>📋</span>
                    Informações Básicas
                  </h3>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Nome do Medicamento *
                    </label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="nome"
                      value={medicamento.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome do medicamento"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Princípio Ativo *
                      </label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="principioAtivo"
                        value={medicamento.principioAtivo}
                        onChange={handleChange}
                        placeholder="Princípio ativo"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Concentração
                      </label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="concentracao"
                        value={medicamento.concentracao}
                        onChange={handleChange}
                        placeholder="Ex: 500mg, 20mg/mL"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Laboratório *
                      </label>
                      <select
                        className={styles.modernInput}
                        name="laboratorio"
                        value={medicamento.laboratorio}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione o laboratório</option>
                        <option value="MedLab">MedLab</option>
                        <option value="BioPharma">BioPharma</option>
                        <option value="PharmaTech">PharmaTech</option>
                        <option value="HealthSolutions">HealthSolutions</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Forma Farmacêutica
                      </label>
                      <select
                        className={styles.modernInput}
                        name="formaFarmaceutica"
                        value={medicamento.formaFarmaceutica}
                        onChange={handleChange}
                      >
                        <option value="">Selecione a forma</option>
                        <option value="Comprimido">Comprimido</option>
                        <option value="Cápsula">Cápsula</option>
                        <option value="Líquido">Líquido</option>
                        <option value="Pomada">Pomada</option>
                        <option value="Injetável">Injetável</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Categoria
                    </label>
                    <select
                      className={styles.modernInput}
                      name="categoria"
                      value={medicamento.categoria}
                      onChange={handleChange}
                    >
                      <option value="">Selecione a categoria</option>
                      <option value="Analgésico">Analgésico</option>
                      <option value="Antibiótico">Antibiótico</option>
                      <option value="Anti-inflamatório">Anti-inflamatório</option>
                      <option value="Antidepressivo">Antidepressivo</option>
                      <option value="Antihistamínico">Antihistamínico</option>
                    </select>
                  </div>
                </div>

                {/* Informações Comerciais */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>💰</span>
                    Informações Comerciais
                  </h3>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Preço (R$)
                      </label>
                      <input
                        className={styles.modernInput}
                        type="number"
                        name="preco"
                        value={medicamento.preco}
                        onChange={handleChange}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Estoque Disponível
                      </label>
                      <input
                        className={styles.modernInput}
                        type="number"
                        name="estoque"
                        value={medicamento.estoque}
                        onChange={handleChange}
                        placeholder="Quantidade em estoque"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Código de Barras
                      </label>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="codigoBarras"
                        value={medicamento.codigoBarras || ""}
                        onChange={handleChange}
                        placeholder="Código de barras"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Data de Validade
                      </label>
                      <input
                        className={styles.modernInput}
                        type="date"
                        name="dataValidade"
                        value={medicamento.dataValidade || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Lote
                    </label>
                    <input
                      className={styles.modernInput}
                      type="text"
                      name="lote"
                      value={medicamento.lote || ""}
                      onChange={handleChange}
                      placeholder="Número do lote"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="necessitaReceita"
                        checked={medicamento.necessitaReceita}
                        onChange={handleChange}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxText}>Medicamento controlado (necessita receita)</span>
                    </label>
                  </div>
                </div>

                {/* Imagem e Descrição */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>🖼️</span>
                    Imagem e Descrição
                  </h3>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Imagem do Medicamento
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                    />
                    {preview && (
                      <div className={styles.imagePreview}>
                        <img src={preview} alt="Preview" className={styles.previewImage} />
                        <button 
                          type="button" 
                          className={styles.removeImage}
                          onClick={() => {
                            setPreview(null);
                            setMedicamento({...medicamento, imagem: null});
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Descrição
                    </label>
                    <textarea
                      className={styles.textarea}
                      name="descricao"
                      value={medicamento.descricao}
                      onChange={handleChange}
                      placeholder="Descrição detalhada do medicamento"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => router.back()}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                >
                  <span className={styles.buttonIcon}>💾</span>
                  Atualizar Medicamento
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}