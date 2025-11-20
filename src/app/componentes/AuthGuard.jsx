// "use client": Indica que este componente deve ser renderizado no lado do cliente
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Componente de guarda de rota: envolve o conteúdo da página que precisa de proteção
export default function AuthGuard({ children, requiredRole = null }) {
  const router = useRouter();
  
  // Estados de controle
  const [isLoading, setIsLoading] = useState(true); // Verdadeiro enquanto checa o token
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Verdadeiro se o usuário estiver logado

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Tenta recuperar os dados do usuário do armazenamento local (session)
        const userDataString = localStorage.getItem("userData");

        if (!userDataString) {
          // --- LÓGICA DE AMBIENTE DE DESENVOLVIMENTO (DEV AUTH) ---
          try {
            // Verifica se a flag NEXT_PUBLIC_ENABLE_DEV_AUTH está ativa E se a rota exige 'admin'
            const enableDevAuth = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'true';
            if (enableDevAuth && requiredRole === 'admin') {
              // Se permitido, injeta um usuário admin mockado para testes
              const devUser = { id: 1, nome: 'Dev Admin', tipo: 'admin', email: 'admin@dev.local', senha: '123456' };
              localStorage.setItem('userData', JSON.stringify(devUser));
            } else {
              // Redireciona para o login se não houver dados e a injeção dev não for permitida
              router.push("/login");
              return;
            }
          } catch (err) {
            // Em caso de erro na injeção (ex: falta de permissão), redireciona
            console.error('Erro ao injetar usuário dev:', err);
            router.push('/login');
            return;
          }
        }

        // Se chegou até aqui, o usuário está logado ou foi injetado como dev admin.
        const user = JSON.parse(localStorage.getItem('userData'));
        setIsAuthenticated(true);

        // 4. VERIFICAÇÃO DE FUNÇÃO (ROLE)
        if (requiredRole && user.tipo !== requiredRole) {
          // Se a função for necessária e o tipo do usuário não for compatível,
          // redireciona para a página apropriada (ex: um cliente tentando acessar /admin)
          redirectToAppropriatePage(user.tipo);
          return;
        }

        // Se tudo estiver OK, o conteúdo pode ser carregado
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Em caso de JSON inválido ou outro erro no storage, limpa e força o login.
        localStorage.removeItem("userData");
        router.push("/login");
      }
    };

    checkAuth();
    // Dependências: Roda novamente se a rota ou a função requerida mudarem
  }, [router, requiredRole]);

  // Função para redirecionar o usuário para a página padrão de sua função (Role-Based Redirection)
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

  // 1. Renderização de Loading
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        {/* Renderiza o spinner de carregamento */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        {/* CSS para a animação do spinner */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Previne renderização do conteúdo da página se a autenticação falhou
  if (!isAuthenticated) {
    return null; 
  }

  // 3. Renderiza o conteúdo da página protegida
  return children;
}