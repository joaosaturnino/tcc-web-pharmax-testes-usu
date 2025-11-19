// app/unauthorized/page.jsx
"use client";

import { useRouter } from 'next/navigation';
import styles from './unauthorized.module.css';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>❌ Acesso Não Autorizado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <p>Esta área é restrita a administradores do sistema.</p>
        <button
          onClick={() => router.push('/login')}
          className={styles.button}
        >
          Voltar para o Login
        </button>
        <button
          onClick={() => router.push('/')}
          className={styles.secondaryButton}
        >
          Ir para a Página Inicial
        </button>
      </div>
    </div>
  );
}