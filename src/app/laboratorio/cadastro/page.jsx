"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../cadastro.module.css";

export default function CadastroLaboratorio() {
  const router = useRouter();

  const [laboratorio, setLaboratorio] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaboratorio({ ...laboratorio, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLaboratorio({ ...laboratorio, logo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Salvar no localStorage
    const dados = { ...laboratorio, logo: preview };
    localStorage.setItem("laboratorio", JSON.stringify(dados));

    alert("Laboratório cadastrado com sucesso!");
    router.push("/laboratorio/editar");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Cadastro de Laboratório</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={laboratorio.nome}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="cnpj"
          placeholder="CNPJ"
          value={laboratorio.cnpj}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={laboratorio.endereco}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone"
          value={laboratorio.telefone}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={laboratorio.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.input}
        />
        {preview && (
          <img src={preview} alt="Pré-visualização" className={styles.logoPreview} />
        )}
        <button type="submit" className={styles.botao}>
          Salvar Laboratório
        </button>
      </form>
    </div>
  );
}
