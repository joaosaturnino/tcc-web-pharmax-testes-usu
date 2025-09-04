"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroLaboratorioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setForm({
        ...form,
        [name]: file,
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Salvar no localStorage
    const dados = { ...form, logo: preview };
    localStorage.setItem("laboratorio", JSON.stringify(dados));

    alert("Laboratório cadastrado com sucesso!");
    router.push("/funcionario/laboratorio/lista");
  };

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
          <h1 className="title"> Cadastro de Laboratório</h1>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Sidebar Não Fixa */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-text">PharmaX</span>
            </div>
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
            </button>
          </div>

          <nav className="nav">
            <div className="nav-section">
              <p className="nav-label">Principal</p>
              
              <a href="/funcionario/produtos/medicamentos" className="nav-link">
                <span className="nav-text">Medicamentos</span>
              </a>
            </div>

            <div className="nav-section">
              <p className="nav-label">Gestão</p>
              
              <a
                href="/funcionario/laboratorio/lista"
                className="nav-link active"
              >
                <span className="nav-text">Laboratórios</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className="main-content">
          <div className="form-container">
            <div className="form-header">
              <h2>Novo Laboratório</h2>
              <p>Preencha os dados do novo laboratório farmacêutico</p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <div className="form-grid">
                {/* Informações do Laboratório */}
                <div className="form-section">
                  <h3 className="section-title">
                    Informações do Laboratório
                  </h3>

                  <div className="form-group">
                    <label className="input-label">Nome do Laboratório</label>
                    <input
                      className="modern-input"
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Digite o nome do laboratório"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">CNPJ</label>
                    <input
                      className="modern-input"
                      type="text"
                      name="cnpj"
                      value={form.cnpj}
                      onChange={handleChange}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">E-mail</label>
                    <input
                      className="modern-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="contato@laboratorio.com"
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
                </div>

                {/* Endereço e Logo */}
                <div className="form-section">
                  <h3 className="section-title">
                    Localização e Identidade Visual
                  </h3>

                  <div className="form-group">
                    <label className="input-label">Endereço Completo</label>
                    <input
                      className="modern-input"
                      type="text"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                      placeholder="Endereço completo"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Logo do Laboratório</label>
                    <div className="file-upload-group">
                      <input
                        type="file"
                        name="logo"
                        onChange={handleChange}
                        className="file-input"
                        id="logo-upload"
                        accept="image/*"
                      />
                      <label htmlFor="logo-upload" className="file-label">
                        Selecionar arquivo
                      </label>
                      {form.logo && (
                        <span className="file-name">
                          {form.logo.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {preview && (
                    <div className="form-group">
                      <label className="input-label">Pré-visualização</label>
                      <div className="image-preview">
                        <img
                          src={preview}
                          alt="Pré-visualização do logo"
                          className="preview-image"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => router.push("/funcionario/laboratorio/lista")}
                >
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Cadastrar Laboratório
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

        /* Wrapper de Conteúdo */
        .content-wrapper {
          display: flex;
          flex: 1;
          position: relative;
        }

        /* Sidebar Não Fixa */
        .sidebar {
          width: 280px;
          background: #191970;
          color: #CDC1C5;
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
          color: #696969;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          color: #CDC1C5;
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
          color: #DCDCDC;
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

        // .form-section {
        //   border-left: 4px solid #3498db;
        //   padding-left: 20px;
        // }

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
          border-color: #458B00;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        /* Upload de Arquivo */
        .file-upload-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-input {
          display: none;
        }

        .file-label {
          padding: 12px 16px;
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #f8f9fa;
        }

        .file-label:hover {
          border-color: #458B00;
          background: #F5FFFA;
        }

        .file-icon {
          font-size: 18px;
        }

        .file-name {
          font-size: 12px;
          color: #6c757d;
          text-align: center;
        }

        /* Preview de Imagem */
        .image-preview {
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 150px;
          background: #f8f9fa;
        }

        .preview-image {
          max-width: 200px;
          max-height: 120px;
          object-fit: contain;
          border-radius: 4px;
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
          background: #458B00;
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
          box-shadow: 0 4px 12px #2F4F4F;
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

        /* Responsividade */
        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 30px;
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
            width: 280px;
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

          .form-container {
            padding: 20px;
          }

          .form {
            padding: 24px;
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