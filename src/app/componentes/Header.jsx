"use client"; // Indica que este é um componente do lado do cliente

import styles from './header.module.css';
import { useRouter } from 'next/navigation'; // Hook de navegação do Next.js

/**
 * Componente Header (Cabeçalho): Exibe o título da página atual e o botão de Logout.
 * Também adiciona indicadores visuais para o ambiente de desenvolvimento e usuários de teste.
 * * @param {string} title O título dinâmico da página atual (ex: 'Meus Produtos').
 */
export default function Header({ title }) {
  const router = useRouter();

  // 1. Lógica de Logout
  const handleLogout = () => {
    // Tenta limpar todos os dados de sessão e cookies.
    try { 
      // Limpa chaves no LocalStorage (onde o token e dados do usuário são geralmente salvos)
      localStorage.clear(); 
      // Limpa dados no SessionStorage
      sessionStorage.clear(); 
      // Limpa o cookie principal 'userData' (setando a expiração no passado)
      document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
    } catch (e) { 
      // Ignora erros de ambiente (ex: localStorage bloqueado)
      console.error("Erro ao limpar storage:", e);
    }
    
    // Redireciona o usuário para a página inicial (que deve levar ao login)
    router.push('/');
  };

  // 2. Verificação de Ambiente
  // isDev será true se o ambiente NÃO for 'production' (development/staging)
  const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';
  
  // 3. Verificação de Usuário Dev (injetado no local storage)
  let devUser = null;
  try {
    const raw = localStorage.getItem('userData');
    // Tenta parsear o JSON e verifica se há dados
    if (raw) devUser = JSON.parse(raw);
  } catch (e) {
    // Se o JSON estiver inválido, reseta a variável
    devUser = null;
  }

  return (
    <header className={styles.headerShared}>
      <div className={styles.left}>
        {/* Título da Página */}
        <h1 className={styles.pageTitle}>{title}</h1> 
        
        {/* Badge de Ambiente DEV */}
        {isDev && <span className={styles.envBadge}>DEV</span>}
        
        {/* Badge de Usuário de Teste (Exibe se for o usuário injetado no Dev Auth) */}
        {devUser && devUser.email && devUser.email.includes('dev.local') && <span className={styles.devUserBadge}>Usuário Teste</span>}
      </div>
      
      {/* Botão de Logout */}
      <div className={styles.right}>
          <button onClick={handleLogout} className={styles.logout}>Sair</button>
      </div>
    </header>
  );
}