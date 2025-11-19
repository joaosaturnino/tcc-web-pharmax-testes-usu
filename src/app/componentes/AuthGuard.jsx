"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children, requiredRole = null }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // CORREÇÃO: Alterado de "usuario" para "userData" para corresponder ao que é salvo no login.
        const userDataString = localStorage.getItem("userData");

        if (!userDataString) {
          // Ambiente de desenvolvimento: injetar usuário admin padrão para facilitar testes.
          // AVISO: A injeção é permitida somente quando a flag pública NEXT_PUBLIC_ENABLE_DEV_AUTH estiver ativa
          // e quando a rota exigir role 'admin'. Isso reduz o risco de vazamento acidental em builds.
          try {
            const enableDevAuth = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'true';
            if (enableDevAuth && requiredRole === 'admin') {
              const devUser = { id: 1, nome: 'Dev Admin', tipo: 'admin', email: 'admin@dev.local', senha: '123456' };
              localStorage.setItem('userData', JSON.stringify(devUser));
            } else {
              router.push("/login");
              return;
            }
          } catch (err) {
            console.error('Erro ao injetar usuário dev:', err);
            router.push('/login');
            return;
          }
        }

        const user = JSON.parse(localStorage.getItem('userData'));
        setIsAuthenticated(true);

        if (requiredRole && user.tipo !== requiredRole) {
          redirectToAppropriatePage(user.tipo);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em caso de erro (ex: JSON inválido), limpa o storage e redireciona para o login.
        localStorage.removeItem("userData");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  const redirectToAppropriatePage = (userType) => {
    switch (userType) {
      case 'admin':
        router.push("/admin");
        break;
      case 'farmacia':
        router.push("/funcionario/produtos/medicamentos");
        break;
      case 'cliente':
        router.push("/cliente/produtos");
        break;
      default:
        router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Evita renderizar o conteúdo da página antes do redirecionamento.
  }

  return children;
}