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

  // Estados para o modal de recuperação de senha
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);


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
      const response = await fetch('http://localhost:3334/loginfarm', {
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
        // Padronizando as chaves para "userData" e "authToken"
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

  // Lógica do Modal de Recuperação de Senha
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // ... (lógica do modal)
  };

  const verifyRecoveryCode = async (e) => {
    e.preventDefault();
    // ... (lógica do modal)
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    // ... (lógica do modal)
  };

  const closeRecoveryModal = () => {
    setShowForgotPassword(false);
    // ... (lógica do modal)
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
          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Lembrar-me</span>
            </label>
            <button
              type="button"
              className={styles.forgotPasswordBtn}
              onClick={() => setShowForgotPassword(true)}
              disabled={isLoading}
            >
              Esqueceu a senha?
            </button>
          </div>

          <button type="submit" className={styles.botao} disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <p className={styles.linkCadastro}>
            Não tem uma conta?{" "}
            <span
              onClick={() => !isLoading && router.push("/farmacias/cadastro")}
              className={styles.link}
            >
              Cadastre-se
            </span>
          </p>
        </form>
      </div>

      {/* O JSX do modal de recuperação de senha continua aqui... */}
      
    </div>
  );
}