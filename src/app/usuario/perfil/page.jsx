"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./perfil.module.css";
import { FaBuilding, FaIdCard, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function PerfilFarmacia() {
  const router = useRouter();
  const [farmacia, setFarmacia] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("farmacia");
    if (dados) {
      const farmaciaData = JSON.parse(dados);
      setFarmacia(farmaciaData);
      setFormData(farmaciaData);
      setPreviewLogo(farmaciaData.logo || null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmacia");
    router.push("../../home");
  };

  const handleEdit = () => setEditando(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
      setFormData({ ...formData, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("farmacia", JSON.stringify(formData));
    setFarmacia(formData);
    setEditando(false);
    alert("Dados atualizados com sucesso!");
  };

  if (!farmacia) return <p className={styles.titulo}>Nenhuma farmácia cadastrada.</p>;

  const campos = [
    { label: "Nome", value: formData.nome, name: "nome", icon: <FaBuilding /> },
    { label: "CNPJ", value: formData.cnpj, name: "cnpj", icon: <FaIdCard /> },
    { label: "Endereço", value: formData.endereco, name: "endereco", icon: <FaMapMarkerAlt /> },
    { label: "Telefone", value: formData.telefone, name: "telefone", icon: <FaPhoneAlt /> },
    { label: "Email", value: formData.email, name: "email", icon: <FaEnvelope /> },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>{farmacia.nome}</h1>

      {previewLogo && <img src={previewLogo} alt="Logo" className={styles.logoPreview} />}

      {!editando ? (
        <div className={styles.cardsContainer}>
          {campos.map((campo) => (
            <div className={styles.card} key={campo.label}>
              <div className={styles.cardIcon}>{campo.icon}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>{campo.label}</div>
                <div className={styles.cardValue}>{campo.value}</div>
              </div>
            </div>
          ))}

          <div className={styles.botaoContainer}>
            <button className={styles.botao} onClick={handleEdit}>Editar Dados</button>
            <button className={`${styles.botao} ${styles.botaoCancel}`} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSave}>
          {campos.map((campo) => (
            <div className={styles.formGroup} key={campo.name}>
              <label className={styles.label}>{campo.label}</label>
              <input
                className={styles.input}
                type={campo.name === "email" ? "email" : "text"}
                name={campo.name}
                value={formData[campo.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Logo */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Logo</label>
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {previewLogo && <img src={previewLogo} alt="Pré-visualização" className={styles.logoPreview} />}

          <div className={styles.botaoContainer}>
            <button type="submit" className={styles.botao}>Salvar Alterações</button>
            <button type="button" className={`${styles.botao} ${styles.botaoCancel}`} onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
