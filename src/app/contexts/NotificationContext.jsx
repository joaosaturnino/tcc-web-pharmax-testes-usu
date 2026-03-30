"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import styles from "../componentes/Notification/Toast.module.css";
import api from "../services/api"; 

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [updateSignal, setUpdateSignal] = useState(0);

  // Refs para armazenar o estado anterior dos dados
  const previousMapRef = useRef(null); 
  const previousReviewsRef = useRef(null);
  const previousReservasRef = useRef(null); // <--- NOVO: Ref para Reservas
  
  // Ref para rastrear qual farmácia estava logada na última verificação
  const lastFarmIdRef = useRef(null);
  
  const isFetchingRef = useRef(false);

  // --- FUNÇÃO DE SOM ---
  const playSound = (actionType) => {
    // actionType: 'add' (sucesso/novo) ou 'remove' (aviso/cancelado)
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
    
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 8000); 
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // --- MONITORAMENTO UNIFICADO ---
  useEffect(() => {
    const checkUpdates = async () => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        const userDataString = localStorage.getItem("userData");

        // 1. LÓGICA DE RESET AO DESLOGAR
        if (!userDataString) {
            previousMapRef.current = null;
            previousReviewsRef.current = null;
            previousReservasRef.current = null; // <--- Resetar Reservas
            lastFarmIdRef.current = null;
            isFetchingRef.current = false;
            return;
        }

        const userData = JSON.parse(userDataString);
        
        if (!userData.farm_id) {
            isFetchingRef.current = false;
            return;
        }

        // 2. LÓGICA DE DETECÇÃO DE NOVO LOGIN / TROCA DE CONTA
        if (lastFarmIdRef.current !== userData.farm_id) {
            previousMapRef.current = null;
            previousReviewsRef.current = null;
            previousReservasRef.current = null; // <--- Resetar Reservas
            lastFarmIdRef.current = userData.farm_id;
        }

        let hasGlobalChanges = false;

        // --- A. VERIFICAÇÃO DE FAVORITOS ---
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

        // --- B. VERIFICAÇÃO DE AVALIAÇÕES ---
        try {
          const responseAva = await api.get(`/avaliacao?farmacia_id=${userData.farm_id}`);
          if (responseAva.data.sucesso) {
             const currentReviews = responseAva.data.dados || [];
             const currentReviewsMap = new Map();
             currentReviews.forEach(r => currentReviewsMap.set(r.ava_id, r));

             if (previousReviewsRef.current !== null) {
                const prevReviewsMap = previousReviewsRef.current;

                currentReviewsMap.forEach((review, id) => {
                   if (!prevReviewsMap.has(id)) {
                      hasGlobalChanges = true;
                      addNotification("Nova Avaliação! 💬", `Nota ${review.ava_nota}: ${review.ava_comentario || "Sem comentário"}`, "success");
                      playSound('add');
                   }
                });

                prevReviewsMap.forEach((review, id) => {
                   if (!currentReviewsMap.has(id)) {
                      hasGlobalChanges = true;
                      addNotification("Avaliação Removida 🗑️", `A avaliação de nota ${review.ava_nota} foi apagada.`, "warning");
                      playSound('remove');
                   }
                });
             }
             previousReviewsRef.current = currentReviewsMap;
          }
        } catch (err) {
           console.error("Erro check avaliações", err);
        }

        // --- C. VERIFICAÇÃO DE RESERVAS (NOVO BLOCO) ---
        try {
            const responseRes = await api.get(`/reservas/farmacia/${userData.farm_id}`);
            if (responseRes.data.sucesso) {
                const currentReservas = responseRes.data.dados || [];
                const currentResMap = new Map();
                // Usa reserva_id ou id, dependendo de como o backend retorna
                currentReservas.forEach(r => currentResMap.set(r.reserva_id || r.id, r));

                if (previousReservasRef.current !== null) {
                    const prevResMap = previousReservasRef.current;

                    // 1. Detectar NOVAS reservas (que não existiam antes)
                    currentResMap.forEach((reserva, id) => {
                        if (!prevResMap.has(id)) {
                            // Só notifica se for PENDENTE (novo pedido chegando)
                            if (reserva.status === 'PENDENTE') {
                                hasGlobalChanges = true;
                                addNotification(
                                    "Novo Pedido! 📦", 
                                    `Cliente: ${reserva.usuario_nome || 'Cliente'} pediu ${reserva.medicamento_nome}`, 
                                    "success"
                                );
                                playSound('add');
                            }
                        }
                    });

                    // (Opcional) Detectar CANCELAMENTOS feitos pelo usuário
                    /*
                    currentResMap.forEach((reserva, id) => {
                        const prevRes = prevResMap.get(id);
                        if (prevRes && prevRes.status !== 'CANCELADO' && reserva.status === 'CANCELADO') {
                             hasGlobalChanges = true;
                             addNotification("Pedido Cancelado ❌", `O pedido de ${reserva.usuario_nome} foi cancelado.`, "warning");
                             playSound('remove');
                        }
                    });
                    */
                }
                previousReservasRef.current = currentResMap;
            }
        } catch (err) {
            console.error("Erro check reservas", err);
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
    // Verifica a cada 1.5 segundos
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