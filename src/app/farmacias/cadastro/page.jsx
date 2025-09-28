"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./farmacia.module.css";

// Ícones para validação
import { MdCheckCircle, MdError } from "react-icons/md";

// Importação da instância do Axios configurada no arquivo /src/services/api.js
// Certifique-se de que o caminho para o arquivo api.js está correto
import api from "../../services/api";

export default function CadastroFarmacia() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Lista de cidades com IDs correspondentes ao banco de dados
  // É crucial que estes IDs estejam corretos
  const cidades = [
    { id: 1, nome: "São Paulo" },
    { id: 2, nome: "Rio de Janeiro" },
    { id: 3, nome: "Belo Horizonte" },
    { id: 4, nome: "Brasília" },
    { id: 5, nome: "Salvador" },
    { id: 6, nome: "Fortaleza" },
    { id: 7, nome: "Recife" },
    { id: 8, nome: "Porto Alegre" },
    { id: 9, nome: "Curitiba" },
    { id: 10, nome: "Goiânia" },
    { id: 11, nome: "Manaus" },
    { id: 12, nome: "Belém" },
    { id: 13, nome: "Florianópolis" },
    { id: 14, nome: "Vitória" },
    { id: 15, nome: "Natal" },
    { id: 16, nome: "João Pessoa" },
    { id: 17, nome: "Maceió" },
    { id: 18, nome: "Campo Grande" },
    { id: 19, nome: "Cuiabá" },
    { id: 20, nome: "Teresina" }
  ];

  const [farmacia, setFarmacia] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    telefone: "",
    email: "",
    senha: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Estados para validação
  const valDefault = styles.formControl;
  const valSucesso = `${styles.formControl} ${styles.success}`;
  const valErro = `${styles.formControl} ${styles.error}`;

  const [valida, setValida] = useState({
    nome: { validado: valDefault, mensagem: [] },
    cnpj: { validado: valDefault, mensagem: [] },
    endereco: { validado: valDefault, mensagem: [] },
    cidade: { validado: valDefault, mensagem: [] },
    telefone: { validado: valDefault, mensagem: [] },
    email: { validado: valDefault, mensagem: [] },
    senha: { validado: valDefault, mensagem: [] },
    logo: { validado: valDefault, mensagem: [] },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmacia({ ...farmacia, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setValida(prev => ({ ...prev, logo: { validado: valErro, mensagem: ["O arquivo deve ter no máximo 5MB."] } }));
        return;
      }
      setFarmacia({ ...farmacia, logo: file });
      setValida(prev => ({ ...prev, logo: { validado: valSucesso, mensagem: [] } }));
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (file) {
      setValida(prev => ({ ...prev, logo: { validado: valErro, mensagem: ["Por favor, selecione apenas arquivos de imagem."] } }));
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  };

  // Funções de validação
  function validaNome() { return farmacia.nome.length >= 3 ? 1 : 0; }
  function validaCNPJ() { return farmacia.cnpj.replace(/\D/g, '').length === 14 ? 1 : 0; }
  function validaEndereco() { return farmacia.endereco.length >= 10 ? 1 : 0; }
  function validaCidade() { return farmacia.cidade !== '' ? 1 : 0; }
  function validaTelefone() { const tel = farmacia.telefone.replace(/\D/g, ''); return tel.length >= 10 && tel.length <= 11 ? 1 : 0; }
  function validaEmail() { const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; return emailRegex.test(farmacia.email) ? 1 : 0; }
  function validaSenha() { return farmacia.senha.length >= 6 ? 1 : 0; }
  function validaLogo() { return 1; } // Logo é opcional

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validação dos campos antes do envio
    if (validaNome() + validaCNPJ() + validaEndereco() + validaCidade() + validaTelefone() + validaEmail() + validaSenha() + validaLogo() !== 8) {
      alert("Por favor, corrija os erros no formulário antes de continuar.");
      return;
    }

    setIsSubmitting(true);

    // 2. Converte o nome da cidade para o ID correspondente
    const cidadeSelecionada = cidades.find(c => c.nome === farmacia.cidade);
    if (!cidadeSelecionada) {
        alert("Cidade inválida selecionada!");
        setIsSubmitting(false);
        return;
    }

    // 3. Cria um objeto FormData para enviar os dados, incluindo o arquivo
    const formData = new FormData();

    // Adiciona os campos ao FormData com os nomes esperados pela API
    formData.append('farm_nome', farmacia.nome);
    formData.append('farm_cnpj', farmacia.cnpj.replace(/\D/g, ''));
    formData.append('farm_endereco', farmacia.endereco);
    formData.append('farm_telefone', farmacia.telefone.replace(/\D/g, ''));
    formData.append('farm_email', farmacia.email);
    formData.append('farm_senha', farmacia.senha);
    formData.append('farm_cidade_id', cidadeSelecionada.id);
    
    // Adiciona o arquivo de logo apenas se ele tiver sido selecionado
    if (farmacia.logo) {
      formData.append('farm_logo', farmacia.logo);
    }
    
    // 4. Bloco try/catch para fazer a chamada à API e tratar a resposta
    try {
      const response = await api.post('/farmacias', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.sucesso) {
        alert("Farmácia cadastrada com sucesso!");
        router.push("/farmacias/favoritos"); // Redireciona em caso de sucesso
      } else {
        alert(`Erro ao cadastrar: ${response.data.mensagem}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      if (error.response) {
        // Exibe o erro específico retornado pela API
        alert(`Erro do servidor: ${error.response.data.mensagem}`);
      } else {
        // Exibe um erro genérico de falha na conexão
        alert("Não foi possível conectar-se ao servidor. Tente novamente mais tarde.");
      }
    } finally {
      // Garante que o estado de "submitting" seja desativado ao final
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.logo}><span className={styles.logoText}>PharmaX</span></div>
          <h1 className={styles.titulo}>Cadastro de Farmácia</h1>
          <p className={styles.subtitulo}>Preencha os dados abaixo para criar sua conta</p>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={valida.nome.validado}>
                <label className={styles.label}>Nome da Farmácia</label>
                <div className={styles.divInput}>
                  <input className={styles.input} type="text" name="nome" value={farmacia.nome} onChange={handleChange} placeholder="Digite o nome da farmácia" required />
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
              </div>

              <div className={valida.cnpj.validado}>
                <label className={styles.label}>CNPJ</label>
                <div className={styles.divInput}>
                  <input className={styles.input} type="text" name="cnpj" value={farmacia.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required />
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
              </div>

              <div className={valida.endereco.validado}>
                <label className={styles.label}>Endereço Completo</label>
                <div className={styles.divInput}>
                  <input className={styles.input} type="text" name="endereco" value={farmacia.endereco} onChange={handleChange} placeholder="Rua, número, bairro" required />
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
              </div>

              <div className={valida.cidade.validado}>
                <label className={styles.label}>Cidade</label>
                <div className={styles.divInput}>
                  <select className={styles.select} name="cidade" value={farmacia.cidade} onChange={handleChange} required>
                    <option value="">Selecione uma cidade</option>
                    {cidades.map((cidade) => (
                      <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                    ))}
                  </select>
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
              </div>

              <div className={valida.telefone.validado}>
                <label className={styles.label}>Telefone</label>
                <div className={styles.divInput}>
                  <input className={styles.input} type="tel" name="telefone" value={farmacia.telefone} onChange={handleChange} placeholder="(11) 99999-9999" required />
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
              </div>

              <div className={valida.email.validado}>
                <label className={styles.label}>E-mail</label>
                <div className={styles.divInput}>
                  <input className={styles.input} type="email" name="email" value={farmacia.email} onChange={handleChange} placeholder="seu@email.com" required />
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
              </div>

              <div className={valida.senha.validado}>
                <label className={styles.label}>Senha</label>
                <div className={styles.divInput}>
                  <input className={styles.input} type="password" name="senha" value={farmacia.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" minLength="6" required />
                  <MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} />
                </div>
                {/* Opcional: manter o indicador de força da senha */}
              </div>

              <div className={valida.logo.validado}>
                <label className={`${styles.label} ${styles.optional}`}>Logo da Farmácia (opcional)</label>
                <div className={`${styles.fileUploadContainer} ${isDragging ? styles.dragging : ""} ${preview ? styles.hasPreview : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={triggerFileInput}>
                  <input ref={fileInputRef} type="file" id="logo" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                  {preview ? (
                    <div className={styles.previewContainer}>
                      <img src={preview} alt="Pré-visualização" className={styles.logoPreview} />
                      <button type="button" className={styles.removeImageBtn} onClick={(e) => { e.stopPropagation(); setPreview(null); setFarmacia({ ...farmacia, logo: null }); }}>✕</button>
                    </div>
                  ) : (
                    <div className={styles.uploadArea}>
                      <div className={styles.uploadText}><p>Clique para selecionar ou arraste uma imagem</p><span>Formatos: JPG, PNG, SVG (Máx. 5MB)</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={() => router.back()} disabled={isSubmitting}>Cancelar</button>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? (<><span className={styles.spinner}></span>Cadastrando...</>) : (<>✓ Cadastrar Farmácia</>)}
              </button>
            </div>
          </form>

          <div className={styles.loginRedirect}>
            <p>Já possui uma conta? <a href="/login" className={styles.loginLink}>Faça login aqui</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}