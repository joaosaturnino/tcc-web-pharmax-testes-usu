// src/components/ApiStatus.jsx
"use client";

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function ApiStatus() {
  const [status, setStatus] = useState('verificando...');
  const [responseTime, setResponseTime] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const checkApiStatus = async () => {
    try {
      const startTime = Date.now();
      // Usamos um endpoint simples para testar a conexão
      await apiService.fetchWithTimeout(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/health`, {
        method: 'GET'
      });
      const endTime = Date.now();
      
      setResponseTime(endTime - startTime);
      setStatus('online 🟢');
      setIsOnline(true);
      setLastCheck(new Date());
    } catch (error) {
      setStatus('offline 🔴');
      setResponseTime(0);
      setIsOnline(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // Verificar status imediatamente
    checkApiStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: isOnline ? '#458B00' : '#d32f2f',
      color: 'white', 
      padding: '8px 12px', 
      borderRadius: '8px', 
      fontSize: '12px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <span>API: {status}</span>
      {responseTime > 0 && (
        <span>({responseTime}ms)</span>
      )}
      <button 
        onClick={checkApiStatus}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          padding: '2px 6px',
          cursor: 'pointer',
          fontSize: '10px'
        }}
        title="Verificar novamente"
      >
        🔄
      </button>
    </div>
  );
}

<div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => router.push("/farmacias/laboratorio/lista")}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Atualizar Laboratório
                </button>
              </div>