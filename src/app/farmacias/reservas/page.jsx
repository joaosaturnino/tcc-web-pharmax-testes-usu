"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./reservas.module.css";
import AuthGuard from "../../componentes/AuthGuard";
import api from "../../services/api";

// --- CONFIGURAÇÃO DO ENDEREÇO DA IMAGEM ---
const API_BASE_URL = "http://localhost:3334"; 

// --- SOM DE NOTIFICAÇÃO ---
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.error("Erro som:", e);
  }
};

// --- HELPERS ---
const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

const getAvatarColor = (name) => {
  if (!name) return '#cbd5e1';
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const SkeletonLoader = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <div className={styles.reservaCard} key={i} style={{ opacity: 0.7, pointerEvents: 'none' }}>
        <div className={styles.cardTop} style={{ background: '#f8fafc', height: '50px' }} />
        <div className={styles.cardContent}>
            <div style={{ height: '30px', width: '80%', background: '#e2e8f0', borderRadius: '6px', marginBottom: '1rem' }} />
            <div style={{ height: '20px', width: '50%', background: '#e2e8f0', borderRadius: '4px' }} />
        </div>
      </div>
    ))}
  </>
);

export default function ReservasFarmaciaPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  
  const [modalAction, setModalAction] = useState(null); 
  const [processing, setProcessing] = useState(false);

  const prevReservasRef = useRef([]);
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted") Notification.requestPermission();
    }
  }, []);

  const fetchReservas = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) { handleLogout(); return; }

      const userData = JSON.parse(userDataString);
      setFarmaciaInfo(userData);

      const idFarmacia = userData.farm_id || userData.id;
      if (!idFarmacia) return;

      const response = await api.get(`/reservas/farmacia/${idFarmacia}`);

      if (response.data.sucesso) {
        const novosDados = response.data.dados;
        
        if (silent && prevReservasRef.current.length > 0) {
            const novasEntradas = novosDados.filter(novo => 
                !prevReservasRef.current.find(antigo => antigo.reserva_id === novo.reserva_id) &&
                novo.status === 'PENDENTE'
            );

            if (novasEntradas.length > 0) {
                playNotificationSound();
                if (Notification.permission === "granted") {
                    new Notification("Novo Pedido! 💊", { body: "Um novo cliente fez uma reserva." });
                }
            }
        }

        setReservas(novosDados);
        prevReservasRef.current = novosDados;
      }
    } catch (error) {
      console.error("Erro ao buscar reservas", error);
      if (error.response?.status === 401) handleLogout();
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas(false);
    const intervalId = setInterval(() => { fetchReservas(true); }, 10000); 
    return () => clearInterval(intervalId);
  }, []);

  // --- LÓGICA UNIFICADA DE AÇÃO (CORRIGIDA) ---
  const handleConfirmAction = async () => {
    if (!modalAction) return;
    setProcessing(true);
    
    try {
        if (modalAction.type === 'EXCLUIR') {
            // CORREÇÃO: Agora enviamos { data: { parte: 'farmacia' } } para o soft delete
            const response = await api.delete(`/reservas/${modalAction.id}`, {
                data: { parte: 'farmacia' } 
            });
            
            if (response.data.sucesso) {
                const updatedReservas = reservas.filter(res => res.reserva_id !== modalAction.id);
                setReservas(updatedReservas);
                prevReservasRef.current = updatedReservas;
                setModalAction(null);
            } else {
                alert("Erro ao excluir: " + response.data.mensagem);
            }
        } 
        else {
            let novoStatus = '';
            if (modalAction.type === 'ACEITAR') novoStatus = 'CONFIRMADO';
            else if (modalAction.type === 'RETIRAR') novoStatus = 'RETIRADO';
            else novoStatus = 'CANCELADO';

            const response = await api.put(`/reservas/${modalAction.id}/status`, { status: novoStatus });

            if (response.data.sucesso) {
                const updatedReservas = reservas.map(res =>
                  res.reserva_id === modalAction.id ? { ...res, status: novoStatus } : res
                );
                setReservas(updatedReservas);
                prevReservasRef.current = updatedReservas;
                setModalAction(null);
            } else {
                alert("Erro ao atualizar: " + response.data.mensagem);
            }
        }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setProcessing(false);
    }
  };

  const stats = useMemo(() => {
    if (!reservas) return { qtdNovos: 0, valorNovos: 0, qtdRetirada: 0, valorRetirada: 0 };
    
    const pendentes = reservas.filter(r => r.status === 'PENDENTE');
    const confirmados = reservas.filter(r => r.status === 'CONFIRMADO');
    
    const totalNovos = pendentes.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
    const totalRetirada = confirmados.reduce((acc, curr) => acc + Number(curr.valor_total), 0);

    return {
      qtdNovos: pendentes.length,
      valorNovos: totalNovos,
      qtdRetirada: confirmados.length,
      valorRetirada: totalRetirada
    };
  }, [reservas]);

  // --- FILTRO ATUALIZADO ---
  const filteredReservas = useMemo(() => {
    let data = reservas || [];
    
    // 1. Filtrar por Status
    if (statusFilter !== "TODOS") {
      data = data.filter(r => r.status === statusFilter);
    }

    // 2. Filtrar por Texto (Busca)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(r =>
        (r.medicamento_nome && r.medicamento_nome.toLowerCase().includes(lower)) || 
        (r.usuario_nome && r.usuario_nome.toLowerCase().includes(lower)) ||       
        (r.protocolo && r.protocolo.toLowerCase().includes(lower)) ||             
        String(r.reserva_id).includes(lower)
      );
    }

    // 3. Ordenação
    return data.sort((a, b) => {
        const score = (status) => {
            if (status === 'PENDENTE') return 3;
            if (status === 'CONFIRMADO') return 2;
            return 1;
        };
        const scoreA = score(a.status);
        const scoreB = score(b.status);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.data_reserva) - new Date(a.data_reserva);
    });
  }, [reservas, searchTerm, statusFilter]);

  const getStatusClass = (status) => {
    if (!status) return "";
    const className = `status${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`;
    return styles[className] || "";
  };

  const getModalContent = () => {
      if (!modalAction) return {};
      switch (modalAction.type) {
          case 'ACEITAR': return { icon: '👍', title: 'Aceitar Pedido?', text: 'O cliente será notificado.', btnText: 'Aceitar Pedido', btnColor: '#2563EB' };
          case 'RETIRAR': return { icon: '🛍️', title: 'Confirmar Retirada?', text: 'Confirme a entrega.', btnText: 'Finalizar Pedido', btnColor: '#458B00' };
          case 'EXCLUIR': return { icon: '🗑️', title: 'Excluir do Histórico?', text: 'Isso removerá o registro do seu painel.', btnText: 'Excluir', btnColor: '#DC2626' };
          default: return { icon: '⚠️', title: 'Cancelar Pedido?', text: 'Ação irreversível.', btnText: 'Cancelar Pedido', btnColor: '#EF4444' };
      }
  };
  const modalData = getModalContent();

  return (
    <AuthGuard>
      <div className={styles.dashboard}>

        {/* MODAL */}
        {modalAction && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{modalData.icon}</div>
              <h3 style={{fontSize: '2rem', color: '#1e293b', marginBottom: '1rem'}}>{modalData.title}</h3>
              <p style={{fontSize: '1.4rem', color: '#64748b', lineHeight: '1.6'}}>{modalData.text}</p>
              <div className={styles.modalActions}>
                <button className={styles.btnModalCancel} onClick={() => setModalAction(null)} disabled={processing} style={{ opacity: processing ? 0.5 : 1 }}>Voltar</button>
                <button className={styles.btnModalConfirm} style={{ backgroundColor: modalData.btnColor, opacity: processing ? 0.7 : 1, cursor: processing ? 'wait' : 'pointer' }} onClick={handleConfirmAction} disabled={processing}>
                  {processing ? '...' : modalData.btnText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className={styles.title}>Gestão de Reservas</h1>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* SIDEBAR */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logoContainer} style={{display:'flex', alignItems:'center', gap:'1.2rem'}}>
                {farmaciaInfo?.farm_logo ? (
                  <img src={`${API_BASE_URL}/public/logos/${farmaciaInfo.farm_logo}`} alt="Logo" className={styles.logoImage} onError={(e) => { e.target.style.display = 'none'; if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={styles.logoImage} style={{display: farmaciaInfo?.farm_logo ? 'none' : 'flex', background:'#458B00', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'2.4rem', fontWeight:'bold', borderRadius: '50%'}}>
                    {farmaciaInfo?.farm_nome ? farmaciaInfo.farm_nome.charAt(0).toUpperCase() : 'F'}
                </div>
                <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
            </div>
            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={styles.navLink}><span className={styles.navText}>Favoritos</span></Link>
                <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}><span className={styles.navText}>Medicamentos</span></Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <Link href="/farmacias/reservas" className={`${styles.navLink} ${styles.active}`}><span className={styles.navText}>Reservas</span></Link>
                <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}><span className={styles.navText}>Funcionários</span></Link>
                <Link href="/farmacias/laboratorio/lista" className={styles.navLink}><span className={styles.navText}>Laboratórios</span></Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Relatórios</p>
                <Link href="/farmacias/relatorios/favoritos" className={styles.navLink}><span className={styles.navText}>Medicamentos Favoritos</span></Link>
                <Link href="/farmacias/relatorios/funcionarios" className={styles.navLink}><span className={styles.navText}>Relatório de Funcionários</span></Link>
                <Link href="/farmacias/relatorios/laboratorios" className={styles.navLink}><span className={styles.navText}>Relatório de Laboratórios</span></Link>
              </div>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <Link href="/farmacias/perfil" className={styles.navLink}><span className={styles.navText}>Meu Perfil</span></Link>
                <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}><span className={styles.navText}>Sair</span></button>
              </div>
            </nav>
          </aside>

          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          <main className={styles.mainContent}>
            
            {/* CARDS STATS */}
            <div className={styles.statsContainer}>
              <div className={`${styles.statCard} ${styles.cardPending}`}>
                <div className={`${styles.statIcon} ${styles.iconPending}`}>🔔</div>
                <div>
                  <h3 style={{margin:0, color:'#64748b', fontSize:'1.3rem', fontWeight:'500'}}>Novos Pedidos</h3>
                  <strong style={{ fontSize: '2.4rem', color: '#ea580c', display:'block', marginTop:'0.5rem' }}>{stats.qtdNovos} <span style={{fontSize:'1.4rem', color:'#94a3b8'}}>pendentes</span></strong>
                  <span style={{display:'block', marginTop:'0.4rem', fontSize:'1.2rem', color:'#ea580c', fontWeight:'600'}}>Total: {formatCurrency(stats.valorNovos)}</span>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.cardMoney}`}>
                <div className={`${styles.statIcon} ${styles.iconMoney}`}>📦</div>
                <div>
                  <h3 style={{margin:0, color:'#64748b', fontSize:'1.3rem', fontWeight:'500'}}>Aguardando Retirada</h3>
                  <strong style={{ fontSize: '2.4rem', color: '#15803d', display:'block', marginTop:'0.5rem' }}>{stats.qtdRetirada} <span style={{fontSize:'1.4rem', color:'#94a3b8'}}>pacotes</span></strong>
                  <span style={{display:'block', marginTop:'0.4rem', fontSize:'1.2rem', color:'#059669', fontWeight:'600'}}>Total: {formatCurrency(stats.valorRetirada)}</span>
                </div>
              </div>
            </div>

            {/* TOOLBAR */}
            <div className={styles.toolbar}>
              <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input 
                    type="text" 
                    placeholder="Buscar por cliente, remédio ou protocolo..." 
                    className={styles.searchInput} 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">Novos (Pendentes)</option>
                <option value="CONFIRMADO">Para Retirada</option>
                <option value="RETIRADO">Finalizados</option>
                <option value="CANCELADO">Cancelados</option>
              </select>
            </div>

            {/* GRID */}
            {loading ? <div className={styles.grid}><SkeletonLoader /></div> : (
              <div className={styles.grid}>
                {filteredReservas.length > 0 ? (
                  filteredReservas.map((reserva, index) => (
                    <div className={styles.reservaCard} key={reserva.reserva_id} style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={styles.cardTop}>
                        <span className={styles.dateLabel}>📅 {formatDate(reserva.data_reserva)}</span>
                        <span className={`${styles.statusBadge} ${getStatusClass(reserva.status)}`}>
                          {reserva.status === 'CONFIRMADO' ? 'Aguardando Retirada' : reserva.status}
                        </span>
                      </div>

                      {/* PROTOCOLO DE RETIRADA */}
                      <div className={styles.protocolRow}>
                        <span className={styles.protocolLabel}>Protocolo de Retirada</span>
                        <span className={styles.protocolValue}>{reserva.protocolo || '---'}</span>
                      </div>

                      <div className={styles.cardContent}>
                        <div className={styles.medInfo}>
                          <h3>{reserva.medicamento_nome}</h3>
                          <p>{reserva.dosagem} • {reserva.quantidade} un</p>
                        </div>
                        <div className={styles.priceRow}>
                          <span style={{ color: '#64748b', fontSize:'1.2rem', fontWeight:'600' }}>TOTAL</span>
                          <span className={styles.priceTag}>{formatCurrency(reserva.valor_total)}</span>
                        </div>
                        <div className={styles.clientInfo}>
                          <div className={styles.clientAvatar} style={{backgroundColor: getAvatarColor(reserva.usuario_nome)}}>{reserva.usuario_nome ? reserva.usuario_nome.charAt(0) : 'U'}</div>
                          <div>
                            <strong style={{ display: 'block', color: '#334155', fontSize: '1.4rem' }}>{reserva.usuario_nome}</strong>
                            <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight:'500' }}>CPF: {reserva.usuario_cpf || '---'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* BOTÕES DINÂMICOS POR STATUS */}
                      {reserva.status === 'PENDENTE' && (
                        <div className={styles.cardActions}>
                          <button className={`${styles.btnAction} ${styles.btnCancel}`} onClick={() => setModalAction({ type: 'CANCELAR', id: reserva.reserva_id })}>✖ Cancelar</button>
                          <button className={`${styles.btnAction} ${styles.btnAccept}`} onClick={() => setModalAction({ type: 'ACEITAR', id: reserva.reserva_id })}>✔ Aceitar</button>
                        </div>
                      )}
                      
                      {reserva.status === 'CONFIRMADO' && (
                        <div className={styles.cardActions}>
                          <button className={`${styles.btnAction} ${styles.btnCancel}`} onClick={() => setModalAction({ type: 'CANCELAR', id: reserva.reserva_id })}>✖ Cancelar</button>
                          <button className={`${styles.btnAction} ${styles.btnConfirm}`} onClick={() => setModalAction({ type: 'RETIRAR', id: reserva.reserva_id })}>🛍️ Entregue</button>
                        </div>
                      )}

                      {(reserva.status === 'RETIRADO' || reserva.status === 'CANCELADO') && (
                        <div className={styles.cardActions}>
                          <button className={`${styles.btnAction} ${styles.btnDelete}`} onClick={() => setModalAction({ type: 'EXCLUIR', id: reserva.reserva_id })}>
                            🗑️ Excluir
                          </button>
                        </div>
                      )}

                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}><h3 style={{fontSize:'1.8rem', color:'#475569'}}>Nenhum pedido encontrado</h3></div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}