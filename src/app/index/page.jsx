"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";    
import styles from "./page.module.css";

// import LogoEscrita from "../../../../public/temp/LogoEscrita.png"

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: email, 2: código, 3: nova senha
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (email && senha) {
      // Simular um processo de login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem(
        "farmacia",
        JSON.stringify({ email, senha, nome: "Minha Farmácia" })
      );

      setIsLoading(false);
      router.push("/farmacias/favoritos");
    } else {
      setIsLoading(false);
      alert("Preencha todos os campos!");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!recoveryEmail) {
      alert("Por favor, informe seu e-mail.");
      return;
    }

    // Simular envio de e-mail
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Avançar para a etapa de código
    setRecoveryStep(2);
    setIsLoading(false);

    // Em produção, aqui você enviaria o e-mail com o código
    console.log(`Código de recuperação enviado para: ${recoveryEmail}`);
  };

  const verifyRecoveryCode = async (e) => {
    e.preventDefault();

    if (!recoveryCode) {
      alert("Por favor, informe o código recebido.");
      return;
    }

    // Simular verificação do código
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Avançar para a etapa de nova senha
    setRecoveryStep(3);
    setIsLoading(false);
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Simular redefinição de senha
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Em produção, aqui você atualizaria a senha no banco de dados
    console.log(`Senha redefinida para: ${recoveryEmail}`);

    // Fechar o modal e resetar o estado
    setShowForgotPassword(false);
    setRecoveryStep(1);
    setRecoveryEmail("");
    setRecoveryCode("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);

    alert(
      "Senha redefinida com sucesso! Você já pode fazer login com a nova senha."
    );
  };

  const closeRecoveryModal = () => {
    setShowForgotPassword(false);
    setRecoveryStep(1);
    setRecoveryEmail("");
    setRecoveryCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💊</span>
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
            <div className={styles.passwordStrength}>
              <div
                className={`${styles.strengthBar} ${
                  senha.length > 0 ? styles.weak : ""
                } ${senha.length > 5 ? styles.medium : ""} ${
                  senha.length > 8 ? styles.strong : ""
                }`}
              ></div>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" disabled={isLoading} />
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
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
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

      {/* Modal de Recuperação de Senha */}
      {showForgotPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>
                {recoveryStep === 1 && "Recuperar Senha"}
                {recoveryStep === 2 && "Verificar Código"}
                {recoveryStep === 3 && "Nova Senha"}
              </h2>
              <button
                className={styles.modalClose}
                onClick={closeRecoveryModal}
                disabled={isLoading}
              >
                ×
              </button>
            </div>

            <div className={styles.modalContent}>
              {recoveryStep === 1 && (
                <form onSubmit={handleForgotPassword}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>E-mail cadastrado</label>
                    <input
                      type="email"
                      className={styles.input}
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Digite seu e-mail"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className={styles.helpText}>
                    Enviaremos um código de verificação para este e-mail.
                  </p>
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={closeRecoveryModal}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={styles.continueBtn}
                      disabled={isLoading}
                    >
                      {isLoading ? "Enviando..." : "Continuar"}
                    </button>
                  </div>
                </form>
              )}

              {recoveryStep === 2 && (
                <form onSubmit={verifyRecoveryCode}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Código de verificação
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      placeholder="Digite o código recebido"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className={styles.helpText}>
                    Verifique sua caixa de entrada e insira o código de 6
                    dígitos.
                  </p>
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setRecoveryStep(1)}
                      disabled={isLoading}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className={styles.continueBtn}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verificando..." : "Verificar"}
                    </button>
                  </div>
                </form>
              )}

              {recoveryStep === 3 && (
                <form onSubmit={resetPassword}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nova senha</label>
                    <input
                      type="password"
                      className={styles.input}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confirmar nova senha</label>
                    <input
                      type="password"
                      className={styles.input}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setRecoveryStep(2)}
                      disabled={isLoading}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className={styles.continueBtn}
                      disabled={isLoading}
                    >
                      {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}