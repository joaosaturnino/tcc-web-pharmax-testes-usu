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
  const [logoFile, setLogoFile] = useState(null);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          alert("Sua sessão expirou. Por favor, faça o login novamente.");
          router.push("/login");
          return;
        }
        
        const userDataFromStorage = JSON.parse(userDataString);
        const farmaciaId = userDataFromStorage.farm_id;

        if (!farmaciaId) {
          alert("Não foi possível identificar sua farmácia. Por favor, faça o login novamente.");
          localStorage.clear();
          router.push("/login");
          return;
        }
        
        const response = await api.get(`/farmacias/${farmaciaId}`); 

        if (response.data.sucesso) {
          const apiData = response.data.dados;
          
          let fullAvatarUrl = apiData.farm_logo_url || apiData.farm_logo;
          if (fullAvatarUrl && !fullAvatarUrl.startsWith('http')) {
            const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
            const avatarPath = fullAvatarUrl.startsWith('/') ? fullAvatarUrl : `/${fullAvatarUrl}`;
            fullAvatarUrl = `${baseUrl}${avatarPath}`;
          }

          const formattedData = {
              id: apiData.farm_id,
              nome: apiData.farm_nome,
              email: apiData.farm_email,
              avatar: fullAvatarUrl,
              telefone: apiData.farm_telefone,
              dataNascimento: "1985-05-15",
              cpf: apiData.farm_cnpj,
              endereco: {
                  rua: apiData.farm_endereco || "",
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
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append("farm_nome", formData.nome);
      payload.append("farm_email", formData.email);
      payload.append("farm_telefone", formData.telefone);
      payload.append("farm_cnpj", formData.cpf);
      payload.append("farm_endereco", formData.endereco.rua);
      
      if (logoFile) {
        payload.append("farm_logo", logoFile); 
      }

      const response = await api.put(`/farmacias/${userData.id}`, payload); 

      if (response.data.sucesso) {
          alert("Perfil atualizado com sucesso!");
          
          const updatedUserData = { ...userData, ...formData };
          if (response.data.dados && (response.data.dados.farm_logo_url || response.data.dados.farm_logo)) {
              let newAvatarUrl = response.data.dados.farm_logo_url || response.data.dados.farm_logo;
              if (newAvatarUrl && !newAvatarUrl.startsWith('http')) {
                const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
                const avatarPath = newAvatarUrl.startsWith('/') ? newAvatarUrl : `/${newAvatarUrl}`;
                newAvatarUrl = `${baseUrl}${avatarPath}`;
              }
              updatedUserData.avatar = newAvatarUrl;
          }

          const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
          const newStoredData = { ...storedData, farm_nome: updatedUserData.nome, farm_logo_url: updatedUserData.avatar };
          localStorage.setItem("userData", JSON.stringify(newStoredData));
          
          setUserData(updatedUserData);
          setFormData(updatedUserData);
          setEditing(false);
          setLogoFile(null);
      } else {
          alert("Erro ao atualizar o perfil: " + response.data.mensagem);
      }
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        alert("Erro ao salvar: " + (error.response?.data?.mensagem || error.message));
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditing(false);
    setLogoFile(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Senha atual é obrigatória";
    if (!passwordData.newPassword) errors.newPassword = "Nova senha é obrigatória";
    else if (passwordData.newPassword.length < 6) errors.newPassword = "A senha deve ter pelo menos 6 caracteres";
    if (!passwordData.confirmPassword) errors.confirmPassword = "Confirmação de senha é obrigatória";
    else if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = "As senhas não coincidem";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setIsChangingPassword(true);
    setPasswordErrors({});
    try {
      const response = await api.put(`/farmacias/${userData.id}`, { farm_senha: passwordData.newPassword });
      if (response.data.sucesso) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => { setShowPasswordModal(false); setPasswordSuccess(false); }, 2000);
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
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({});
    setPasswordSuccess(false);
  };

  if (loading) {
    return (<div className={styles.dashboard}><div className={styles.loaderContainer}><div className={styles.spinner}></div><p>Carregando perfil...</p></div></div>);
  }
  
  if (!userData) {
    return (<div className={styles.dashboard}><div className={styles.loaderContainer}><p>Não foi possível carregar os dados. Redirecionando...</p></div></div>);
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}><button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button><h1 className={styles.title}>Meu Perfil</h1></div>
      </header>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            {/* INÍCIO DA MODIFICAÇÃO */}
            <div className={styles.sidebarHeader}>
              <div className={styles.logo}>
                {userData.avatar && <img src={userData.avatar} alt="Logo" className={styles.sidebarAvatar} />}
                <span className={styles.logoText}>{userData.nome}</span>
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
            </div>
            {/* FIM DA MODIFICAÇÃO */}
            <nav className={styles.nav}><div className={styles.navSection}><p className={styles.navLabel}>Principal</p><a href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></a><a href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></a></div><div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><a href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></a><a href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></a></div><div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><a href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></a><a href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></a><a href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></a></div><div className={styles.navSection}><p className={styles.navLabel}>Conta</p><a href="/farmacias/perfil" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Meu Perfil</span></a><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div></nav>
        </aside>
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarLarge}>{editing && logoFile ? (<img src={URL.createObjectURL(logoFile)} alt="Nova Logo Preview" className={styles.avatarImage} />) : (userData.avatar ? (<img src={userData.avatar} alt="Logo da Farmácia" className={styles.avatarImage} />) : (<span>{userData.nome ? userData.nome[0] : 'U'}</span>))}</div>
              {editing && (<label htmlFor="logo-upload" className={styles.changeAvatarBtn}>Trocar Logo<input type="file" id="logo-upload" name="logoFile" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} /></label>)}
              <h2>{userData.nome}</h2><p>{userData.cargo}</p>
            </div>
            <div className={styles.statsSection}><div className={styles.statItem}><span className={styles.statNumber}>128</span><span className={styles.statLabel}>Medicamentos Cadastrados</span></div></div>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.sectionHeader}><h3>Informações Pessoais</h3>{!editing ? (<button className={styles.editBtn} onClick={() => setEditing(true)}>Editar Perfil</button>) : (<div className={styles.editActions}><button className={styles.cancelBtn} onClick={handleCancel}>Cancelar</button><button className={styles.saveBtn} onClick={handleSave}>Salvar Alterações</button></div>)}</div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}><label>Nome Completo</label>{editing ? (<input type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} />) : (<p>{userData.nome}</p>)}</div>
              <div className={styles.formGroup}><label>Email</label>{editing ? (<input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} />) : (<p>{userData.email}</p>)}</div>
              <div className={styles.formGroup}><label>CNPJ</label><p>{userData.cpf}</p></div>
              <div className={styles.formGroup}><label>Telefone</label>{editing ? (<input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleInputChange} />) : (<p>{userData.telefone}</p>)}</div>
            </div>
            <div className={styles.sectionHeader}><h3>Endereço</h3></div>
            <div className={styles.formGrid}>
               <div className={styles.formGroup}><label>Rua</label>{editing ? (<input type="text" name="rua" value={formData.endereco.rua || ''} onChange={(e) => setFormData(prev => ({ ...prev, endereco: { ...prev.endereco, rua: e.target.value } }))} />) : (<p>{userData.endereco.rua}</p>)}</div>
            </div>
            <div className={styles.sectionHeader}><button className={styles.editBtn} onClick={() => setShowPasswordModal(true)}>Alterar Senha</button></div>
          </div>
        </main>
      </div>
      {showPasswordModal && (<div className={styles.modalOverlay}><div className={styles.modal}><div className={styles.modalHeader}><h2>Alterar Senha</h2><button className={styles.modalClose} onClick={closePasswordModal}>✕</button></div><form onSubmit={handlePasswordSubmit} className={styles.modalForm}>{passwordSuccess ? (<div className={styles.successMessage}><p>Senha alterada com sucesso!</p></div>) : (<><div className={styles.formGroup}><label htmlFor="currentPassword">Senha Atual</label><input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={passwordErrors.currentPassword ? styles.inputError : ""} />{passwordErrors.currentPassword && (<span className={styles.errorText}>{passwordErrors.currentPassword}</span>)}</div><div className={styles.formGroup}><label htmlFor="newPassword">Nova Senha</label><input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={passwordErrors.newPassword ? styles.inputError : ""} />{passwordErrors.newPassword && (<span className={styles.errorText}>{passwordErrors.newPassword}</span>)}</div><div className={styles.formGroup}><label htmlFor="confirmPassword">Confirmar Nova Senha</label><input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={passwordErrors.confirmPassword ? styles.inputError : ""} />{passwordErrors.confirmPassword && (<span className={styles.errorText}>{passwordErrors.confirmPassword}</span>)}</div>{passwordErrors.submit && (<div className={styles.errorMessage}>{passwordErrors.submit}</div>)}<div className={styles.modalActions}><button type="button" className={styles.cancelBtn} onClick={closePasswordModal}>Cancelar</button><button type="submit" className={styles.saveBtn} disabled={isChangingPassword}>{isChangingPassword ? (<><div className={styles.buttonSpinner}></div>Alterando...</>) : ("Alterar Senha")}</button></div></>)}</form></div></div>)}
    </div>
  );
}