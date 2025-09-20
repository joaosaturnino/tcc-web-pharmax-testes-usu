// src/hooks/useApiConnection.js
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../app/services/api';

export const useApiConnection = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [lastSuccess, setLastSuccess] = useState(null);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const online = await apiService.checkApiStatus();
      setIsOnline(online);
      if (online) {
        setLastSuccess(new Date());
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Verificar conexão inicial
    checkConnection();

    // Verificar periodicamente a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    // Verificar quando a janela ganha foco
    const handleFocus = () => checkConnection();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkConnection]);

  return {
    isOnline,
    isChecking,
    lastSuccess,
    checkConnection
  };
};