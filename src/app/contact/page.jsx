"use client";
// Arquivo: app/contact/page.jsx

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import AuthGuard from '../componentes/AuthGuard'; // Componente que protege a rota

export default function ContactPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false); // Controla o estado de envio do botão
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' ou 'error' para feedback
  const [errors, setErrors] = useState({}); // Armazena erros de validação
  const [charCount, setCharCount] = useState(0); // Contador de caracteres da mensagem

  // --- NOVA FUNÇÃO DE VOLTAR ---
  const handleGoBack = () => {
    // Retorna para a página anterior no histórico do navegador
    router.back();
  };

  // --- FUNÇÕES DE CONTROLE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Atualiza o estado do formulário dinamicamente
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'message') {
      setCharCount(value.length);
    }

    // Limpa o erro do campo assim que o usuário começa a digitar novamente
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    // Validação client-side
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
      // --- ESTRUTURA DE CHAMADA REAL PARA O NEXT.JS API HANDLER ---
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        // Limpa o formulário após sucesso
        setFormData({ name: '', email: '', phone: '', subject: '', category: 'geral', message: '' });
        setCharCount(0);
      } else {
        // Lança erro para cair no catch e mostrar feedback de erro
        throw new Error(data.message || 'Erro desconhecido ao enviar.');
      }
    } catch (error) {
      console.error('Falha no envio do formulário:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // AuthGuard protege a página, verificando se o usuário está logado/tem permissão
    <AuthGuard>
      <Head>
        <title>Contato | PharmaX</title>
        <meta name="description" content="Envie uma mensagem para nossa equipe" />
      </Head>
      <div className={styles.dashboard}>
        {/* Header Fixo */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Entre em Contato</h1>
          </div>
          <div className={styles.headerActions}>
            {/* Botão "Voltar" */}
            <button onClick={handleGoBack} className={styles.headerButton} aria-label="Voltar">
              Voltar
            </button>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* Conteúdo Principal com o Formulário */}
          <main className={styles.mainContent}>
            <div className={styles.controlsContainer}>
              <form onSubmit={handleSubmit} noValidate className={styles.contactForm}>
                <div className={styles.formGrid}>

                  {/* Nome */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Nome Completo *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`${styles.searchInput} ${errors.name ? styles.inputError : ''}`} placeholder="Seu nome completo" disabled={isSubmitting} />
                    {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                  </div>

                  {/* E-mail */}
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>E-mail *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`${styles.searchInput} ${errors.email ? styles.inputError : ''}`} placeholder="seu@email.com" disabled={isSubmitting} />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                  </div>

                  {/* Telefone */}
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>Telefone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={styles.searchInput} placeholder="(11) 99999-9999" disabled={isSubmitting} />
                  </div>

                  {/* Categoria */}
                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.formLabel}>Categoria</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className={styles.filterSelect} disabled={isSubmitting}>
                      <option value="geral">Geral</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="vendas">Vendas</option>
                      <option value="parceria">Parceria</option>
                    </select>
                  </div>

                  {/* Assunto (Full Width) */}
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="subject" className={styles.formLabel}>Assunto *</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={`${styles.searchInput} ${errors.subject ? styles.inputError : ''}`} placeholder="Sobre o que você gostaria de falar?" disabled={isSubmitting} />
                    {errors.subject && <span className={styles.errorMessage}>{errors.subject}</span>}
                  </div>

                  {/* Mensagem (Textarea) */}
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="message" className={styles.formLabel}>Mensagem * ({charCount}/1000)</label>
                    <textarea id="message" name="message" rows="6" maxLength={1000} value={formData.message} onChange={handleChange} className={`${styles.searchInput} ${styles.formTextarea} ${errors.message ? styles.inputError : ''}`} placeholder="Descreva sua mensagem em detalhes..." disabled={isSubmitting}></textarea>
                    {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
                  </div>
                </div>

                {/* Botão de Envio */}
                <button type="submit" disabled={isSubmitting} className={styles.paginationBtn} style={{ minWidth: '180px', alignSelf: 'center', marginTop: '1.5rem' }}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>

              {/* Mensagem de Status (Feedback) */}
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