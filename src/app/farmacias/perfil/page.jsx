"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./perfil.module.css";
import api from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

export default function PerfilUsuarioPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [cepLoading, setCepLoading] = useState(false);

  // Estados do Modal de Senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const router = useRouter();

  // --- BUSCAR DADOS ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) { router.push("/login"); return; }

        const userDataFromStorage = JSON.parse(userDataString);
        const farmaciaId = userDataFromStorage.farm_id;
        if (!farmaciaId) { localStorage.clear(); router.push("/login"); return; }

        const response = await api.get(`/farmacias/${farmaciaId}`);
        if (response.data.sucesso) {
          const apiData = response.data.dados;

          // Tratamento da URL do Avatar
          let fullAvatarUrl = apiData.farm_logo_url || apiData.farm_logo;
          if (fullAvatarUrl && !fullAvatarUrl.startsWith('http')) {
            const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
            const avatarPath = fullAvatarUrl.startsWith('/') ? fullAvatarUrl : `/${fullAvatarUrl}`;
            fullAvatarUrl = `${baseUrl}${avatarPath}`;
          }
          
          // LÓGICA DE PARSING DO ENDEREÇO
          // Tenta separar a string "Rua, Num - Bairro, Cidade/UF - CEP: 00000" em campos
          const addressString = apiData.farm_endereco || "";
          // Regex: Captura (Rua), (Num) - (Bairro), (Cidade)/(UF) [- CEP: (Cep)] opcional
          const addressRegex = /^(.*),\s*(.*?)\s*-\s*(.*?),\s*(.*?)\/(.*?)(?:\s*-\s*CEP:\s*(.*))?$/;
          const match = addressString.match(addressRegex);

          let enderecoObj = {
            cep: "",
            rua: addressString, // Fallback: se não der match, mostra tudo na rua
            numero: "",
            bairro: "",
            cidade: "",
            estado: ""
          };

          if (match) {
            enderecoObj = {
              rua: match[1],
              numero: match[2],
              bairro: match[3],
              cidade: match[4],
              estado: match[5],
              cep: match[6] || ""
            };
          }
          
          const formattedData = {
            id: apiData.farm_id,
            nome: apiData.farm_nome,
            email: apiData.farm_email,
            avatar: fullAvatarUrl,
            telefone: apiData.farm_telefone,
            cnpj: apiData.farm_cnpj,
            endereco: enderecoObj,
          };
          setUserData(formattedData);
          setFormData(formattedData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da farmácia:", error);
        toast.error("Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  // --- HANDLERS DE INPUT ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, endereco: { ...prev.endereco, [name]: value } }));
  };

  // --- BUSCA DE CEP ---
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }
        }));
      } else {
        toast.error("CEP não encontrado.");
      }
    } catch (error) {
      toast.error("Não foi possível buscar o endereço. Tente novamente.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // --- SALVAR ALTERAÇÕES ---
  const handleSave = async () => {
    try {
      const payload = new FormData();
      
      const { rua, numero, bairro, cidade, estado, cep } = formData.endereco;
      // Formata a string para incluir o CEP no final, permitindo o parsing no futuro
      const enderecoCompleto = `${rua || ''}, ${numero || 'S/N'} - ${bairro || ''}, ${cidade || ''}/${estado || ''} - CEP: ${cep || ''}`;

      payload.append("farm_nome", formData.nome);
      payload.append("farm_email", formData.email);
      payload.append("farm_telefone", formData.telefone);
      payload.append("farm_cnpj", formData.cnpj);
      payload.append("farm_endereco", enderecoCompleto);
      
      if (logoFile) {
        payload.append("farm_logo", logoFile);
      }

      const response = await api.put(`/farmacias/${userData.id}`, payload);
      
      if (response.data.sucesso) {
        toast.success("Perfil atualizado com sucesso!");

        let updatedUserData = { ...userData, ...formData };
        
        if (response.data.dados?.farm_logo_url) {
          let newAvatarUrl = response.data.dados.farm_logo_url;
          if (!newAvatarUrl.startsWith('http')) {
            const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
            newAvatarUrl = `${baseUrl}${newAvatarUrl.startsWith('/') ? '' : '/'}${newAvatarUrl}`;
          }
          updatedUserData.avatar = newAvatarUrl;
        }

        const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
        const newStoredData = { 
            ...storedData, 
            farm_nome: updatedUserData.nome, 
            farm_logo_url: updatedUserData.avatar,
            farm_id: userData.id 
        };
        localStorage.setItem("userData", JSON.stringify(newStoredData));

        setUserData(updatedUserData);
        setFormData(updatedUserData);
        setEditing(false);
        setLogoFile(null);
      } else {
        toast.error("Erro ao atualizar o perfil: " + response.data.mensagem);
      }
    } catch (error) {
      toast.error("Erro ao salvar: " + (error.response?.data?.mensagem || error.message));
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditing(false);
    setLogoFile(null);
  };

  // --- Funções do Modal de Senha ---
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
      const response = await api.put(`/farmacias/${userData.id}/senha`, {
        senha_atual: passwordData.currentPassword,
        nova_senha: passwordData.newPassword
      });
      if (response.data.sucesso) {
        toast.success("Senha alterada com sucesso!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => { closePasswordModal(); }, 2000);
      } else {
        toast.error(response.data.mensagem || "Não foi possível alterar a senha.");
      }
    } catch (error) {
      toast.error(error.response?.data?.mensagem || "Erro ao alterar senha.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({});
  };

  if (loading) { return (<div className={styles.loaderContainer}><div className={styles.spinner}></div><p>Carregando perfil...</p></div>); }
  if (!userData) { return (<div className={styles.loaderContainer}><p>Não foi possível carregar os dados.</p></div>); }

  return (
    <div className={styles.dashboard}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff', fontSize: '1.5rem', padding: '1.6rem' },
          success: { style: { background: '#458B00' } },
          error: { style: { background: '#dc2626' } },
        }}
      />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className={styles.title}>Meu Perfil</h1>
        </div>
      </header>
      
      <div className={styles.contentWrapper}>
        {/* SIDEBAR */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logoContainer}>
                {userData.avatar && <img src={userData.avatar} alt="Logo" className={styles.sidebarAvatar} />}
                <span className={styles.logoText}>{userData.nome}</span>
            </div>
            <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <nav className={styles.nav}>
             <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
             <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
             <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
             <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
          </nav>
        </aside>
        
        {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        
        <main className={styles.mainContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>
                    {editing && logoFile ? (
                        <img src={URL.createObjectURL(logoFile)} alt="Nova Logo Preview" className={styles.avatarImage} />
                    ) : (
                        userData.avatar ? (<img src={userData.avatar} alt="Logo da Farmácia" className={styles.avatarImage} />) : (<span>{userData.nome ? userData.nome[0] : 'P'}</span>)
                    )}
                </div>
                {editing && (
                    <label htmlFor="logo-upload" className={styles.changeAvatarBtn}>Trocar Logo<input type="file" id="logo-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} /></label>
                )}
                <h2>{userData.nome}</h2>
            </div>
          </div>
          
          <div className={styles.profileContent}>
            <div className={styles.sectionHeader}>
                <h3>Informações da Farmácia</h3>
                {!editing ? (
                    <button className={styles.actionButton} onClick={() => setEditing(true)}>Editar Perfil</button>
                ) : (
                    <div className={styles.editActions}>
                        <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
                        <button className={styles.saveButton} onClick={handleSave}>Salvar</button>
                    </div>
                )}
            </div>
            
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Nome da Farmácia</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} />) : (<p>{userData.nome}</p>)}
                </div>
                <div className={styles.formGroup}>
                    <label>Email de Contato</label>
                    {editing ? (<input className={styles.modernInput} type="email" name="email" value={formData.email || ''} onChange={handleInputChange} />) : (<p>{userData.email}</p>)}
                </div>
                <div className={styles.formGroup}>
                    <label>CNPJ</label>
                    {editing ? (
                        <input className={styles.modernInput} type="text" name="cnpj" value={formData.cnpj || ''} onChange={handleInputChange} />
                    ) : (
                        <p>{userData.cnpj}</p>
                    )}
                </div>
                <div className={styles.formGroup}>
                    <label>Telefone</label>
                    {editing ? (<input className={styles.modernInput} type="tel" name="telefone" value={formData.telefone || ''} onChange={handleInputChange} />) : (<p>{userData.telefone}</p>)}
                </div>
            </div>
            
            <div className={styles.sectionHeader}><h3>Endereço</h3></div>
            
            {/* ÁREA DO ENDEREÇO: AGORA MOSTRA TUDO SEJA EDITANDO OU VISUALIZANDO */}
            {editing ? (
                <div className={styles.addressGrid}>
                    <div className={`${styles.formGroup} ${styles.cepGroup}`}>
                        <label>CEP</label>
                        <div className={styles.cepInputContainer}>
                            <input className={styles.modernInput} type="text" name="cep" value={formData.endereco.cep || ''} onChange={handleAddressChange} onBlur={handleCepBlur} placeholder="00000-000" />
                            {cepLoading && <div className={styles.cepSpinner}></div>}
                        </div>
                    </div>
                    <div className={`${styles.formGroup} ${styles.ruaGroup}`}>
                        <label>Rua / Logradouro</label>
                        <input className={styles.modernInput} type="text" name="rua" value={formData.endereco.rua || ''} onChange={handleAddressChange} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.numeroGroup}`}>
                        <label>Número</label>
                        <input className={styles.modernInput} type="text" name="numero" value={formData.endereco.numero || ''} onChange={handleAddressChange} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.bairroGroup}`}>
                        <label>Bairro</label>
                        <input className={styles.modernInput} type="text" name="bairro" value={formData.endereco.bairro || ''} onChange={handleAddressChange} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.cidadeGroup}`}>
                        <label>Cidade</label>
                        <input className={styles.modernInput} type="text" name="cidade" value={formData.endereco.cidade || ''} onChange={handleAddressChange} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.estadoGroup}`}>
                        <label>Estado</label>
                        <input className={styles.modernInput} type="text" name="estado" value={formData.endereco.estado || ''} onChange={handleAddressChange} />
                    </div>
                </div>
            ) : (
                // MUDANÇA AQUI: Visualização expandida (Grid) ao invés de um único <p>
                <div className={styles.addressGrid}>
                    <div className={`${styles.formGroup} ${styles.cepGroup}`}>
                        <label>CEP</label>
                        <p>{userData.endereco.cep || '-'}</p>
                    </div>
                    <div className={`${styles.formGroup} ${styles.ruaGroup}`}>
                        <label>Rua / Logradouro</label>
                        <p>{userData.endereco.rua || '-'}</p>
                    </div>
                    <div className={`${styles.formGroup} ${styles.numeroGroup}`}>
                        <label>Número</label>
                        <p>{userData.endereco.numero || '-'}</p>
                    </div>
                    <div className={`${styles.formGroup} ${styles.bairroGroup}`}>
                        <label>Bairro</label>
                        <p>{userData.endereco.bairro || '-'}</p>
                    </div>
                    <div className={`${styles.formGroup} ${styles.cidadeGroup}`}>
                        <label>Cidade</label>
                        <p>{userData.endereco.cidade || '-'}</p>
                    </div>
                    <div className={`${styles.formGroup} ${styles.estadoGroup}`}>
                        <label>Estado</label>
                        <p>{userData.endereco.estado || '-'}</p>
                    </div>
                </div>
            )}
            
            <div className={styles.sectionHeader} style={{ marginTop: '3.2rem' }}>
                <button className={styles.actionButtonAlt} onClick={() => setShowPasswordModal(true)}>Alterar Senha</button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE SENHA */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
                <h2>Alterar Senha</h2>
                <button className={styles.modalClose} onClick={closePasswordModal}>✕</button>
            </div>
            <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Senha Atual</label>
                  <input className={styles.modernInput} type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                  {passwordErrors.currentPassword && (<span className={styles.errorText}>{passwordErrors.currentPassword}</span>)}
              </div>
              <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nova Senha</label>
                  <input className={styles.modernInput} type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                  {passwordErrors.newPassword && (<span className={styles.errorText}>{passwordErrors.newPassword}</span>)}
              </div>
              <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <input className={styles.modernInput} type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                  {passwordErrors.confirmPassword && (<span className={styles.errorText}>{passwordErrors.confirmPassword}</span>)}
              </div>
              
              <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelButton} onClick={closePasswordModal}>Cancelar</button>
                  <button type="submit" className={styles.saveButton} disabled={isChangingPassword}>{isChangingPassword ? 'Alterando...' : 'Alterar Senha'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}