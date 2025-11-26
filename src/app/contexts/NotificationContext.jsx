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

  // Refs para Favoritos
  const previousMapRef = useRef(null); 
  
  // NOVO: Ref para Avaliações (Agora armazena um Map com os dados completos, não apenas IDs)
  const previousReviewsRef = useRef(null);
  
  const isFetchingRef = useRef(false);

  // --- FUNÇÃO DE SOM ---
  const playSound = (actionType) => {
    // actionType: 'add' (sucesso/novo) ou 'remove' (aviso/perda)
    const fileName = actionType === 'add' ? 'success.mp3' : 'removed.mp3';
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = 1.0; 
    
    audio.play()
      .then(() => setAudioBlocked(false))
      .catch((err) => {
        if (err.name === 'NotAllowedError') setAudioBlocked(true);
      });
  };

  const unlockAudio = () => {
    const audio = new Audio("/sounds/success.mp3");
    audio.volume = 1.0;
    audio.play().then(() => setAudioBlocked(false));
  };

  const addNotification = (title, message, type = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    
    // Auto-remove após 8 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 8000); 
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // --- MONITORAMENTO UNIFICADO (FAVORITOS E AVALIAÇÕES) ---
  useEffect(() => {
    const checkUpdates = async () => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) return;
        const userData = JSON.parse(userDataString);
        if (!userData.farm_id) return;

        let hasGlobalChanges = false;

        // 1. VERIFICAÇÃO DE FAVORITOS (Mantido igual)
        try {
          const responseFav = await api.get(`/favoritos/${userData.farm_id}/favoritos`);
          if (responseFav.data.sucesso) {
            const currentData = responseFav.data.dados || [];
            const currentMap = new Map();
            currentData.forEach(item => currentMap.set(item.med_id, item));

            if (previousMapRef.current !== null) {
              const previousMap = previousMapRef.current;
              const allIds = new Set([...currentMap.keys(), ...previousMap.keys()]);

              allIds.forEach(id => {
                const currentItem = currentMap.get(id);
                const prevItem = previousMap.get(id);
                const currentCount = currentItem ? (currentItem.favoritacoes_count || 0) : 0;
                const prevCount = prevItem ? (prevItem.favoritacoes_count || 0) : 0;
                const medName = currentItem?.med_nome || prevItem?.med_nome || "Medicamento";

                if (currentCount !== prevCount) {
                  hasGlobalChanges = true;
                  if (currentCount > prevCount) {
                    addNotification("Novo Favorito! ⭐", `${medName} foi favoritado.`, "success");
                    playSound('add');
                  } else {
                    addNotification("Desfavoritado ⚠️", `${medName} perdeu um favorito.`, "warning");
                    playSound('remove');
                  }
                }
              });
            }
            previousMapRef.current = currentMap;
          }
        } catch (err) {
          console.error("Erro check favoritos", err);
        }

        // 2. VERIFICAÇÃO DE AVALIAÇÕES (ATUALIZADO PARA DETECTAR REMOÇÃO)
        try {
          const responseAva = await api.get(`/avaliacao?farmacia_id=${userData.farm_id}`);
          if (responseAva.data.sucesso) {
             const currentReviews = responseAva.data.dados || [];
             
             // Cria um Mapa (ID -> Objeto Avaliação)
             const currentReviewsMap = new Map();
             currentReviews.forEach(r => currentReviewsMap.set(r.ava_id, r));

             if (previousReviewsRef.current !== null) {
                const prevReviewsMap = previousReviewsRef.current;

                // A. DETECTAR NOVAS (Estão no Atual, não no Anterior)
                currentReviewsMap.forEach((review, id) => {
                   if (!prevReviewsMap.has(id)) {
                      hasGlobalChanges = true;
                      addNotification("Nova Avaliação! 💬", `Nota ${review.ava_nota}: ${review.ava_comentario || "Sem comentário"}`, "success");
                      playSound('add');
                   }
                });

                // B. DETECTAR REMOVIDAS (Estavam no Anterior, não no Atual)
                prevReviewsMap.forEach((review, id) => {
                   if (!currentReviewsMap.has(id)) {
                      hasGlobalChanges = true;
                      // Notificação de remoção com estilo "warning" (laranja)
                      addNotification("Avaliação Removida 🗑️", `A avaliação de nota ${review.ava_nota} foi apagada.`, "warning");
                      playSound('remove');
                   }
                });

             } else {
                // Primeira carga
                previousReviewsRef.current = currentReviewsMap; 
             }
             
             // Atualiza a referência
             previousReviewsRef.current = currentReviewsMap;
          }
        } catch (err) {
           console.error("Erro check avaliações", err);
        }

        if (hasGlobalChanges) {
          setUpdateSignal(prev => prev + 1);
        }

      } catch (error) {
        console.error("Erro Geral API Monitor:", error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    checkUpdates();
    const intervalId = setInterval(checkUpdates, 1500); 
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
             <span>🔊</span> Clique para ativar sons
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