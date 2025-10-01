"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";
import api from "../../services/api"; // Importa a instância do Axios

export default function PerfilUsuarioPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logoFile, setLogoFile] = useState(null); // NOVO: Estado para a nova logo (arquivo)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();

  // Hook para buscar os dados da API quando o componente é carregado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ### INÍCIO DA ALTERAÇÃO: Validação e autenticação do ID ###
        
        // 1. Pega os dados do usuário do localStorage.
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          alert("Sua sessão expirou. Por favor, faça o login novamente.");
          router.push("/login");
          return;
        }
        
        // 2. Converte os dados para objeto e extrai o ID.
        const userDataFromStorage = JSON.parse(userDataString);
        const farmaciaId = userDataFromStorage.farm_id; // Supondo que o ID está salvo como 'farm_id'

        if (!farmaciaId) {
          alert("Não foi possível identificar sua farmácia. Por favor, faça o login novamente.");
          localStorage.clear(); // Limpa dados inválidos
          router.push("/login");
          return;
        }
        
        // 3. Usa o ID validado para fazer a chamada à API.
        const response = await api.get(`/farmacias/${farmaciaId}`); 
        // ### FIM DA ALTERAÇÃO ###

        if (response.data.sucesso) {
          const apiData = response.data.dados;
          // Adapta os dados da API para o formato esperado pelo front-end
          const formattedData = {
              id: apiData.farm_id,
              nome: apiData.farm_nome,
              email: apiData.farm_email,
              avatar: apiData.farm_logo_url || apiData.farm_logo, // Prioriza a URL se a API retornar, senão usa o nome do arquivo
              //cargo: "Supervisor", // Mantive comentado como no original
              telefone: apiData.farm_telefone,
              dataNascimento: "1985-05-15",
              cpf: apiData.farm_cnpj, // Adaptando CNPJ para o campo CPF
              endereco: {
                  rua: apiData.farm_endereco,
                  numero: "", 
                  complemento: "",
                  bairro: "",
                  cidade: "",
                  estado: "",
                  cep: "",
              },
              dataCadastro: "2023-01-10T08:30:00Z",
              ultimoAcesso: "2023-08-20T14:25:00Z",
          };
          setUserData(formattedData);
          setFormData(formattedData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da farmácia:", error);
        alert("Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]); // Adicionado router como dependência do useEffect

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // ATUALIZADO: Lógica para campos de texto (o arquivo é tratado em handleFileChange)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // NOVO: Função para lidar com a seleção do arquivo de logo
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      // ATUALIZADO: Uso de FormData para suportar upload de arquivo
      const payload = new FormData();
      payload.append("farm_nome", formData.nome);
      payload.append("farm_email", formData.email);
      payload.append("farm_telefone", formData.telefone);
      payload.append("farm_cnpj", formData.cpf);
      payload.append("farm_endereco", formData.endereco.rua);
      
      // Adiciona o arquivo da logo se um novo foi selecionado
      if (logoFile) {
        // 'farm_logo' é o nome que a API deve esperar para o arquivo
        payload.append("farm_logo", logoFile); 
      }

      // O Axios/Navegador lida com o Content-Type: multipart/form-data automaticamente
      const response = await api.put(`/farmacias/${userData.id}`, payload); 

      if (response.data.sucesso) {
          alert("Perfil atualizado com sucesso!");
          
          // Atualiza os dados locais, incluindo a nova URL da logo, se retornada
          const updatedUserData = { ...userData, ...formData };
          // NOVO: Verifica se a API retornou o campo 'farm_logo_url' ou 'farm_logo'
          if (response.data.dados && (response.data.dados.farm_logo_url || response.data.dados.farm_logo)) {
              // Usa farm_logo_url se existir, senão usa farm_logo (caminho/nome)
              updatedUserData.avatar = response.data.dados.farm_logo_url || response.data.dados.farm_logo;
          }
          
          setUserData(updatedUserData);
          setFormData(updatedUserData); // Garante que o formData também reflita o avatar atualizado
          setEditing(false);
          setLogoFile(null); // Limpa o arquivo após o sucesso
      } else {
          alert("Erro ao atualizar o perfil: " + response.data.mensagem);
      }
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        alert("Erro ao salvar: " + (error.response?.data?.mensagem || error.message));
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      dataNascimento: userData.dataNascimento,
      cpf: userData.cpf, // Corrigido
      endereco: userData.endereco, // Corrigido
    });
    setEditing(false);
    setLogoFile(null); // NOVO: Limpa o arquivo ao cancelar
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Senha atual é obrigatória";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Nova senha é obrigatória";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "A senha deve ter pelo menos 6 caracteres";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);
    setPasswordErrors({});

    try {
      // NOTE: Para alteração de senha, o endpoint PUT `/farmacias/${userData.id}` 
      // deve ser configurado no backend para aceitar o campo 'farm_senha' e atualizar
      // apenas a senha.
      const response = await api.put(`/farmacias/${userData.id}`, {
        farm_senha: passwordData.newPassword,
      });

      if (response.data.sucesso) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
         setPasswordErrors({ submit: response.data.mensagem || "Não foi possível alterar a senha." });
      }

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setPasswordErrors({ submit: "Erro ao alterar senha. Tente novamente." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setPasswordSuccess(false);
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }
  
  if (!userData) {
      return (
          <div className={styles.dashboard}>
              <div className={styles.loaderContainer}>
                <p>Não foi possível carregar os dados do perfil. Redirecionando para o login...</p>
              </div>
          </div>
      )
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className={styles.title}>Meu Perfil</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
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
                  className={styles.navLink}
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
                  className={`${styles.navLink} ${styles.active}`}
                  
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

          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}


        <main className={styles.mainContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarLarge}>
                {/* ATUALIZADO: Renderiza a imagem atual ou preview da nova logo */}
                {editing && logoFile ? (
                    <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Nova Logo Preview" 
                        className={styles.avatarImage} 
                    />
                ) : (
                    // Se userData.avatar tiver um valor (URL ou nome do arquivo), mostra a imagem.
                    userData.avatar ? (
                        <img 
                            src={userData.avatar} 
                            alt="Logo da Farmácia" 
                            className={styles.avatarImage} 
                        />
                    ) : (
                        <span>{userData.nome ? userData.nome[0] : 'U'}</span> // Fallback para a primeira letra do nome
                    )
                )}
              </div>
              
              {/* NOVO: Input e botão para alterar a imagem */}
              {editing && (
                  <label htmlFor="logo-upload" className={styles.changeAvatarBtn}>
                      Trocar Logo
                      <input
                          type="file"
                          id="logo-upload"
                          name="logoFile"
                          accept="image/*"
                          onChange={handleFileChange} // Usa a função de file
                          style={{ display: 'none' }} // Esconde o input original
                      />
                  </label>
              )}

              <h2>{userData.nome}</h2>
              <p>{userData.cargo}</p>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>128</span>
                <span className={styles.statLabel}>
                  Medicamentos Cadastrados
                </span>
              </div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <div className={styles.sectionHeader}>
              <h3>Informações Pessoais</h3>
              {!editing ? (
                <button
                  className={styles.editBtn}
                  onClick={() => setEditing(true)}
                >
                  Editar Perfil
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    Cancelar
                  </button>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                {editing ? (
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.nome}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>CNPJ</label>
                <p>{userData.cpf}</p>
              </div>

              <div className={styles.formGroup}>
                <label>Telefone</label>
                {editing ? (
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.telefone}</p>
                )}
              </div>
              
            </div>

            <div className={styles.sectionHeader}>
              <h3>Endereço</h3>
            </div>

            <div className={styles.formGrid}>
               <div className={styles.formGroup}>
                <label>Rua</label>
                {editing ? (
                  <input
                    type="text"
                    name="rua"
                    value={formData.endereco.rua || ''} // Corrigido para acessar via formData.endereco.rua
                    onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        endereco: { ...prev.endereco, rua: e.target.value } 
                    }))} // Tratamento específico para sub-objeto endereco
                  />
                ) : (
                  <p>{userData.endereco.rua}</p>
                )}
              </div>
            </div>

            <div className={styles.sectionHeader}>
              <button
                className={styles.editBtn}
                onClick={() => setShowPasswordModal(true)}
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </main>
      </div>

      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Alterar Senha</h2>
              <button
                className={styles.modalClose}
                onClick={closePasswordModal}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
              {passwordSuccess ? (
                <div className={styles.successMessage}>
                  <p>Senha alterada com sucesso!</p>
                </div>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={
                        passwordErrors.currentPassword ? styles.inputError : ""
                      }
                    />
                    {passwordErrors.currentPassword && (
                      <span className={styles.errorText}>
                        {passwordErrors.currentPassword}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">Nova Senha</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={
                        passwordErrors.newPassword ? styles.inputError : ""
                      }
                    />
                    {passwordErrors.newPassword && (
                      <span className={styles.errorText}>
                        {passwordErrors.newPassword}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={
                        passwordErrors.confirmPassword ? styles.inputError : ""
                      }
                    />
                    {passwordErrors.confirmPassword && (
                      <span className={styles.errorText}>
                        {passwordErrors.confirmPassword}
                      </span>
                    )}
                  </div>

                  {passwordErrors.submit && (
                    <div className={styles.errorMessage}>
                      {passwordErrors.submit}
                    </div>
                  )}

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={closePasswordModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Alterando...
                        </>
                      ) : (
                        "Alterar Senha"
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}