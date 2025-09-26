"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      console.log("--- AuthGuard: A verificar autenticação... ---");
      let userDataString = null;

      try {
        userDataString = localStorage.getItem('userData');
        // Esta linha é crucial para a depuração.
        console.log("--- AuthGuard: 'userData' encontrado no localStorage:", userDataString);

        // Se não houver dados ou se os dados forem inválidos (null, undefined), redireciona.
        if (!userDataString || userDataString === 'undefined' || userDataString === 'null') {
          console.error("--- AuthGuard: FALHA. 'userData' não encontrado ou inválido. A redirecionar para /login.");
          router.push('/login');
          return;
        }

        // Tenta analisar os dados. Se falhar (dados corrompidos), redireciona.
        const user = JSON.parse(userDataString);
        if (!user) {
             console.error("--- AuthGuard: FALHA. 'userData' é inválido após JSON.parse. A redirecionar para /login.");
             router.push('/login');
             return;
        }

        console.log("--- AuthGuard: SUCESSO. Autorização concedida. A exibir a página.");
        setIsAuthorized(true);

      } catch (error) {
        console.error("--- AuthGuard: Ocorreu um erro ao verificar a autenticação.", error);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>A verificar autenticação...</p>
      </div>
    );
  }

  // Só renderiza os "filhos" (a página protegida) se estiver autorizado.
  return isAuthorized ? children : null;
}