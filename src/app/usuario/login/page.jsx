"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && senha) {
      localStorage.setItem(
        "farmacia",
        JSON.stringify({ email, senha, nome: "Minha Farmácia" })
      );
      alert("Login realizado com sucesso!");
      router.push("/usuario/perfil");
    } else {
      alert("Preencha todos os campos!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Login</h1>
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
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Senha</label>
          <input
            type="password"
            className={styles.input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button type="submit" className={styles.botao}>
          Entrar
        </button>

        <p className={styles.linkCadastro}>
          Não tem conta?{" "}
          <span
            onClick={() => router.push("/farmacias/cadastro")}
            className={styles.link}
          >
            Cadastre-se
          </span>
        </p>

        <button
          type="button"
          className={`${styles.botao} ${styles.botaoSecundario}`}
          onClick={() => router.push("/")}
        >
          Não sou farmácia
        </button>
      </form>
    </div>
  );
}
