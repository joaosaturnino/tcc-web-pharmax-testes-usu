
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./farmacia.module.css";

// Ícones para validação
import { MdCheckCircle, MdError } from "react-icons/md";

export default function CadastroFarmacia() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Lista de cidades (exemplo)
  const cidades = [
    "São Paulo",
    "Rio de Janeiro",
    "Belo Horizonte",
    "Brasília",
    "Salvador",
    "Fortaleza",
    "Recife",
    "Porto Alegre",
    "Curitiba",
    "Goiânia",
    "Manaus",
    "Belém",
    "Florianópolis",
    "Vitória",
    "Natal",
    "João Pessoa",
    "Maceió",
    "Campo Grande",
    "Cuiabá",
    "Teresina"
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
    nome: {
      validado: valDefault,
      mensagem: []
    },
    cnpj: {
      validado: valDefault,
      mensagem: []
    },
    endereco: {
      validado: valDefault,
      mensagem: []
    },
    cidade: {
      validado: valDefault,
      mensagem: []
    },
    telefone: {
      validado: valDefault,
      mensagem: []
    },
    email: {
      validado: valDefault,
      mensagem: []
    },
    senha: {
      validado: valDefault,
      mensagem: []
    },
    logo: {
      validado: valDefault,
      mensagem: []
    }
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
      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValida(prev => ({
          ...prev,
          logo: {
            validado: valErro,
            mensagem: ["O arquivo deve ter no máximo 5MB."]
          }
        }));
        return;
      }
      
      setFarmacia({ ...farmacia, logo: file });
      setValida(prev => ({
        ...prev,
        logo: {
          validado: valSucesso,
          mensagem: []
        }
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setValida(prev => ({
        ...prev,
        logo: {
          validado: valErro,
          mensagem: ["Por favor, selecione apenas arquivos de imagem."]
        }
      }));
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

  // Funções de validação
  function validaNome() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (farmacia.nome === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome da farmácia é obrigatório');
    } else if (farmacia.nome.length < 3) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome deve ter pelo menos 3 caracteres');
    }

    setValida(prev => ({
      ...prev,
      nome: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaCNPJ() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    // Remove caracteres não numéricos
    const cnpj = farmacia.cnpj.replace(/\D/g, '');
    
    if (cnpj === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CNPJ é obrigatório');
    } else if (cnpj.length !== 14) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CNPJ deve ter 14 dígitos');
    } else if (!validaDigitosCNPJ(cnpj)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('CNPJ inválido');
    }

    setValida(prev => ({
      ...prev,
      cnpj: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaDigitosCNPJ(cnpj) {
    // Valida os dígitos verificadores do CNPJ
    if (/^(\d)\1{13}$/.test(cnpj)) return false; // CNPJ com todos os dígitos iguais

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  function validaEndereco() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (farmacia.endereco === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O endereço é obrigatório');
    } else if (farmacia.endereco.length < 10) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um endereço completo');
    }

    setValida(prev => ({
      ...prev,
      endereco: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaCidade() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (farmacia.cidade === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A cidade é obrigatória');
    }

    setValida(prev => ({
      ...prev,
      cidade: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaTelefone() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    // Remove caracteres não numéricos
    const telefone = farmacia.telefone.replace(/\D/g, '');
    
    if (telefone === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O telefone é obrigatório');
    } else if (telefone.length < 10 || telefone.length > 11) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Telefone inválido');
    }

    setValida(prev => ({
      ...prev,
      telefone: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function checkEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  function validaEmail() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (farmacia.email === "") {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O e-mail é obrigatório');
    } else if (!checkEmail(farmacia.email)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um e-mail válido');
    }

    setValida(prev => ({
      ...prev,
      email: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaSenha() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (farmacia.senha === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A senha é obrigatória');
    } else if (farmacia.senha.length < 6) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A senha deve ter pelo menos 6 caracteres');
    }

    setValida(prev => ({
      ...prev,
      senha: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaLogo() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    // A logo é opcional, então não há validação obrigatória
    // Mas se houver um arquivo, validamos seu tipo e tamanho
    if (farmacia.logo) {
      if (!farmacia.logo.type.startsWith("image/")) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('Por favor, selecione apenas arquivos de imagem');
      } else if (farmacia.logo.size > 5 * 1024 * 1024) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('O arquivo deve ter no máximo 5MB');
      }
    }

    setValida(prev => ({
      ...prev,
      logo: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let itensValidados = 0;
    itensValidados += validaNome();
    itensValidados += validaCNPJ();
    itensValidados += validaEndereco();
    itensValidados += validaCidade();
    itensValidados += validaTelefone();
    itensValidados += validaEmail();
    itensValidados += validaSenha();
    itensValidados += validaLogo();

    if (itensValidados !== 8) {
      return; // Não prossegue se houver erros de validação
    }

    setIsSubmitting(true);

    try {
      // Simular um delay para demonstração
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // NUNCA salvar senha em texto claro - usar hash em aplicação real
      const dadosFarmacia = {
        ...farmacia,
        senha: "***" // Em aplicação real, usar bcrypt ou similar
      };
      
      localStorage.setItem("farmacia", JSON.stringify(dadosFarmacia));
      localStorage.setItem("usuarioLogado", "true");

      // Redireciona para página apropriada
      router.push("/farmacias/favoritos");
    } catch (error) {
      console.error("Erro ao cadastrar farmácia:", error);
      alert("Erro ao cadastrar. Tente novamente.");
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
      <div className={styles.backgroundPattern}></div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoText}>PharmaX</span>
          </div>
          <h1 className={styles.titulo}>Cadastro de Farmácia</h1>
          <p className={styles.subtitulo}>
            Preencha os dados abaixo para criar sua conta
          </p>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={valida.nome.validado}>
                <label className={styles.label}>Nome da Farmácia</label>
                <div className={styles.divInput}>
                  <input
                    className={styles.input}
                    type="text"
                    name="nome"
                    value={farmacia.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome da farmácia"
                    required
                  />
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.nome.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
              </div>

              <div className={valida.cnpj.validado}>
                <label className={styles.label}>CNPJ</label>
                <div className={styles.divInput}>
                  <input
                    className={styles.input}
                    type="text"
                    name="cnpj"
                    value={farmacia.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.cnpj.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
              </div>

              <div className={valida.endereco.validado}>
                <label className={styles.label}>Endereço Completo</label>
                <div className={styles.divInput}>
                  <input
                    className={styles.input}
                    type="text"
                    name="endereco"
                    value={farmacia.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro"
                    required
                  />
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.endereco.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
              </div>

              <div className={valida.cidade.validado}>
                <label className={styles.label}>Cidade</label>
                <div className={styles.divInput}>
                  <select
                    className={styles.select}
                    name="cidade"
                    value={farmacia.cidade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma cidade</option>
                    {cidades.map((cidade) => (
                      <option key={cidade} value={cidade}>
                        {cidade}
                      </option>
                    ))}
                  </select>
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.cidade.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
              </div>

              <div className={valida.telefone.validado}>
                <label className={styles.label}>Telefone</label>
                <div className={styles.divInput}>
                  <input
                    className={styles.input}
                    type="tel"
                    name="telefone"
                    value={farmacia.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.telefone.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
              </div>

              <div className={valida.email.validado}>
                <label className={styles.label}>E-mail</label>
                <div className={styles.divInput}>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={farmacia.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.email.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
              </div>

              <div className={valida.senha.validado}>
                <label className={styles.label}>Senha</label>
                <div className={styles.divInput}>
                  <input
                    className={styles.input}
                    type="password"
                    name="senha"
                    value={farmacia.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                    required
                  />
                  <MdCheckCircle className={styles.sucesso} />
                  <MdError className={styles.erro} />
                </div>
                {valida.senha.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}
                
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBars}>
                    <div
                      className={`${styles.strengthBar} ${
                        farmacia.senha.length > 0 ? styles.weak : ""
                      } ${farmacia.senha.length > 5 ? styles.medium : ""} ${
                        farmacia.senha.length > 8 ? styles.strong : ""
                      }`}
                    ></div>
                    <div
                      className={`${styles.strengthBar} ${
                        farmacia.senha.length > 3 ? styles.weak : ""
                      } ${farmacia.senha.length > 6 ? styles.medium : ""} ${
                        farmacia.senha.length > 9 ? styles.strong : ""
                      }`}
                    ></div>
                    <div
                      className={`${styles.strengthBar} ${
                        farmacia.senha.length > 5 ? styles.weak : ""
                      } ${farmacia.senha.length > 7 ? styles.medium : ""} ${
                        farmacia.senha.length > 10 ? styles.strong : ""
                      }`}
                    ></div>
                  </div>
                  <span className={styles.strengthText}>
                    {farmacia.senha.length === 0
                      ? "Força da senha"
                      : farmacia.senha.length < 6
                      ? "Muito fraca"
                      : farmacia.senha.length < 8
                      ? "Fraca"
                      : farmacia.senha.length < 10
                      ? "Média"
                      : "Forte"}
                  </span>
                </div>
              </div>

              <div className={valida.logo.validado}>
                <label className={`${styles.label} ${styles.optional}`}>Logo da Farmácia (opcional)</label>

                <div
                  className={`${styles.fileUploadContainer} ${
                    isDragging ? styles.dragging : ""
                  } ${preview ? styles.hasPreview : ""}`}
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
                      <img
                        src={preview}
                        alt="Pré-visualização"
                        className={styles.logoPreview}
                      />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setFarmacia({ ...farmacia, logo: null });
                          setValida(prev => ({
                            ...prev,
                            logo: {
                              validado: valDefault,
                              mensagem: []
                            }
                          }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadArea}>
                      <div className={styles.uploadIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div className={styles.uploadText}>
                        <p>Clique para selecionar ou arraste uma imagem</p>
                        <span>Formatos: JPG, PNG, SVG (Máx. 5MB)</span>
                      </div>
                    </div>
                  )}
                </div>
                {valida.logo.mensagem.map(mens => 
                  <small key={mens} className={styles.small}>{mens}</small>
                )}

                {farmacia.logo && (
                  <div className={styles.fileInfo}>
                    <span>Arquivo selecionado: {farmacia.logo.name}</span>
                    <span>
                      Tamanho: {(farmacia.logo.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.back()}
                disabled={isSubmitting}
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
                  <>
                    <span className={styles.buttonIcon}>✓</span>
                    Cadastrar Farmácia
                  </>
                )}
              </button>
            </div>
          </form>

          <div className={styles.loginRedirect}>
            <p>
              Já possui uma conta?{" "}
              <a href="/login" className={styles.loginLink}>
                Faça login aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
