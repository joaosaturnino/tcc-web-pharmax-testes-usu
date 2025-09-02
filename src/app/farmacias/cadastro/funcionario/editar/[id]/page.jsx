"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import styles from "./funcionario.module.css";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    usuario: "",
    senha: "",
    nivelAcesso: "",
    acessoRelatorios: false,
    acessoEstoque: false,
    acessoFinanceiro: false,
    acessoConfiguracoes: false,
  });

  // Dados de exemplo (em uma aplicação real, viriam de uma API)
  useEffect(() => {
    // Simulando busca de dados do funcionário
    setTimeout(() => {
      const funcionario = {
        id: 1,
        nome: "Maria Silva",
        email: "maria.silva@pharmax.com",
        telefone: "(11) 99999-9999",
        cpf: "123.456.789-00",
        dataNascimento: "1990-05-15",
        endereco: "Rua das Flores, 123 - São Paulo/SP",
        usuario: "maria.silva",
        senha: "********",
        nivelAcesso: "Administrador",
        acessoRelatorios: true,
        acessoEstoque: true,
        acessoFinanceiro: true,
        acessoConfiguracoes: true,
        dataCadastro: "2023-01-15",
      };

      setForm({
        nome: funcionario.nome,
        email: funcionario.email,
        telefone: funcionario.telefone,
        cpf: funcionario.cpf,
        dataNascimento: funcionario.dataNascimento,
        endereco: funcionario.endereco,
        usuario: funcionario.usuario,
        senha: funcionario.senha,
        nivelAcesso: funcionario.nivelAcesso,
        acessoRelatorios: funcionario.acessoRelatorios,
        acessoEstoque: funcionario.acessoEstoque,
        acessoFinanceiro: funcionario.acessoFinanceiro,
        acessoConfiguracoes: funcionario.acessoConfiguracoes,
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados atualizados:", form);
    alert("Funcionário atualizado com sucesso!");
    router.push("/farmacias/cadastro/funcionario/lista");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Carregando dados do funcionário...</span>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            
          </button>
          <h1 className="title"> Editar Funcionário</h1>
          {/* <h1 className="title">✏️ Editar Funcionário</h1> */}
          
        </div>
      </header>

      <div className="content-wrapper">
        {/* Sidebar Não Fixa */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <div className="logo">
              {/* <span className="logo-icon">💊</span> */}
              <span className="logo-text">PharmaX</span>
            </div>
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className="nav">
            <div className="nav-section">
              <p className="nav-label">Principal</p>
              <a href="/farmacias/favoritos" className="nav-link">
                {/* <span className="nav-icon">⭐</span> */}
                <span className="nav-text">Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className="nav-link">
                {/* <span className="nav-icon">💊</span> */}
                <span className="nav-text">Medicamentos</span>
              </a>
            </div>

            <div className="nav-section">
              <p className="nav-label">Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className="nav-link"
              >
                {/* <span className="nav-icon">👩‍⚕️</span> */}
                <span className="nav-text">Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className="nav-link">
                {/* <span className="nav-icon">🏭</span> */}
                <span className="nav-text">Laboratórios</span>
              </a>
            </div>

            {/* <div className="nav-section">
              <p className="nav-label">Sistema</p>
              <a href="/config" className="nav-link">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Configurações</span>
              </a>
              <a href="/farmacias/perfil" className={`${styles.navLink} ${styles.active}`}>
                <span className={styles.navIcon}>👤</span>
                <span className={styles.navText}>Meu Perfil</span>
              </a>
              <button className="nav-link">
                <span className="nav-icon">🚪</span>
                <span className="nav-text">Sair</span>
              </button>
            </div> */}
          </nav>

          {/* <div className="user-panel">
            <div className="user-avatar">
              <span>👤</span>
            </div>
            <div className="user-info">
              <p className="user-name">Administrador</p>
              <p className="user-role">Supervisor</p>
            </div>
          </div> */}
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className="main-content">
          <div className="form-container">
            <div className="form-header">
              <h2>Editar Funcionário</h2>
              <p>Atualize os dados do colaborador</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-grid">
                {/* Informações Pessoais */}
                <div className="form-section">
                  <h3 className="section-title">
                    {/* <span className="section-icon">👤</span> */}
                    Informações Pessoais
                  </h3>

                  <div className="form-group">
                    <label className="input-label">Nome Completo *</label>
                    <input
                      className="modern-input"
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="input-label">CPF *</label>
                      <input
                        className="modern-input"
                        type="text"
                        name="cpf"
                        value={form.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-label">Data de Nascimento</label>
                      <input
                        className="modern-input"
                        type="date"
                        name="dataNascimento"
                        value={form.dataNascimento}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="input-label">E-mail *</label>
                    <input
                      className="modern-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="funcionario@empresa.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Telefone</label>
                    <input
                      className="modern-input"
                      type="tel"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Endereço</label>
                    <input
                      className="modern-input"
                      type="text"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>

                {/* Informações de Acesso */}
                <div className="form-section">
                  <h3 className="section-title">
                    {/* <span className="section-icon">🔐</span> */}
                    Acesso ao Sistema
                  </h3>

                  <div className="form-group">
                    <label className="input-label">Nome de Usuário *</label>
                    <input
                      className="modern-input"
                      type="text"
                      name="usuario"
                      value={form.usuario}
                      onChange={handleChange}
                      placeholder="Digite o nome de usuário"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Senha *</label>
                    <input
                      className="modern-input"
                      type="password"
                      name="senha"
                      value={form.senha}
                      onChange={handleChange}
                      placeholder="Digite a nova senha"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Nível de Acesso *</label>
                    <select
                      className="modern-input"
                      name="nivelAcesso"
                      value={form.nivelAcesso}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione o nível de acesso</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Funcionário">Funcionário</option>
                      <option value="Visitante">
                        Visitante (Somente leitura)
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Permissões Especiais</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="acessoRelatorios"
                          checked={form.acessoRelatorios}
                          onChange={handleChange}
                        />
                        <span className="checkbox-text">
                          Acesso a relatórios
                        </span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="acessoEstoque"
                          checked={form.acessoEstoque}
                          onChange={handleChange}
                        />
                        <span className="checkbox-text">Gerenciar estoque</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="acessoFinanceiro"
                          checked={form.acessoFinanceiro}
                          onChange={handleChange}
                        />
                        <span className="checkbox-text">Acesso financeiro</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="acessoConfiguracoes"
                          checked={form.acessoConfiguracoes}
                          onChange={handleChange}
                        />
                        <span className="checkbox-text">
                          Configurações do sistema
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    router.push("/farmacias/cadastro/funcionario/lista")
                  }
                >
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  {/* <span className="button-icon">💾</span> */}
                  Atualizar Funcionário
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* Layout Principal */
        .dashboard {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .header {
          background: white;
          padding: 16px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .menu-toggle {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.3s ease;
          display: none;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          padding: 10px 40px 10px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          width: 250px;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .search-icon {
          position: absolute;
          right: 12px;
          color: #64748b;
        }

        .user-menu {
          display: flex;
          align-items: center;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3498db;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        /* Wrapper de Conteúdo */
        .content-wrapper {
          display: flex;
          flex: 1;
          position: relative;
        }

        /* Sidebar Não Fixa */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
          color: white;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          z-index: 90;
        }

        .sidebar-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 24px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: bold;
        }

        .sidebar-close {
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

        .sidebar-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-section {
          margin-bottom: 30px;
        }

        .nav-label {
          padding: 0 20px 10px;
          font-size: 12px;
          text-transform: uppercase;
          color: #95a5a6;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .nav-link {
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

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-link.active {
          background: rgba(52, 152, 219, 0.2);
          color: white;
          border-left: 4px solid #3498db;
        }

        .nav-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .nav-text {
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        }

        .user-panel {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .user-role {
          font-size: 12px;
          color: #95a5a6;
          margin: 0;
        }

        /* Conteúdo Principal */
        .main-content {
          flex: 1;
          padding: 0;
          min-height: calc(100vh - 80px);
          overflow-y: auto;
          background: #f8fafc;
        }

        /* Formulário */
        .form-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .form-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .form-header p {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .form {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .form-section {
          border-left: 4px solid #3498db;
          padding-left: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          font-size: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .input-label::after {
          content: "*";
          color: #ef4444;
          margin-left: 4px;
        }

        .modern-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
        }

        .modern-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .modern-input::placeholder {
          color: #9ca3af;
        }

        select.modern-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
        }

        /* Checkbox Group */
        .checkbox-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .checkbox-label:hover {
          background-color: #f8f9fa;
        }

        .checkbox-text {
          font-size: 14px;
          color: #374151;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #3498db;
        }

        /* Ações do Formulário */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 32px;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-button {
          padding: 12px 24px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .submit-button {
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
        }

        .submit-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .button-icon {
          font-size: 16px;
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

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 16px;
          background: #f8fafc;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Responsividade */
        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .search-input {
            width: 200px;
          }

          .checkbox-group {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .menu-toggle {
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

          .sidebar-open {
            transform: translateX(0);
          }

          .sidebar-close {
            display: block;
          }

          .overlay {
            display: block;
          }

          .header {
            padding: 16px 20px;
          }

          .header-actions {
            flex-wrap: wrap;
            gap: 12px;
          }

          .search-input {
            width: 180px;
          }

          .form-container {
            padding: 20px;
          }

          .form {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-button,
          .submit-button {
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

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .search-box {
            width: 100%;
          }

          .search-input {
            width: 100%;
          }

          .form-container {
            padding: 16px;
          }

          .form {
            padding: 20px;
          }

          .form-header h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
