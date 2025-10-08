"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // CORREÇÃO: Importado para navegação SPA
import styles from "./funcionario.module.css";
import api from "../../../services/api";

// Ícones para validação
import { MdCheckCircle, MdError } from "react-icons/md";

export default function CadastroFuncionarioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

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
    nivelAcesso: "1", // Padrão para "Funcionário"
  });

  const valDefault = styles.formControl;
  const valSucesso = `${styles.formControl} ${styles.success}`;
  const valErro = `${styles.formControl} ${styles.error}`;

  const [valida, setValida] = useState({
    nome: { validado: valDefault, mensagem: [] },
    email: { validado: valDefault, mensagem: [] },
    telefone: { validado: valDefault, mensagem: [] },
    cpf: { validado: valDefault, mensagem: [] },
    dataNascimento: { validado: valDefault, mensagem: [] },
    endereco: { validado: valDefault, mensagem: [] },
    usuario: { validado: valDefault, mensagem: [] },
    senha: { validado: valDefault, mensagem: [] },
    confirmarSenha: { validado: valDefault, mensagem: [] },
    nivelAcesso: { validado: valDefault, mensagem: [] }
  });

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setFarmaciaInfo(JSON.parse(userDataString));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // --- Funções de validação completas ---
  function validaNome() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.nome === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome do funcionário é obrigatório');
    } else if (form.nome.length < 3) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O nome deve ter pelo menos 3 caracteres');
    }
    setValida(prev => ({ ...prev, nome: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaEmail() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (form.email === "") {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O e-mail é obrigatório');
    } else if (!emailRegex.test(form.email)) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um e-mail válido');
    }
    setValida(prev => ({ ...prev, email: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaTelefone() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    const telefone = form.telefone.replace(/\D/g, '');
    if (form.telefone === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O telefone é obrigatório');
    } else if (telefone.length < 10 || telefone.length > 11) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Telefone inválido');
    }
    setValida(prev => ({ ...prev, telefone: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaCPF() {
    let objTemp = { validado: valSucesso, mensagem: [] };
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
    setValida(prev => ({ ...prev, cpf: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaDataNascimento() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.dataNascimento === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A data de nascimento é obrigatória');
    } else {
      const dataNascimento = new Date(form.dataNascimento);
      const hoje = new Date();
      // Melhora no cálculo da idade
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();
      const m = hoje.getMonth() - dataNascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
      }
      
      if (idade < 18) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('O funcionário deve ter pelo menos 18 anos');
      } else if (idade > 100) {
        objTemp.validado = valErro;
        objTemp.mensagem.push('Data de nascimento inválida');
      }
    }
    setValida(prev => ({ ...prev, dataNascimento: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaEndereco() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.endereco === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('O endereço é obrigatório');
    } else if (form.endereco.length < 10) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira um endereço completo');
    }
    setValida(prev => ({ ...prev, endereco: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaUsuario() {
    let objTemp = { validado: valSucesso, mensagem: [] };
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
    setValida(prev => ({ ...prev, usuario: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaSenha() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.senha === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A senha é obrigatória');
    } else if (form.senha.length < 6) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A senha deve ter pelo menos 6 caracteres');
    }
    setValida(prev => ({ ...prev, senha: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaConfirmarSenha() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.confirmarSenha === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A confirmação de senha é obrigatória');
    } else if (form.confirmarSenha !== form.senha) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('As senhas não coincidem');
    }
    setValida(prev => ({ ...prev, confirmarSenha: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  function validaNivelAcesso() {
    let objTemp = { validado: valSucesso, mensagem: [] };
    if (form.nivelAcesso === '') {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Selecione o nível de acesso');
    }
    setValida(prev => ({ ...prev, nivelAcesso: objTemp }));
    return objTemp.mensagem.length === 0;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CORREÇÃO: Lógica de validação mais robusta e legível
    const isFormValid = 
      validaNome() &&
      validaEmail() &&
      validaTelefone() &&
      validaCPF() &&
      validaDataNascimento() &&
      validaEndereco() &&
      validaUsuario() &&
      validaSenha() &&
      validaConfirmarSenha() &&
      validaNivelAcesso();

    if (!isFormValid) {
      alert("Por favor, corrija os erros no formulário.");
      return;
    }
  
    setLoading(true);
  
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const idDaFarmacia = userData?.farm_id; 
      if (!idDaFarmacia) {
        throw new Error("ID da farmácia não encontrado. Faça o login novamente.");
      }

      const dadosFuncionario = {
        func_nome: form.nome,
        func_email: form.email,
        func_telefone: form.telefone.replace(/\D/g, ''),
        func_cpf: form.cpf.replace(/\D/g, ''),
        func_dtnasc: form.dataNascimento,
        func_endereco: form.endereco,
        farmacia_id: idDaFarmacia,
        func_usuario: form.usuario,
        func_senha: form.senha,
        func_nivel: form.nivelAcesso, // CORREÇÃO: Enviando o nível de acesso
      };
    
      const response = await api.post('/funcionario', dadosFuncionario);
  
      if (response.data.sucesso) {
        alert("Funcionário cadastrado com sucesso!");
        router.push("/farmacias/cadastro/funcionario/lista");
      } else {
        alert('Erro ao cadastrar funcionário: ' + response.data.mensagem);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.mensagem || error.message || "Ocorreu um erro desconhecido.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.menuToggle} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu" // NOVO: Acessibilidade
          >
            ☰
          </button>
          <h1 className={styles.title}>Cadastro de Funcionário</h1>
        </div>
      </header>
      <div className={styles.contentWrapper}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logoContainer}>
                {farmaciaInfo?.farm_logo_url && (
                  <img src={farmaciaInfo.farm_logo_url} alt={`Logo de ${farmaciaInfo.farm_nome}`} className={styles.logoImage} />
                )}
                <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "Pharma-X"}</span>
              </div>
              <button 
                className={styles.sidebarClose} 
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar menu" // NOVO: Acessibilidade
              >×</button>
            </div>
            {/* CORREÇÃO: Trocadas <a> por <Link> para navegação mais rápida */}
            <nav className={styles.nav}>
              <div className={styles.navSection}><p className={styles.navLabel}>Principal</p><Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link><Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Gestão</p><Link href="/farmacias/cadastro/funcionario/lista" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Funcionários</span></Link><Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Relatórios</p><Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link><Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionarios</span></Link><Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratorios</span></Link></div>
              <div className={styles.navSection}><p className={styles.navLabel}>Conta</p><Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link><button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button></div>
            </nav>
          </aside>
          {sidebarOpen && (<div className={styles.overlay} onClick={() => setSidebarOpen(false)} />)}
        <main className={styles.mainContent}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Novo Funcionário</h2>
              <p>Preencha os dados do novo membro da equipe</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
                  <div className={valida.nome.validado}><label className={styles.inputLabel}>Nome Completo</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="nome" value={form.nome} onChange={handleChange} onBlur={validaNome} placeholder="Digite o nome completo" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.nome.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.email.validado}><label className={styles.inputLabel}>E-mail</label><div className={styles.divInput}><input className={styles.modernInput} type="email" name="email" value={form.email} onChange={handleChange} onBlur={validaEmail} placeholder="exemplo@pharmax.com" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.email.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.telefone.validado}><label className={styles.inputLabel}>Telefone</label><div className={styles.divInput}><input className={styles.modernInput} type="tel" name="telefone" value={form.telefone} onChange={handleChange} onBlur={validaTelefone} placeholder="(11) 99999-9999" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.telefone.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.cpf.validado}><label className={styles.inputLabel}>CPF</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="cpf" value={form.cpf} onChange={handleChange} onBlur={validaCPF} placeholder="000.000.000-00" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.cpf.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.dataNascimento.validado}><label className={styles.inputLabel}>Data de Nascimento</label><div className={styles.divInput}><input className={styles.modernInput} type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} onBlur={validaDataNascimento} required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.dataNascimento.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.endereco.validado}><label className={styles.inputLabel}>Endereço Completo</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="endereco" value={form.endereco} onChange={handleChange} onBlur={validaEndereco} placeholder="Rua, número, bairro, cidade - Estado" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.endereco.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                </div>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Informações de Acesso</h3>
                  <div className={valida.usuario.validado}><label className={styles.inputLabel}>Nome de Usuário</label><div className={styles.divInput}><input className={styles.modernInput} type="text" name="usuario" value={form.usuario} onChange={handleChange} onBlur={validaUsuario} placeholder="Digite o nome de usuário" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.usuario.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.senha.validado}><label className={styles.inputLabel}>Senha</label><div className={styles.divInput}><input className={styles.modernInput} type="password" name="senha" value={form.senha} onChange={handleChange} onBlur={validaSenha} placeholder="Mínimo 6 caracteres" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.senha.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.confirmarSenha.validado}><label className={styles.inputLabel}>Confirmar Senha</label><div className={styles.divInput}><input className={styles.modernInput} type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} onBlur={validaConfirmarSenha} placeholder="Digite a senha novamente" required /><MdCheckCircle className={styles.sucesso} /><MdError className={styles.erro} /></div>{valida.confirmarSenha.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                  <div className={valida.nivelAcesso.validado}><label className={styles.inputLabel}>Nível de Acesso</label><div className={styles.divInput}><select className={styles.modernInput} name="nivelAcesso" value={form.nivelAcesso} onChange={handleChange} onBlur={validaNivelAcesso} required><option value="1">Funcionário</option><option value="2">Farmacêutico</option><option value="3">Administrador</option></select></div>{valida.nivelAcesso.mensagem.map(mens => <small key={mens} className={styles.small}>{mens}</small>)}</div>
                </div>
              </div>
              <div className={styles.formActions}><button type="button" className={styles.cancelButton} onClick={() => router.push("/farmacias/cadastro/funcionario/lista")} disabled={loading}>Cancelar</button><button type="submit" className={styles.submitButton} disabled={loading}>{loading ? (<><span className={styles.loadingSpinnerSmall}></span> Cadastrando...</>) : "Cadastrar Funcionário"}</button></div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}