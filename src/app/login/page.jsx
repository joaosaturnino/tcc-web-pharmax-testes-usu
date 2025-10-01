"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ### INÍCIO: Estados para o modal "Esqueceu a Senha" simplificado ###
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState("");
  
  const [resetStep, setResetStep] = useState('enterEmail'); // 'enterEmail', 'enterPassword', 'success'
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // ### FIM: Estados do Modal ###

  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      const { email: savedEmail, senha: savedSenha } = JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setSenha(savedSenha);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !senha) {
      setIsLoading(false);
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3334/loginfarm',  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farm_email: email,
          farm_senha: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao tentar fazer login.');
      }

      if (data.sucesso) {
        localStorage.setItem("userData", JSON.stringify(data.dados));
        localStorage.setItem("authToken", data.token);

        if (rememberMe) {
          localStorage.setItem("rememberedCredentials", JSON.stringify({ email, senha }));
        } else {
          localStorage.removeItem("rememberedCredentials");
        }

        const nomeFarmacia = data.dados.farm_nome || 'Farmácia';
        alert(`Login bem-sucedido! Bem-vinda, ${nomeFarmacia}.`);

        router.push("/farmacias/favoritos");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ### INÍCIO: Funções do Modal "Esqueceu a Senha" Simplificado ###
  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setTimeout(() => {
      setResetEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setResetError("");
      setResetStep("enterEmail");
    }, 300);
  };

  // ETAPA 1: Verificar e-mail no banco de dados
  const handleVerifyEmailSubmit = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError("");
    try {
      // Endpoint para verificar se o e-mail existe
      const response = await fetch('http://localhost:3334/farmacias/verificar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farm_email: resetEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "E-mail não encontrado.");
      
      // Se o e-mail for encontrado, avança para a etapa de redefinir a senha
      setResetStep('enterPassword');
    } catch (error) {
      setResetError(error.message);
    } finally {
      setIsResetting(false);
    }
  };

  // ETAPA 2: Redefinir a senha
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
        setResetError("A senha deve ter no mínimo 6 caracteres.");
        return;
    }
    setIsResetting(true);
    setResetError("");
    try {
      // Endpoint para redefinir a senha usando o e-mail como identificador
      const response = await fetch('http://localhost:3334/farmacias/redefinir-senha-por-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_email: resetEmail,
          nova_senha: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "Não foi possível alterar a senha.");
      
      // Avança para a etapa final de sucesso
      setResetStep('success');
    } catch (error) {
      setResetError(error.message);
    } finally {
      setIsResetting(false);
    }
  };
  // ### FIM: Funções do Modal ###

  const renderResetModalContent = () => {
    switch (resetStep) {
      case 'enterEmail':
        return (
          <form onSubmit={handleVerifyEmailSubmit}>
            <p className={styles.modalText}>
              Para começar, digite o e-mail associado à sua conta para verificarmos sua identidade.
            </p>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" className={styles.input} value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="seu-email@exemplo.com" required disabled={isResetting} />
            </div>
            {resetError && <p className={styles.errorMessage}>{resetError}</p>}
            <button type="submit" className={styles.botao} disabled={isResetting}>
              {isResetting ? "Verificando..." : "Verificar E-mail"}
            </button>
          </form>
        );
      case 'enterPassword':
        return (
          <form onSubmit={handleResetPasswordSubmit}>
            <p className={styles.modalText}>E-mail verificado! Agora, defina sua nova senha.</p>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nova Senha</label>
              <input type="password" className={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" required disabled={isResetting} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirmar Nova Senha</label>
              <input type="password" className={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" required disabled={isResetting} />
            </div>
            {resetError && <p className={styles.errorMessage}>{resetError}</p>}
            <button type="submit" className={styles.botao} disabled={isResetting}>
              {isResetting ? "Alterando..." : "Alterar Senha"}
            </button>
          </form>
        );
      case 'success':
        return (
          <div className={styles.successMessage}>
            <h3>Senha Alterada!</h3>
            <p>Sua senha foi redefinida com sucesso. Agora você já pode fazer login com a nova senha.</p>
            <button onClick={closeForgotPasswordModal} className={styles.botao}>
              Voltar para o Login
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoText}>PharmaX</span>
          </div>
          <h1 className={styles.titulo}>Bem-vindo de volta</h1>
          <p className={styles.subtitulo}>
            Faça login em sua conta para continuar
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Campos de Login (E-mail e Senha) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu e-mail" required disabled={isLoading} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordContainer}>
              <input type={showPassword ? "text" : "password"} className={styles.input} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" required disabled={isLoading} />
              <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={isLoading} />
              <span>Lembrar-me</span>
            </label>
            <button type="button" className={styles.forgotPasswordBtn} onClick={() => setShowForgotPassword(true)} disabled={isLoading}>
              Esqueceu a senha?
            </button>
          </div>
          <button type="submit" className={styles.botao} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
          <p className={styles.linkCadastro}>
            Não tem uma conta?{" "}
            <span onClick={() => !isLoading && router.push("/farmacias/cadastro")} className={styles.link}>
              Cadastre-se
            </span>
          </p>
        </form>
      </div>

      {/* ### INÍCIO: JSX do Modal "Esqueceu a Senha" ### */}
      {showForgotPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Redefinir Senha</h2>
              <button onClick={closeForgotPasswordModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalContent}>
              {renderResetModalContent()}
            </div>
          </div>
        </div>
      )}
      {/* ### FIM: JSX do Modal ### */}
    </div>
  );
}