"use client";

import styles from './header.module.css';
import { useRouter } from 'next/navigation';

export default function Header({ title }) {
  const router = useRouter();
  const handleLogout = () => {
    try { localStorage.clear(); sessionStorage.clear(); document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; } catch (e) { }
    router.push('/');
  };

  const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';
  let devUser = null;
  try {
    const raw = localStorage.getItem('userData');
    if (raw) devUser = JSON.parse(raw);
  } catch (e) {
    devUser = null;
  }

  return (
    <header className={styles.headerShared}>
      <div className={styles.left}>
        <h1>{title}</h1>
        {isDev && <span className={styles.envBadge}>DEV</span>}
        {devUser && devUser.email && devUser.email.includes('dev.local') && <span className={styles.devUserBadge}>Dev user</span>}
      </div>
      <div className={styles.right}><button onClick={handleLogout} className={styles.logout}>Sair</button></div>
    </header>
  );
}
