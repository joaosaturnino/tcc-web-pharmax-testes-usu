"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edita.module.css";

// Simulação de busca (substitua por chamada real ao backend)
const medicamentosFake = [
  {
    id: 1,
    nome: "Paracetamol",
    dosagem: "500mg",
    quantidade: 20,
    preco: "12.50",
    tipo: "Genérico",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "EMS",
    imagem: "",
  },
  {
    id: 2,
    nome: "Dipirona",
    dosagem: "1g",
    quantidade: 10,
    preco: "8.90",
    tipo: "Similar",
    forma: "Comprimido",
    descricao: "Analgésico e antitérmico.",
    laboratorio: "Neo Química",
    imagem: "",
  },
];

export default function EditarMedicamento() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicamento, setMedicamento] = useState(null);

  useEffect(() => {
    const encontrado = medicamentosFake.find((m) => m.id === id);
    if (encontrado) setMedicamento(encontrado);
    else router.push("/produtos/medicamentos");
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicamento({ ...medicamento, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Medicamento atualizado com sucesso!");
    // Aqui você pode enviar para o backend
    router.push("/produtos/medicamentos");
  };

  if (!medicamento)
    return (
      <div className={styles.dashboard}>
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando medicamento...</p>
        </div>
      </div>
    );

  return (
    <div className={styles.dashboard}>
      {/* Header com botão para toggle da sidebar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className={styles.titulo}>Editar Medicamento</h1>
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
            <div className={styles.userAvatar}>AD</div>
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar */}
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
              <a href="/farmacias/favoritos" className={styles.navLink}>
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
              <a href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                <span className={styles.navIcon}>👩‍⚕️</span>
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
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

        {/* Overlay para fechar a sidebar ao clicar fora (apenas em mobile) */}
        {sidebarOpen && (
          <div 
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="nome">
                    Nome do Medicamento:
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    id="nome"
                    name="nome"
                    value={medicamento.nome}
                    onChange={handleChange}
                    required
                    placeholder="Digite o nome do medicamento"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="dosagem">
                    Dosagem:
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    id="dosagem"
                    name="dosagem"
                    value={medicamento.dosagem}
                    onChange={handleChange}
                    required
                    placeholder="Ex: 500mg"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="quantidade">
                    Quantidade:
                  </label>
                  <input
                    className={styles.input}
                    type="number"
                    id="quantidade"
                    name="quantidade"
                    value={medicamento.quantidade}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Quantidade em estoque"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="preco">
                    Preço (R$):
                  </label>
                  <input
                    className={styles.input}
                    type="number"
                    id="preco"
                    name="preco"
                    value={medicamento.preco}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0,00"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="tipo">
                    Tipo de Produto
                  </label>
                  <select
                    className={styles.select}
                    id="tipo"
                    name="tipo"
                    required
                    value={medicamento.tipo}
                    onChange={handleChange}
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
                  <label className={styles.label} htmlFor="forma">
                    Forma Farmacêutica
                  </label>
                  <select
                    className={styles.select}
                    id="forma"
                    name="forma"
                    required
                    value={medicamento.forma}
                    onChange={handleChange}
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
                  <label className={styles.label} htmlFor="laboratorio">
                    Laboratório:
                  </label>
                  <select 
                    className={styles.select}
                    id="laboratorio" 
                    name="laboratorio" 
                    required
                    value={medicamento.laboratorio}
                    onChange={handleChange}
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
                  <label className={styles.label} htmlFor="imagem">
                    Imagem (URL):
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    id="imagem"
                    name="imagem"
                    value={medicamento.imagem}
                    onChange={handleChange}
                    placeholder="Cole a URL da imagem"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="descricao">
                  Descrição:
                </label>
                <textarea
                  className={styles.textarea}
                  id="descricao"
                  name="descricao"
                  value={medicamento.descricao}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Digite uma descrição para o medicamento"
                ></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.botaoPrincipal}>
                  Salvar Alterações
                </button>

                <button type="button" className={styles.botaoSecondary} onClick={() => router.back()}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}