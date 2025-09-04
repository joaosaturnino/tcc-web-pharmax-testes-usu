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
        const userData = localStorage.getItem("usuario");
        
        if (!userData) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(userData);
        setIsAuthenticated(true);

        if (requiredRole && user.tipo !== requiredRole) {
          redirectToAppropriatePage(user.tipo);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  const redirectToAppropriatePage = (userType) => {
    switch (userType) {
      case 'admin':
        router.push("/farmacias/favoritos");
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
    return null;
  }

  return children;
}