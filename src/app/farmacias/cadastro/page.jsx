"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./farmacia.module.css";

export default function CadastroFarmacia() {
  const router = useRouter();

  const [farmacia, setFarmacia] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    senha: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmacia({ ...farmacia, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFarmacia({ ...farmacia, logo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Salvando no localStorage
    const dadosFarmacia = { ...farmacia, logo: preview };
    localStorage.setItem("farmacia", JSON.stringify(dadosFarmacia));

    alert("Farmácia cadastrada com sucesso!");

    // Redireciona para o perfil
    router.push("/produtos/medicamentos");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Cadastro de Farmácia</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome:</label>
          <input
            className={styles.input}
            type="text"
            name="nome"
            value={farmacia.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>CNPJ:</label>
          <input
            className={styles.input}
            type="text"
            name="cnpj"
            value={farmacia.cnpj}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Endereço:</label>
          <input
            className={styles.input}
            type="text"
            name="endereco"
            value={farmacia.endereco}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Telefone:</label>
          <input
            className={styles.input}
            type="tel"
            name="telefone"
            value={farmacia.telefone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>E-mail:</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={farmacia.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Senha:</label>
          <input
            className={styles.input}
            type="password"
            name="senha"
            value={farmacia.senha}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Logo:</label>
          <input
            className={styles.input}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <img src={preview} alt="Pré-visualização" className={styles.logoPreview} />
          )}
        </div>

        <button type="submit" className={styles.botao}>
          Salvar Farmácia
        </button>
      </form>
    </div>
  );
}
