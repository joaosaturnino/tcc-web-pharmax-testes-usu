"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./farmacia.module.css";

export default function CadastroFarmacia() {
  const router = useRouter();
  const fileInputRef = useRef(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmacia({ ...farmacia, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFarmacia({ ...farmacia, logo: file });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Por favor, selecione apenas arquivos de imagem.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular um delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvando no localStorage
      const dadosFarmacia = { 
        ...farmacia, 
        // Não salvar a preview no localStorage (é uma string muito grande)
        logo: farmacia.logo ? farmacia.logo.name : null 
      };
      localStorage.setItem("farmacia", JSON.stringify(dadosFarmacia));

      // Redireciona para o perfil
      router.push("/produtos/medicamentos");
    } catch (error) {
      console.error("Erro ao cadastrar farmácia:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💊</span>
          <span className={styles.logoText}>PharmaSystem</span>
        </div>
        <h1 className={styles.titulo}>Cadastro de Farmácia</h1>
        <p className={styles.subtitulo}>Preencha os dados abaixo para criar sua conta</p>
      </div>
      
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome da Farmácia *</label>
              <input
                className={styles.input}
                type="text"
                name="nome"
                value={farmacia.nome}
                onChange={handleChange}
                placeholder="Digite o nome da farmácia"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>CNPJ *</label>
              <input
                className={styles.input}
                type="text"
                name="cnpj"
                value={farmacia.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Endereço Completo *</label>
              <input
                className={styles.input}
                type="text"
                name="endereco"
                value={farmacia.endereco}
                onChange={handleChange}
                placeholder="Rua, número, bairro, cidade"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Telefone</label>
              <input
                className={styles.input}
                type="tel"
                name="telefone"
                value={farmacia.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail *</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={farmacia.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Senha *</label>
              <input
                className={styles.input}
                type="password"
                name="senha"
                value={farmacia.senha}
                onChange={handleChange}
                placeholder="Crie uma senha segura"
                required
              />
              <div className={styles.passwordStrength}>
                <div className={`${styles.strengthBar} ${farmacia.senha.length > 0 ? styles.weak : ''} ${farmacia.senha.length > 5 ? styles.medium : ''} ${farmacia.senha.length > 8 ? styles.strong : ''}`}></div>
                <span className={styles.strengthText}>
                  {farmacia.senha.length === 0 ? 'Força da senha' : 
                   farmacia.senha.length < 6 ? 'Fraca' : 
                   farmacia.senha.length < 9 ? 'Média' : 'Forte'}
                </span>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Logo da Farmácia</label>
              
              <div 
                className={`${styles.fileUploadContainer} ${isDragging ? styles.dragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                
                {preview ? (
                  <div className={styles.previewContainer}>
                    <img src={preview} alt="Pré-visualização" className={styles.logoPreview} />
                    <button 
                      type="button" 
                      className={styles.removeImageBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setFarmacia({...farmacia, logo: null});
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadArea}>
                    <span className={styles.uploadIcon}>📁</span>
                    <div className={styles.uploadText}>
                      <p>Clique para selecionar ou arraste uma imagem</p>
                      <span>Formatos: JPG, PNG, SVG (Máx. 5MB)</span>
                    </div>
                  </div>
                )}
              </div>
              
              {farmacia.logo && (
                <div className={styles.fileInfo}>
                  <span>Arquivo selecionado: {farmacia.logo.name}</span>
                  <span>Tamanho: {(farmacia.logo.size / 1024).toFixed(2)} KB</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => router.back()}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Cadastrando...
                </>
              ) : (
                "Cadastrar Farmácia"
              )}
            </button>
          </div>
        </form>
        
        <div className={styles.loginRedirect}>
          <p>Já possui uma conta? <a href="/login" className={styles.loginLink}>Faça login</a></p>
        </div>
      </div>
    </div>
  );
}