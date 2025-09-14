"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./funcionario.module.css";

// Ícones para validação
import { MdCheckCircle, MdError } from "react-icons/md";

export default function CadastroFuncionarioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
    nivelAcesso: "Funcionário",
  });

  // Estados para validação
  const valDefault = styles.formControl;
  const valSucesso = `${styles.formControl} ${styles.success}`;
  const valErro = `${styles.formControl} ${styles.error}`;

  const [valida, setValida] = useState({
    nome: {
      validado: valDefault,
      mensagem: []
    },
    email: {
      validado: valDefault,
      mensagem: []
    },
    telefone: {
      validado: valDefault,
      mensagem: []
    },
    cpf: {
      validado: valDefault,
      mensagem: []
    },
    dataNascimento: {
      validado: valDefault,
      mensagem: []
    },
    endereco: {
      validado: valDefault,
      mensagem: []
    },
    usuario: {
      validado: valDefault,
      mensagem: []
    },
    senha: {
      validado: valDefault,
      mensagem: []
    },
    confirmarSenha: {
      validado: valDefault,
      mensagem: []
    },
    nivelAcesso: {
      validado: valDefault,
      mensagem: []
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Funções de validação
  function validaNome() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.nome === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome do funcionário é obrigatório');
    } else if (form.nome.length < 3) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome deve ter pelo menos 3 caracteres');
    }

    setValida(prev => ({
      ...prev,
      nome: objTemp
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

    if (form.email === "") {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O e-mail é obrigatório');
    } else if (!checkEmail(form.email)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um e-mail válido');
    }

    setValida(prev => ({
      ...prev,
      email: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaTelefone() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    // Remove caracteres não numéricos
    const telefone = form.telefone.replace(/\D/g, '');
    
    if (form.telefone === '') {
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

  function validaCPF() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    // Remove caracteres não numéricos
    const cpf = form.cpf.replace(/\D/g, '');
    
    if (cpf === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CPF é obrigatório');
    } else if (cpf.length !== 11) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O CPF deve ter 11 dígitos');
    } else if (/^(\d)\1{10}$/.test(cpf)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('CPF inválido');
    }

    setValida(prev => ({
      ...prev,
      cpf: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaDataNascimento() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.dataNascimento === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A data de nascimento é obrigatória');
    } else {
      const dataNascimento = new Date(form.dataNascimento);
      const hoje = new Date();
      const idade = hoje.getFullYear() - dataNascimento.getFullYear();
      
      if (idade < 18) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('O funcionário deve ter pelo menos 18 anos');
      } else if (idade > 100) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('Data de nascimento inválida');
      }
    }

    setValida(prev => ({
      ...prev,
      dataNascimento: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaEndereco() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.endereco === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O endereço é obrigatório');
    } else if (form.endereco.length < 10) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um endereço completo');
    }

    setValida(prev => ({
      ...prev,
      endereco: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaUsuario() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.usuario === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome de usuário é obrigatório');
    } else if (form.usuario.length < 3) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O usuário deve ter pelo menos 3 caracteres');
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.usuario)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O usuário deve conter apenas letras, números e underscore');
    }

    setValida(prev => ({
      ...prev,
      usuario: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaSenha() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.senha === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A senha é obrigatória');
    } else if (form.senha.length < 6) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A senha deve ter pelo menos 6 caracteres');
    }

    setValida(prev => ({
      ...prev,
      senha: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaConfirmarSenha() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.confirmarSenha === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A confirmação de senha é obrigatória');
    } else if (form.confirmarSenha !== form.senha) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('As senhas não coincidem');
    }

    setValida(prev => ({
      ...prev,
      confirmarSenha: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  function validaNivelAcesso() {
    let objTemp = {
      validado: valSucesso,
      mensagem: []
    };

    if (form.nivelAcesso === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Selecione o nível de acesso');
    }

    setValida(prev => ({
      ...prev,
      nivelAcesso: objTemp
    }));

    return objTemp.mensagem.length === 0 ? 1 : 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let itensValidados = 0;
    itensValidados += validaNome();
    itensValidados += validaEmail();
    itensValidados += validaTelefone();
    itensValidados += validaCPF();
    itensValidados += validaDataNascimento();
    itensValidados += validaEndereco();
    itensValidados += validaUsuario();
    itensValidados += validaSenha();
    itensValidados += validaConfirmarSenha();
    itensValidados += validaNivelAcesso();

    if (itensValidados !== 10) {
      return; // Não prossegue se houver erros de validação
    }

    setLoading(true);
    
    // Simulando processamento
    setTimeout(() => {
      console.log("Dados enviados:", form);
      alert("Funcionário cadastrado com sucesso!");
      setLoading(false);
      
      // Redireciona para a página de listagem de funcionários após o cadastro
      router.push("/farmacias/cadastro/funcionario/lista");
    }, 1500);
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className={styles.title}>Cadastro de Funcionário</h1>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Sidebar Não Fixa */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PharmaX</span>
            </div>
            <button
              className={styles.sidebarClose}
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navLabel}>Principal</p>
              <a href="/farmacias/favoritos" className={styles.navLink}>
                <span className={styles.navText}>Favoritos</span>
              </a>
              <a href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                <span className={styles.navText}>Medicamentos</span>
              </a>
            </div>

            <div className={styles.navSection}>
              <p className={styles.navLabel}>Gestão</p>
              <a
                href="/farmacias/cadastro/funcionario/lista"
                className={`${styles.navLink} ${styles.active}`}
              >
                <span className={styles.navText}>Funcionários</span>
              </a>
              <a href="/farmacias/laboratorio/lista" className={styles.navLink}>
                <span className={styles.navText}>Laboratórios</span>
              </a>
            </div>

          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Novo Funcionário</h2>
              <p>Preencha os dados do novo funcionário</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Informações Pessoais */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações Pessoais
                  </h3>

                  <div className={valida.nome.validado}>
                    <label className={styles.inputLabel}>Nome Completo *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome completo"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.nome.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.email.validado}>
                    <label className={styles.inputLabel}>E-mail *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="exemplo@pharmax.com"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.email.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.telefone.validado}>
                    <label className={styles.inputLabel}>Telefone *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="tel"
                        name="telefone"
                        value={form.telefone}
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

                  <div className={valida.cpf.validado}>
                    <label className={styles.inputLabel}>CPF *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="cpf"
                        value={form.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.cpf.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.dataNascimento.validado}>
                    <label className={styles.inputLabel}>Data de Nascimento *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="date"
                        name="dataNascimento"
                        value={form.dataNascimento}
                        onChange={handleChange}
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.dataNascimento.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.endereco.validado}>
                    <label className={styles.inputLabel}>Endereço Completo *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="endereco"
                        value={form.endereco}
                        onChange={handleChange}
                        placeholder="Rua, número, bairro, cidade - Estado"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.endereco.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                </div>

                {/* Informações de Acesso */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    Informações de Acesso
                  </h3>

                  <div className={valida.usuario.validado}>
                    <label className={styles.inputLabel}>Nome de Usuário *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="text"
                        name="usuario"
                        value={form.usuario}
                        onChange={handleChange}
                        placeholder="Digite o nome de usuário"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.usuario.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.senha.validado}>
                    <label className={styles.inputLabel}>Senha *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="password"
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.senha.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.confirmarSenha.validado}>
                    <label className={styles.inputLabel}>Confirmar Senha *</label>
                    <div className={styles.divInput}>
                      <input
                        className={styles.modernInput}
                        type="password"
                        name="confirmarSenha"
                        value={form.confirmarSenha}
                        onChange={handleChange}
                        placeholder="Digite a senha novamente"
                        required
                      />
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.confirmarSenha.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>

                  <div className={valida.nivelAcesso.validado}>
                    <label className={styles.inputLabel}>Nível de Acesso *</label>
                    <div className={styles.divInput}>
                      <select
                        className={styles.modernInput}
                        name="nivelAcesso"
                        value={form.nivelAcesso}
                        onChange={handleChange}
                        required
                      >
                        <option value="Funcionário">Funcionário</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                      <MdCheckCircle className={styles.sucesso} />
                      <MdError className={styles.erro} />
                    </div>
                    {valida.nivelAcesso.mensagem.map(mens => 
                      <small key={mens} className={styles.small}>{mens}</small>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => router.push("/farmacias/cadastro/funcionario/lista")}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.loadingSpinnerSmall}></span>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      Cadastrar Funcionário
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}