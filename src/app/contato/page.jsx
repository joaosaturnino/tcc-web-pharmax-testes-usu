"use client"
// pages/contact.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Contact() {
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Verificar preferência de modo escuro do sistema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      // Ouvir mudanças no tema do sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setIsDarkMode(e.matches);
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Atualizar contador de caracteres para o campo de mensagem
    if (name === 'message') {
      setCharCount(value.length);
    }
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (formData.phone && !/^[\d\s+\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Mensagem deve ter pelo menos 20 caracteres';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Mensagem deve ter no máximo 1000 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Animação de shake para indicar erro
      const form = e.target;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulação de envio com delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso 90% das vezes para demonstração
      const success = Math.random() > 0.1;
      
      if (success) {
        setSubmitStatus('success');
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          subject: '', 
          category: 'geral', 
          message: '' 
        });
        setCharCount(0);
      } else {
        setSubmitStatus('error');
      }
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <Head>
        <title>Entre em Contato | Nossa Empresa</title>
        <meta name="description" content="Envie uma mensagem para nossa equipe" />
      </Head>

      <button className="theme-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="form-container">
        <div className="form-header">
          <div className="logo">✉️</div>
          <h1>Entre em Contato</h1>
          <p>Preencha o formulário abaixo e entraremos em contato em breve</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="name">Nome Completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Seu nome completo"
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="seu@email.com"
                disabled={isSubmitting}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="(11) 99999-9999"
                disabled={isSubmitting}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="geral">Geral</option>
                <option value="suporte">Suporte Técnico</option>
                <option value="vendas">Vendas</option>
                <option value="parceria">Parceria</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label htmlFor="subject">Assunto *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={errors.subject ? 'error' : ''}
                placeholder="Assunto da sua mensagem"
                disabled={isSubmitting}
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="input-group full-width">
              <div className="textarea-header">
                <label htmlFor="message">Mensagem *</label>
                <span className={`char-count ${charCount > 1000 ? 'error' : ''}`}>
                  {charCount}/1000
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
                placeholder="Descreva sua mensagem em detalhes..."
                disabled={isSubmitting}
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : (
              <>
                <span className="send-icon">✈️</span>
                Enviar Mensagem
              </>
            )}
          </button>

          {submitStatus === 'success' && (
            <div className="status-message success">
              <div className="status-icon">✅</div>
              <div>
                <h3>Mensagem enviada com sucesso!</h3>
                <p>Entraremos em contato em até 24 horas.</p>
              </div>
              <button onClick={() => setSubmitStatus(null)} className="close-btn">×</button>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              <div className="status-icon">❌</div>
              <div>
                <h3>Erro ao enviar mensagem</h3>
                <p>Tente novamente ou entre em contato por outro meio.</p>
              </div>
              <button onClick={() => setSubmitStatus(null)} className="close-btn">×</button>
            </div>
          )}
        </form>

        <div className="form-footer">
          <p>Outras formas de contato:</p>
          <div className="contact-options">
            <span>📧 contato@empresa.com</span>
            <span>📞 (11) 9999-9999</span>
            <span>🕒 Seg-Sex: 9h-18h</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .container.light {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .container.dark {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        }

        .theme-toggle {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          font-size: 1.2rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .theme-toggle:hover {
          transform: scale(1.1);
        }

        .form-container {
          background: var(--bg-form);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          padding: 3rem;
          width: 100%;
          max-width: 700px;
          transition: all 0.3s ease;
        }

        .light {
          --bg-form: #ffffff;
          --text-primary: #2d3748;
          --text-secondary: #718096;
          --border-color: #e2e8f0;
          --bg-input: #ffffff;
          --bg-hover: #edf2f7;
          --success-bg: #f0fff4;
          --success-border: #9ae6b4;
          --error-bg: #fed7d7;
          --error-border: #feb2b2;
        }

        .dark {
          --bg-form: #2d3748;
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
          --bg-input: #1a202c;
          --bg-hover: #2d3748;
          --success-bg: #22543d;
          --success-border: #38a169;
          --error-bg: #742a2a;
          --error-border: #e53e3e;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .form-header h1 {
          font-size: 2.25rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .form-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .input-group input,
        .input-group textarea,
        .input-group select {
          padding: 1rem 1.25rem;
          border: 2px solid var(--border-color);
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: var(--bg-input);
          color: var(--text-primary);
        }

        .input-group input:focus,
        .input-group textarea:focus,
        .input-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
        }

        .input-group input.error,
        .input-group textarea.error {
          border-color: #e53e3e;
          box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.2);
        }

        .textarea-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .char-count.error {
          color: #e53e3e;
          font-weight: 600;
        }

        .error-message {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .submit-btn {
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          position: relative;
          overflow: hidden;
        }

        .submit-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: 0.5s;
        }

        .submit-btn:hover:not(.submitting):before {
          left: 100%;
        }

        .submit-btn:hover:not(.submitting) {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn.submitting {
          background: #a0aec0;
          cursor: not-allowed;
        }

        .send-icon {
          transition: transform 0.3s ease;
        }

        .submit-btn:hover .send-icon {
          transform: translateX(4px);
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .status-message {
          padding: 1.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .status-message.success {
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          color: #22543d;
        }

        .status-message.error {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          color: #742a2a;
        }

        .status-icon {
          font-size: 1.5rem;
        }

        .status-message h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .status-message p {
          font-size: 0.95rem;
          opacity: 0.9;
        }

        .close-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .form-footer {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }

        .form-footer p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .contact-options {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .contact-options span {
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        /* Animações */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        /* Transições suaves para modo escuro/claro */
        .form-container,
        .input-group input,
        .input-group textarea,
        .input-group select,
        .form-footer {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}