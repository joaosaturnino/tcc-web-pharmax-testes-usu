"use client"; // Indica que este componente roda no navegador (necessário para useState e useEffect)

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./perfil.module.css"; // Importa o CSS Modular
import api from "../../services/api"; // Configuração do Axios
import toast, { Toaster } from "react-hot-toast"; // Biblioteca de notificações visuais

export default function PerfilUsuarioPage() {
  // --- ESTADOS DE CONTROLE ---
  const [userData, setUserData] = useState(null); // Armazena os dados originais vindos do banco (para cancelar edição)
  const [loading, setLoading] = useState(true);   // Spinner de carregamento inicial
  const [sidebarOpen, setSidebarOpen] = useState(false); // Menu mobile
  const [editing, setEditing] = useState(false);  // Controla o modo da tela: Visualização (false) ou Edição (true)
  
  // Estado do formulário (separado do userData para permitir edição sem alterar a visualização imediatamente)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    // Objeto aninhado para facilitar a manipulação do endereço
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });
  
  // Estados para Upload de Imagem e API de CEP
  const [logoFile, setLogoFile] = useState(null); // Armazena o arquivo de imagem selecionado
  const [cepLoading, setCepLoading] = useState(false); // Spinner específico dentro do input de CEP

  // --- ESTADOS DO MODAL DE SENHA ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [passwordErrors, setPasswordErrors] = useState({}); // Armazena erros de validação da senha
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Loading do botão de salvar senha

  const router = useRouter();

  // --- BUSCA DE DADOS AO CARREGAR A PÁGINA ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. Validação de Segurança (Sessão)
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) { router.push("/login"); return; }

        const userDataFromStorage = JSON.parse(userDataString);
        const farmaciaId = userDataFromStorage.farm_id;
        
        if (!farmaciaId) { 
            localStorage.clear(); 
            router.push("/login"); 
            return; 
        }

        // 2. Chamada à API para pegar dados atualizados
        const response = await api.get(`/farmacias/${farmaciaId}`);
        
        if (response.data.sucesso) {
          const apiData = response.data.dados;

          // 3. Tratamento da URL da Logo (Avatar)
          // Garante que a URL da imagem esteja correta (caminho relativo vs absoluto)
          let fullAvatarUrl = apiData.farm_logo_url || apiData.farm_logo;
          if (fullAvatarUrl && !fullAvatarUrl.startsWith('http')) {
            // Se a API base terminar com '/', remove para não duplicar barras
            const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
            const avatarPath = fullAvatarUrl.startsWith('/') ? fullAvatarUrl : `/${fullAvatarUrl}`;
            fullAvatarUrl = `${baseUrl}${avatarPath}`;
          }
          
          // 4. LÓGICA DE "PARSING" DO ENDEREÇO (IMPORTANTE)
          // O banco salva o endereço como uma única string: "Rua X, 123 - Bairro, Cidade/UF - CEP: 00000"
          // Precisamos "quebrar" essa string em campos separados para preencher o formulário.
          const addressString = apiData.farm_endereco || "";
          
          // Expressão Regular (Regex) para capturar as partes do endereço
          // Explicação rápida: (.*) pega tudo até a vírgula, (.*?) pega até o traço, etc.
          const addressRegex = /^(.*),\s*(.*?)\s*-\s*(.*?),\s*(.*?)\/(.*?)(?:\s*-\s*CEP:\s*(.*))?$/;
          const match = addressString.match(addressRegex);

          let enderecoObj = {
            cep: "",
            rua: addressString, // Se o regex falhar, coloca tudo na rua para não perder dados
            numero: "",
            bairro: "",
            cidade: "",
            estado: ""
          };

          // Se a string do banco seguir o padrão esperado, preenchemos o objeto corretamente
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
          
          // Monta o objeto final formatado
          const formattedData = {
            id: apiData.farm_id,
            nome: apiData.farm_nome,
            email: apiData.farm_email,
            avatar: fullAvatarUrl,
            telefone: apiData.farm_telefone,
            cnpj: apiData.farm_cnpj,
            endereco: enderecoObj,
          };
          
          setUserData(formattedData); // Dados usados para exibição (Visualização)
          setFormData(formattedData); // Dados usados nos inputs (Edição)
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        toast.error("Não foi possível carregar os dados.");
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

  // --- HANDLERS DE INPUT (ATUALIZAÇÃO DO ESTADO) ---
  
  // Para campos de primeiro nível (nome, email, telefone)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Para campos aninhados dentro de 'endereco'
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      endereco: { ...prev.endereco, [name]: value } 
    }));
  };

  // --- INTEGRAÇÃO COM VIACEP ---
  // Disparado no evento onBlur (quando o usuário sai do campo CEP)
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        // Preenche automaticamente os campos de endereço
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
        toast.success("Endereço encontrado!");
      } else {
        toast.error("CEP não encontrado.");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  // Handler para quando o usuário seleciona um arquivo de imagem
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // --- SALVAR DADOS DO PERFIL ---
  const handleSave = async () => {
    try {
      // Cria um objeto FormData (necessário para enviar arquivos + texto via HTTP)
      const payload = new FormData();
      
      // Reconstrói a string única de endereço para salvar no banco de dados
      const { rua, numero, bairro, cidade, estado, cep } = formData.endereco;
      const enderecoCompleto = `${rua || ''}, ${numero || 'S/N'} - ${bairro || ''}, ${cidade || ''}/${estado || ''} - CEP: ${cep || ''}`;

      // Adiciona os campos ao FormData
      payload.append("farm_nome", formData.nome);
      payload.append("farm_email", formData.email);
      payload.append("farm_telefone", formData.telefone);
      payload.append("farm_cnpj", formData.cnpj);
      payload.append("farm_endereco", enderecoCompleto);
      
      // Só adiciona a logo se um novo arquivo foi selecionado
      if (logoFile) {
        payload.append("farm_logo", logoFile);
      }

      // Envia PUT para atualizar
      const response = await api.put(`/farmacias/${userData.id}`, payload);
      
      if (response.data.sucesso) {
        toast.success("Perfil atualizado com sucesso!");

        // Atualiza o estado local com os novos dados para refletir na tela imediatamente
        let updatedUserData = { ...userData, ...formData };
        
        // Se o backend retornou a nova URL da logo, atualizamos o estado
        if (response.data.dados?.farm_logo_url) {
          let newAvatarUrl = response.data.dados.farm_logo_url;
          // Garante URL absoluta para exibição
          if (!newAvatarUrl.startsWith('http')) {
            const baseUrl = api.defaults.baseURL.endsWith('/') ? api.defaults.baseURL.slice(0, -1) : api.defaults.baseURL;
            newAvatarUrl = `${baseUrl}${newAvatarUrl.startsWith('/') ? '' : '/'}${newAvatarUrl}`;
          }
          updatedUserData.avatar = newAvatarUrl;
        }

        // Atualiza também o LocalStorage para manter consistência no header/sidebar
        const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
        const newStoredData = { 
            ...storedData, 
            farm_nome: updatedUserData.nome, 
            farm_logo_url: updatedUserData.avatar,
            farm_id: userData.id 
        };
        localStorage.setItem("userData", JSON.stringify(newStoredData));

        setUserData(updatedUserData); // Atualiza visualização
        setFormData(updatedUserData); // Sincroniza form
        setEditing(false); // Sai do modo edição
        setLogoFile(null); // Limpa arquivo temporário
      } else {
        toast.error("Erro ao atualizar: " + response.data.mensagem);
      }
    } catch (error) {
      toast.error("Erro ao salvar: " + (error.response?.data?.mensagem || error.message));
    }
  };

  // Cancela edição e reverte os dados
  const handleCancel = () => {
    setFormData(userData); // Volta para os dados originais (userData)
    setEditing(false);
    setLogoFile(null);
  };

  // --- LÓGICA DO MODAL DE SENHA ---
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Validação simples dos campos de senha
  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Senha atual é obrigatória";
    
    if (!passwordData.newPassword) errors.newPassword = "Nova senha é obrigatória";
    else if (passwordData.newPassword.length < 6) errors.newPassword = "A senha deve ter no mínimo 6 caracteres";
    
    if (!passwordData.confirmPassword) errors.confirmPassword = "Confirmação é obrigatória";
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
      // Rota específica para troca de senha
      const response = await api.put(`/farmacias/${userData.id}/senha`, {
        senha_atual: passwordData.currentPassword,
        nova_senha: passwordData.newPassword
      });

      if (response.data.sucesso) {
        toast.success("Senha alterada com sucesso!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => { closePasswordModal(); }, 1500);
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

  // --- RENDERIZAÇÃO (JSX) ---
  
  if (loading) return <div className={styles.loaderContainer}><div className={styles.spinner}></div><p>Carregando perfil...</p></div>;
  if (!userData) return <div className={styles.loaderContainer}><p>Erro ao carregar dados.</p></div>;

  return (
    <div className={styles.dashboard}>
      <Toaster position="top-right" />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className={styles.title}>Meu Perfil</h1>
        </div>
      </header>
      
      <div className={styles.contentWrapper}>
        {/* SIDEBAR (Estrutura padrão) */}
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
          {/* CABEÇALHO DO PERFIL COM AVATAR */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>
                    {/* Condicional: Mostra preview local se estiver editando, ou imagem do banco */}
                    {editing && logoFile ? (
                        <img src={URL.createObjectURL(logoFile)} alt="Preview" className={styles.avatarImage} />
                    ) : (
                        userData.avatar ? (<img src={userData.avatar} alt="Logo" className={styles.avatarImage} />) : (<span>{userData.nome?.[0]}</span>)
                    )}
                </div>
                {/* Botão de troca de logo (disfarçado de label para input file) */}
                {editing && (
                    <label htmlFor="logo-upload" className={styles.changeAvatarBtn}>
                        Trocar Logo
                        <input type="file" id="logo-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                )}
                <h2>{userData.nome}</h2>
            </div>
          </div>
          
          <div className={styles.profileContent}>
            <div className={styles.sectionHeader}>
                <h3>Informações da Farmácia</h3>
                {/* Botões condicionais: Editar OU Salvar/Cancelar */}
                {!editing ? (
                    <button className={styles.actionButton} onClick={() => setEditing(true)}>Editar Perfil</button>
                ) : (
                    <div className={styles.editActions}>
                        <button className={styles.cancelButton} onClick={handleCancel}>Cancelar</button>
                        <button className={styles.saveButton} onClick={handleSave}>Salvar</button>
                    </div>
                )}
            </div>
            
            {/* FORMULÁRIO DE DADOS GERAIS */}
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>Nome da Farmácia</label>
                    {/* Se editing=true, renderiza Input. Se false, renderiza Texto <p> */}
                    {editing ? (<input className={styles.modernInput} type="text" name="nome" value={formData.nome} onChange={handleInputChange} />) : (<p>{userData.nome}</p>)}
                </div>
                <div className={styles.formGroup}>
                    <label>Email de Contato</label>
                    {editing ? (<input className={styles.modernInput} type="email" name="email" value={formData.email} onChange={handleInputChange} />) : (<p>{userData.email}</p>)}
                </div>
                <div className={styles.formGroup}>
                    <label>CNPJ</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} />) : (<p>{userData.cnpj}</p>)}
                </div>
                <div className={styles.formGroup}>
                    <label>Telefone</label>
                    {editing ? (<input className={styles.modernInput} type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} />) : (<p>{userData.telefone}</p>)}
                </div>
            </div>
            
            <div className={styles.sectionHeader}><h3>Endereço</h3></div>
            
            {/* FORMULÁRIO DE ENDEREÇO */}
            <div className={styles.addressGrid}>
                <div className={`${styles.formGroup} ${styles.cepGroup}`}>
                    <label>CEP</label>
                    {editing ? (
                      <div className={styles.cepInputContainer}>
                          <input className={styles.modernInput} type="text" name="cep" value={formData.endereco.cep} onChange={handleAddressChange} onBlur={handleCepBlur} placeholder="00000-000" />
                          {cepLoading && <div className={styles.cepSpinner}></div>}
                      </div>
                    ) : (<p>{userData.endereco.cep || '-'}</p>)}
                </div>
                
                <div className={`${styles.formGroup} ${styles.ruaGroup}`}>
                    <label>Rua / Logradouro</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="rua" value={formData.endereco.rua} onChange={handleAddressChange} />) : (<p>{userData.endereco.rua || '-'}</p>)}
                </div>
                
                <div className={`${styles.formGroup} ${styles.numeroGroup}`}>
                    <label>Número</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="numero" value={formData.endereco.numero} onChange={handleAddressChange} />) : (<p>{userData.endereco.numero || '-'}</p>)}
                </div>
                
                <div className={`${styles.formGroup} ${styles.bairroGroup}`}>
                    <label>Bairro</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="bairro" value={formData.endereco.bairro} onChange={handleAddressChange} />) : (<p>{userData.endereco.bairro || '-'}</p>)}
                </div>
                
                <div className={`${styles.formGroup} ${styles.cidadeGroup}`}>
                    <label>Cidade</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="cidade" value={formData.endereco.cidade} onChange={handleAddressChange} />) : (<p>{userData.endereco.cidade || '-'}</p>)}
                </div>
                
                <div className={`${styles.formGroup} ${styles.estadoGroup}`}>
                    <label>Estado</label>
                    {editing ? (<input className={styles.modernInput} type="text" name="estado" value={formData.endereco.estado} onChange={handleAddressChange} />) : (<p>{userData.endereco.estado || '-'}</p>)}
                </div>
            </div>
            
            {/* Botão para alterar senha */}
            <div className={styles.sectionHeader} style={{ marginTop: '3.2rem' }}>
                <button className={styles.actionButtonAlt} onClick={() => setShowPasswordModal(true)}>Alterar Senha</button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE ALTERAÇÃO DE SENHA */}
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
                  <input 
                    className={styles.modernInput} 
                    type="password" 
                    id="currentPassword" 
                    name="currentPassword" 
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange} 
                  />
                  {passwordErrors.currentPassword && (<span className={styles.errorText}>{passwordErrors.currentPassword}</span>)}
              </div>
              
              <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nova Senha</label>
                  <input 
                    className={styles.modernInput} 
                    type="password" 
                    id="newPassword" 
                    name="newPassword" 
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange} 
                  />
                  {passwordErrors.newPassword && (<span className={styles.errorText}>{passwordErrors.newPassword}</span>)}
              </div>
              
              <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <input 
                    className={styles.modernInput} 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange} 
                  />
                  {passwordErrors.confirmPassword && (<span className={styles.errorText}>{passwordErrors.confirmPassword}</span>)}
              </div>
              
              <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelButton} onClick={closePasswordModal}>Cancelar</button>
                  <button type="submit" className={styles.saveButton} disabled={isChangingPassword}>
                    {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}