"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";

export default function PerfilUsuarioPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
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
    // Mock de dados do usuário
    setTimeout(() => {
      setUserData({
        id: "u1",
        nome: "Administrador",
        email: "admin@pharmax.com",
        avatar: "👤",
        cargo: "Supervisor",
        telefone: "(11) 99999-9999",
        dataNascimento: "1985-05-15",
        cpf: "123.456.789-00",
        endereco: {
          rua: "Rua das Farmácias",
          numero: "123",
          complemento: "Sala 45",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234-567",
        },
        dataCadastro: "2023-01-10T08:30:00Z",
        ultimoAcesso: "2023-08-20T14:25:00Z",
      });
      setFormData({
        nome: "Administrador",
        email: "admin@pharmax.com",
        telefone: "(11) 99999-9999",
        dataNascimento: "1985-05-15",
        rua: "Rua das Farmácias",
        numero: "123",
        complemento: "Sala 45",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      });
      setLoading(false);
    }, 800);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      router.push("../../home");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("../../home");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Aqui você faria a chamada para a API para salvar os dados
    console.log("Dados a serem salvos:", formData);
    setEditing(false);
    setUserData((prev) => ({
      ...prev,
      ...formData,
      endereco: {
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
      },
    }));
  };

  const handleCancel = () => {
    setFormData({
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      dataNascimento: userData.dataNascimento,
      rua: userData.endereco.rua,
      numero: userData.endereco.numero,
      complemento: userData.endereco.complemento,
      bairro: userData.endereco.bairro,
      cidade: userData.endereco.cidade,
      estado: userData.endereco.estado,
      cep: userData.endereco.cep,
    });
    setEditing(false);
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
      // Simulação de uma requisição para alterar a senha
      // Em uma aplicação real, você faria uma chamada para a API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulação de sucesso
      setPasswordSuccess(true);

      // Limpar o formulário após sucesso
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Fechar o modal após 2 segundos
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
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

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          ></button>
          <h1 className={styles.title}>Meu Perfil</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a href="/farmacias/favoritos" className={styles.navLink}>
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
            </div>
          </nav>

          <div className={styles.userPanel}>
            <button className={styles.navLink} onClick={handleLogout}>
                <span className={styles.navText}>Sair</span>
              </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className={styles.mainContent}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarLarge}>
                <span>{userData.avatar}</span>
              </div>
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
                    value={formData.nome}
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
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>CPF</label>
                <p>{userData.cpf}</p>
              </div>

              <div className={styles.formGroup}>
                <label>Telefone</label>
                {editing ? (
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.telefone}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Data de Nascimento</label>
                {editing ? (
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>
                    {new Date(userData.dataNascimento).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Data de Cadastro</label>
                <p>
                  {new Date(userData.dataCadastro).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className={styles.formGroup}>
                <label>Último Acesso</label>
                <p>{new Date(userData.ultimoAcesso).toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className={styles.sectionHeader}>
              <h3>Endereço</h3>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>CEP</label>
                {editing ? (
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.endereco.cep}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Rua</label>
                {editing ? (
                  <input
                    type="text"
                    name="rua"
                    value={formData.rua}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.endereco.rua}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Número</label>
                {editing ? (
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.endereco.numero}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Complemento</label>
                {editing ? (
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.endereco.complemento || "Nenhum"}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Bairro</label>
                {editing ? (
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.endereco.bairro}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Cidade</label>
                {editing ? (
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{userData.endereco.cidade}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Estado</label>
                {editing ? (
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minha Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                ) : (
                  <p>{userData.endereco.estado}</p>
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

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Alterar Senha</h2>
              <button
                className={styles.modalClose}
                onClick={closePasswordModal}
              >
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
