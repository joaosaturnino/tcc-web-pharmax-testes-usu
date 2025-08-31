"use client";
import { useState, useEffect } from "react";

export default function ConfiguracoesSistema() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações de aparência
    tema: "claro",
    tamanhoFonte: "medio",
    // Configurações da farmácia
    nomeFarmacia: "Farmácia Central",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua Principal, 123 - Centro",
    telefone: "(11) 99999-9999",
    email: "contato@farmaciacentral.com.br",
    // Configurações de notificação
    notificacoesEmail: true,
    notificacoesSMS: false,
    // Backup
    backupAutomatico: true,
    frequenciaBackup: "diario"
  });

  // Aplicar configurações de tema e fonte ao carregar a página
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");
    const fonteSalva = localStorage.getItem("tamanhoFonte");
    
    if (temaSalvo) {
      setConfiguracoes(prev => ({ ...prev, tema: temaSalvo }));
      document.documentElement.setAttribute("data-tema", temaSalvo);
    }
    
    if (fonteSalva) {
      setConfiguracoes(prev => ({ ...prev, tamanhoFonte: fonteSalva }));
      document.documentElement.setAttribute("data-fonte", fonteSalva);
    }
  }, []);

  // Função para aplicar o tema
  const aplicarTema = (novoTema) => {
    document.documentElement.setAttribute("data-tema", novoTema);
    localStorage.setItem("tema", novoTema);
  };

  // Função para aplicar o tamanho da fonte
  const aplicarTamanhoFonte = (novoTamanho) => {
    document.documentElement.setAttribute("data-fonte", novoTamanho);
    localStorage.setItem("tamanhoFonte", novoTamanho);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const novoValor = type === "checkbox" ? checked : value;
    
    setConfiguracoes({
      ...configuracoes,
      [name]: novoValor
    });

    // Aplicar mudanças imediatas para tema e tamanho de fonte
    if (name === "tema") {
      aplicarTema(novoValor);
    }
    
    if (name === "tamanhoFonte") {
      aplicarTamanhoFonte(novoValor);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular salvamento das configurações
    alert("Configurações salvas com sucesso!");
  };

  const resetConfiguracoes = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      const configuracoesPadrao = {
        tema: "claro",
        tamanhoFonte: "medio",
        nomeFarmacia: "Farmácia Central",
        cnpj: "12.345.678/0001-90",
        endereco: "Rua Principal, 123 - Centro",
        telefone: "(11) 99999-9999",
        email: "contato@farmaciacentral.com.br",
        notificacoesEmail: true,
        notificacoesSMS: false,
        backupAutomatico: true,
        frequenciaBackup: "diario"
      };
      
      setConfiguracoes(configuracoesPadrao);
      aplicarTema("claro");
      aplicarTamanhoFonte("medio");
      
      alert("Configurações restauradas para os valores padrão!");
    }
  };

  return (
    <div className="dashboard">
      {/* Header com botão para toggle da sidebar */}
      <header className="header">
        <div className="headerLeft">
          <button 
            className="menuToggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="titulo">Configurações do Sistema</h1>
        </div>
        <div className="headerActions">
          <div className="userMenu">
            <div className="userAvatar">AD</div>
          </div>
        </div>
      </header>

      <div className="contentWrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebarOpen' : ''}`}>
          <div className="sidebarHeader">
            <div className="logo">
              <span className="logoIcon">💊</span>
              <span className="logoText">PharmaX</span>
            </div>
            <button 
              className="sidebarClose"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>
          
          <nav className="nav">
            <div className="navSection">
              <p className="navLabel">Principal</p>
              <a href="/farmacias/favoritos" className="navLink">
                <span className="navIcon">⭐</span>
                <span className="navText">Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className="navLink">
                <span className="navIcon">💊</span>
                <span className="navText">Medicamentos</span>
              </a>
            </div>
            
            <div className="navSection">
              <p className="navLabel">Gestão</p>
              <a href="/farmacias/cadastro/funcionario/lista" className="navLink">
                <span className="navIcon">👩‍⚕️</span>
                <span className="navText">Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className="navLink">
                <span className="navIcon">🏭</span>
                <span className="navText">Laboratórios</span>
              </a>
            </div>
            
            <div className="navSection">
              <p className="navLabel">Sistema</p>
              <a href="../../../configuracoes" className="navLink active">
                <span className="navIcon">⚙️</span>
                <span className="navText">Configurações</span>
              </a>
              <a href="/farmacias/perfil" className="navLink active">
                <span className="navIcon">👤</span>
                <span className="navText">Meu Perfil</span>
              </a>
              <button className="navLink">
                <span className="navIcon">🚪</span>
                <span className="navText">Sair</span>
              </button>
            </div>
          </nav>
          
          <div className="userPanel">
            <div className="userAvatar">
              <span>👤</span>
            </div>
            <div className="userInfo">
              <p className="userName">Administrador</p>
              <p className="userRole">Supervisor</p>
            </div>
          </div>
        </aside>

        {/* Overlay para fechar a sidebar ao clicar fora (apenas em mobile) */}
        {sidebarOpen && (
          <div 
            className="overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <main className="mainContent">
          <div className="configContainer">
            <form onSubmit={handleSubmit} className="configForm">
              <div className="configSection">
                <h2 className="sectionTitle">Aparência</h2>
                <div className="configGrid">
                  <div className="formGroup">
                    <label className="label" htmlFor="tema">
                      Tema:
                    </label>
                    <div className="radioGroup">
                      <label className="radioOption">
                        <input
                          type="radio"
                          name="tema"
                          value="claro"
                          checked={configuracoes.tema === "claro"}
                          onChange={handleChange}
                        />
                        <span className="radioLabel">Claro</span>
                      </label>
                      <label className="radioOption">
                        <input
                          type="radio"
                          name="tema"
                          value="escuro"
                          checked={configuracoes.tema === "escuro"}
                          onChange={handleChange}
                        />
                        <span className="radioLabel">Escuro</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="formGroup">
                    <label className="label" htmlFor="tamanhoFonte">
                      Tamanho da Fonte:
                    </label>
                    <select
                      className="select"
                      id="tamanhoFonte"
                      name="tamanhoFonte"
                      value={configuracoes.tamanhoFonte}
                      onChange={handleChange}
                    >
                      <option value="pequeno">Pequeno</option>
                      <option value="medio">Médio</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="configSection">
                <h2 className="sectionTitle">Informações da Farmácia</h2>
                <div className="configGrid">
                  <div className="formGroup">
                    <label className="label" htmlFor="nomeFarmacia">
                      Nome da Farmácia:
                    </label>
                    <input
                      className="input"
                      type="text"
                      id="nomeFarmacia"
                      name="nomeFarmacia"
                      value={configuracoes.nomeFarmacia}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label className="label" htmlFor="cnpj">
                      CNPJ:
                    </label>
                    <input
                      className="input"
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={configuracoes.cnpj}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label className="label" htmlFor="endereco">
                      Endereço:
                    </label>
                    <input
                      className="input"
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={configuracoes.endereco}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label className="label" htmlFor="telefone">
                      Telefone:
                    </label>
                    <input
                      className="input"
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={configuracoes.telefone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="formGroup">
                    <label className="label" htmlFor="email">
                      E-mail:
                    </label>
                    <input
                      className="input"
                      type="email"
                      id="email"
                      name="email"
                      value={configuracoes.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="configSection">
                <h2 className="sectionTitle">Notificações</h2>
                <div className="configGrid">
                  <div className="formGroup">
                    <label className="checkboxOption">
                      <input
                        type="checkbox"
                        name="notificacoesEmail"
                        checked={configuracoes.notificacoesEmail}
                        onChange={handleChange}
                      />
                      <span className="checkboxLabel">Receber notificações por e-mail</span>
                    </label>
                  </div>
                  
                  <div className="formGroup">
                    <label className="checkboxOption">
                      <input
                        type="checkbox"
                        name="notificacoesSMS"
                        checked={configuracoes.notificacoesSMS}
                        onChange={handleChange}
                      />
                      <span className="checkboxLabel">Receber notificações por SMS</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="configSection">
                <h2 className="sectionTitle">Backup</h2>
                <div className="configGrid">
                  <div className="formGroup">
                    <label className="checkboxOption">
                      <input
                        type="checkbox"
                        name="backupAutomatico"
                        checked={configuracoes.backupAutomatico}
                        onChange={handleChange}
                      />
                      <span className="checkboxLabel">Backup automático</span>
                    </label>
                  </div>
                  
                  {configuracoes.backupAutomatico && (
                    <div className="formGroup">
                      <label className="label" htmlFor="frequenciaBackup">
                        Frequência do backup:
                      </label>
                      <select
                        className="select"
                        id="frequenciaBackup"
                        name="frequenciaBackup"
                        value={configuracoes.frequenciaBackup}
                        onChange={handleChange}
                      >
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="formActions">
                <button type="button" className="botaoSecondary" onClick={resetConfiguracoes}>
                  Restaurar Padrões
                </button>
                <button type="submit" className="botaoPrincipal">
                  Salvar Configurações
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* Variáveis CSS para temas */
        :root {
          /* Cores do tema claro */
          --cor-fundo: #f8fafc;
          --cor-fundo-card: #ffffff;
          --cor-texto: #1e293b;
          --cor-texto-secundario: #64748b;
          --cor-borda: #e2e8f0;
          --cor-primaria: #3498db;
          --cor-hover: #f1f5f9;
          
          /* Tamanhos de fonte */
          --fonte-pequena: 0.875rem;
          --fonte-media: 1rem;
          --fonte-grande: 1.125rem;
          --fonte-titulo: 1.5rem;
        }
        
        [data-tema="escuro"] {
          --cor-fundo: #1e293b;
          --cor-fundo-card: #334155;
          --cor-texto: #f1f5f9;
          --cor-texto-secundario: #94a3b8;
          --cor-borda: #475569;
          --cor-primaria: #60a5fa;
          --cor-hover: #334155;
        }
        
        [data-fonte="pequeno"] {
          --fonte-pequena: 0.75rem;
          --fonte-media: 0.875rem;
          --fonte-grande: 1rem;
          --fonte-titulo: 1.25rem;
        }
        
        [data-fonte="grande"] {
          --fonte-pequena: 1rem;
          --fonte-media: 1.125rem;
          --fonte-grande: 1.25rem;
          --fonte-titulo: 1.75rem;
        }
        
        /* Aplicar variáveis */
        body {
          background-color: var(--cor-fundo);
          color: var(--cor-texto);
          font-size: var(--fonte-media);
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        /* Layout Principal */
        .dashboard {
          min-height: 100vh;
          background-color: var(--cor-fundo);
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .header {
          background: var(--cor-fundo-card);
          padding: 16px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .headerLeft {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .menuToggle {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.3s ease;
          display: none;
          color: var(--cor-texto);
        }

        .menuToggle:hover {
          background: var(--cor-hover);
        }

        .titulo {
          font-size: var(--fonte-titulo);
          font-weight: 600;
          color: var(--cor-texto);
          margin: 0;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .userMenu {
          display: flex;
          align-items: center;
        }

        .userAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--cor-primaria);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        /* Wrapper de Conteúdo */
        .contentWrapper {
          display: flex;
          flex: 1;
          position: relative;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
          color: white;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          z-index: 90;
        }

        .sidebarHeader {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logoIcon {
          font-size: 24px;
        }

        .logoText {
          font-size: 20px;
          font-weight: bold;
        }

        .sidebarClose {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 24px;
          padding: 0;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }

        .sidebarClose:hover {
          background: rgba(255,255,255,0.1);
        }

        .nav {
          flex: 1;
          padding: 20px 0;
        }

        .navSection {
          margin-bottom: 30px;
        }

        .navLabel {
          padding: 0 20px 10px;
          font-size: 12px;
          text-transform: uppercase;
          color: #95a5a6;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .navLink {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #bdc3c7;
          text-decoration: none;
          transition: all 0.3s ease;
          gap: 12px;
          position: relative;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .navLink:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .navLink.active {
          background: rgba(52, 152, 219, 0.2);
          color: white;
          border-left: 4px solid #3498db;
        }

        .navIcon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .navText {
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        }

        .userPanel {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .userAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .userInfo {
          flex: 1;
        }

        .userName {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .userRole {
          font-size: 12px;
          color: #95a5a6;
          margin: 0;
        }

        /* Conteúdo Principal */
        .mainContent {
          flex: 1;
          padding: 0;
          min-height: calc(100vh - 80px);
          overflow-y: auto;
        }

        /* Container de Configurações */
        .configContainer {
          padding: 30px;
        }

        .configForm {
          max-width: 100%;
        }

        .configSection {
          background: var(--cor-fundo-card);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .sectionTitle {
          font-size: var(--fonte-grande);
          font-weight: 600;
          color: var(--cor-texto);
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--cor-borda);
        }

        .configGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .formGroup {
          margin-bottom: 16px;
        }

        .label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--cor-texto);
          font-size: var(--fonte-pequena);
        }

        .input, .select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid var(--cor-borda);
          border-radius: 8px;
          font-size: var(--fonte-pequena);
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          background: var(--cor-fundo-card);
          color: var(--cor-texto);
        }

        .input:focus, .select:focus {
          outline: none;
          border-color: var(--cor-primaria);
        }

        .radioGroup {
          display: flex;
          gap: 20px;
        }

        .radioOption {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .radioLabel {
          font-size: var(--fonte-pequena);
          color: var(--cor-texto);
        }

        .checkboxOption {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkboxLabel {
          font-size: var(--fonte-pequena);
          color: var(--cor-texto);
        }

        .formActions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid var(--cor-borda);
        }

        .botaoPrincipal {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: var(--fonte-pequena);
        }

        .botaoPrincipal:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .botaoSecondary {
          padding: 12px 24px;
          border: 2px solid var(--cor-borda);
          border-radius: 8px;
          background: var(--cor-fundo-card);
          color: var(--cor-texto);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: var(--fonte-pequena);
        }

        .botaoSecondary:hover {
          border-color: var(--cor-primaria);
          color: var(--cor-primaria);
          background: var(--cor-hover);
        }

        /* Overlay para mobile */
        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 80;
        }

        /* Responsividade */
        @media (max-width: 1024px) {
          .configGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .menuToggle {
            display: block;
          }
          
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            z-index: 90;
          }
          
          .sidebarOpen {
            transform: translateX(0);
          }
          
          .sidebarClose {
            display: block;
          }
          
          .overlay {
            display: block;
          }
          
          .header {
            padding: 16px 20px;
          }
          
          .configContainer {
            padding: 20px;
          }
          
          .configSection {
            padding: 20px;
          }
          
          .formActions {
            flex-direction: column;
          }
          
          .botaoPrincipal, .botaoSecondary {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .headerActions {
            width: 100%;
            justify-content: space-between;
          }
          
          .configContainer {
            padding: 16px;
          }
          
          .configSection {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}