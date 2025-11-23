"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import styles from "../componentes/Notification/Toast.module.css";
import api from "../services/api"; 

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [audioBlocked, setAudioBlocked] = useState(false);
  
  // Estado para sinalizar atualização para as páginas
  const [updateSignal, setUpdateSignal] = useState(0);

  const previousCountRef = useRef(null);
  const isFetchingRef = useRef(false);

  // --- FUNÇÃO DE SOM ---
  const playSound = (actionType) => {
    const fileName = actionType === 'add' ? 'success.mp3' : 'removed.mp3';
    const audio = new Audio(`/sounds/${fileName}`);
    
    // VOLUME MÁXIMO (Alterado de 0.5 para 1.0)
    audio.volume = 1.0; 
    
    audio.play()
      .then(() => setAudioBlocked(false))
      .catch((err) => {
        if (err.name === 'NotAllowedError') setAudioBlocked(true);
      });
  };

  const unlockAudio = () => {
    const audio = new Audio("/sounds/success.mp3");
    
    // VOLUME MÁXIMO TAMBÉM NO DESBLOQUEIO
    audio.volume = 1.0;
    
    audio.play().then(() => setAudioBlocked(false));
  };

  const addNotification = (title, message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // --- MONITORAMENTO ---
  useEffect(() => {
    const checkFavorites = async () => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) return;
        const userData = JSON.parse(userDataString);
        if (!userData.farm_id) return;

        const response = await api.get(`/favoritos/${userData.farm_id}/favoritos`);

        if (response.data.sucesso) {
          const currentData = response.data.dados || [];
          const currentTotalFavorites = currentData.reduce((acc, item) => acc + (item.favoritacoes_count || 0), 0);

          if (previousCountRef.current === null) {
            previousCountRef.current = currentTotalFavorites;
            return;
          }

          if (currentTotalFavorites !== previousCountRef.current) {
            
            if (currentTotalFavorites > previousCountRef.current) {
              addNotification("Novo Favorito! ⭐", "Medicamento favoritado.", "success");
              playSound('add');
            } else {
              addNotification("Desfavoritado ⚠️", "Favorito removido.", "warning");
              playSound('remove');
            }

            setUpdateSignal(prev => prev + 1);
          }

          previousCountRef.current = currentTotalFavorites;
        }
      } catch (error) {
        console.error("Erro API:", error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    checkFavorites();
    const intervalId = setInterval(checkFavorites, 1500); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, updateSignal }}>
      {children}
      
      <div className={styles.toastContainer}>
        {audioBlocked && (
          <div onClick={unlockAudio} style={{
              background: '#dc2626', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              marginBottom: '10px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
             <span>🔊</span> Clique para ativar sons (Volume Máximo)
          </div>
        )}
        {notifications.map((notif) => (
          <div key={notif.id} className={`${styles.toast} ${styles[notif.type]}`} style={notif.type === 'warning' ? { borderLeftColor: '#ff9800' } : {}}>
             <div style={{fontSize: '20px'}}>{notif.type === "success" ? "✅" : "⚠️"}</div>
             <div className={styles.content}>
               <h4 className={styles.title}>{notif.title}</h4>
               <p className={styles.message}>{notif.message}</p>
             </div>
             <button onClick={() => removeNotification(notif.id)} className={styles.closeBtn}>✖</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);