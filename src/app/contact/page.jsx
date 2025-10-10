"use client";
// Arquivo: app/contact/page.jsx

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import AuthGuard from '../componentes/AuthGuard';

export default function ContactPage() {
  // --- ESTADOS DA SIDEBAR ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null); // Novo estado para dados da farmácia
  const router = useRouter();

  // --- ESTADOS DO FORMULÁRIO ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'geral',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  // Efeito para buscar dados da farmácia ao carregar
  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        setFarmaciaInfo(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error("Falha ao buscar dados da farmácia:", error);
    }
  }, []); // Array vazio garante que rode apenas uma vez

  // --- FUNÇÕES DA SIDEBAR ---
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Adicione outras chaves se necessário
    router.push("/home");
  };

  // --- FUNÇÕES DO FORMULÁRIO ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'message') {
      setCharCount(value.length);
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.subject.trim()) newErrors.subject = 'Assunto é obrigatório';
    if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória';
    else if (formData.message.trim().length < 20) newErrors.message = 'Mensagem deve ter pelo menos 20 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', category: 'geral', message: '' });
        setCharCount(0);
      } else {
        throw new Error(data.message || 'Erro ao enviar a mensagem.');
      }
    } catch (error) {
      console.error('Falha no envio do formulário:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <Head>
        <title>Contato | PharmaX</title>
        <meta name="description" content="Envie uma mensagem para nossa equipe" />
      </Head>
      <div className={styles.dashboard}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <h1 className={styles.title}>Entre em Contato</h1>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              {/* --- BLOCO DA LOGO ATUALIZADO --- */}
              <div className={styles.logo}>
                {farmaciaInfo ? (
                  <div className={styles.logoContainer}>
                    {farmaciaInfo.farm_logo_url && (
                      <img
                        src={farmaciaInfo.farm_logo_url}
                        alt={`Logo de ${farmaciaInfo.farm_nome}`}
                        className={styles.logoImage}
                      />
                    )}
                    <span className={styles.logoText}>
                      {farmaciaInfo.farm_nome}
                    </span>
                  </div>
                ) : (
                  <span className={styles.logoText}>PharmaX</span>
                )}
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>
                ×
              </button>
            </div>
            {/* Navegação da sidebar */}
            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Favoritos</span>
                </Link>
                <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                  <span className={styles.navText}>Funcionários</span>
                </Link>
                <Link href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos Favoritos</span>
                </Link>
                <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Funcionarios</span>
                </Link>
                <Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}>
                  <span className={styles.navText}>Relatório de Laboratorios</span>
                </Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <Link href="/farmacias/perfil" className={styles.navLink}>
                  <span className={styles.navText}>Meu Perfil</span>
                </Link>
                <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Overlay */}
          {sidebarOpen && (
            <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
          )}

          {/* Conteúdo Principal com o Formulário */}
          <main className={styles.mainContent}>
            <div className={styles.controlsContainer}>
              <form onSubmit={handleSubmit} noValidate className={styles.contactForm}>
                <div className={styles.formGrid}>
                  {/* Campos do formulário permanecem inalterados */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Nome Completo *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`${styles.searchInput} ${errors.name ? styles.inputError : ''}`} placeholder="Seu nome completo" disabled={isSubmitting} />
                    {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>E-mail *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${styles.searchInput} ${errors.email ? styles.inputError : ''}`} placeholder="seu@email.com" disabled={isSubmitting} />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>Telefone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles.searchInput} placeholder="(11) 99999-9999" disabled={isSubmitting} />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.formLabel}>Categoria</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className={styles.filterSelect} disabled={isSubmitting}>
                      <option value="geral">Geral</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="vendas">Vendas</option>
                      <option value="parceria">Parceria</option>
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="subject" className={styles.formLabel}>Assunto *</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={`${styles.searchInput} ${errors.subject ? styles.inputError : ''}`} placeholder="Sobre o que você gostaria de falar?" disabled={isSubmitting} />
                    {errors.subject && <span className={styles.errorMessage}>{errors.subject}</span>}
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="message" className={styles.formLabel}>Mensagem * ({charCount}/1000)</label>
                    <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} className={`${styles.searchInput} ${styles.formTextarea} ${errors.message ? styles.inputError : ''}`} placeholder="Descreva sua mensagem em detalhes..." disabled={isSubmitting}></textarea>
                    {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className={styles.paginationBtn} style={{ minWidth: '180px', alignSelf: 'center', marginTop: '1.5rem' }}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
              {submitStatus && (
                <div className={`${styles.statusMessage} ${styles[submitStatus]}`}>
                  {submitStatus === 'success' ? '✅ Mensagem enviada com sucesso!' : '❌ Erro ao enviar. Tente novamente.'}
                  <button onClick={() => setSubmitStatus(null)}>&times;</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}