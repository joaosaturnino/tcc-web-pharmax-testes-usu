"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./reservas.module.css";
import AuthGuard from "../../componentes/AuthGuard";
import api from "../../services/api";

// --- HELPERS ---
const formatCurrency = (value) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateString) => {
  if(!dateString) return "-";
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

// Skeleton Loading (Reaproveitado visualmente)
const SkeletonLoader = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <div className={styles.reservaCard} key={i} style={{opacity: 0.6}}>
        <div style={{height: '20px', width: '30%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem'}} />
        <div style={{height: '40px', width: '80%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem'}} />
        <div style={{height: '20px', width: '50%', background: '#e2e8f0', borderRadius: '4px'}} />
      </div>
    ))}
  </>
);

export default function ReservasFarmaciaPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [farmaciaInfo, setFarmaciaInfo] = useState(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Modal de Ação
  const [modalAction, setModalAction] = useState(null); // { type: 'RETIRAR' | 'CANCELAR', id: 123 }

  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/home");
  };

  const fetchReservas = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) { handleLogout(); return; }
      
      const userData = JSON.parse(userDataString);
      setFarmaciaInfo(userData);
      
      // Chamada à API (Baseado no controller criado anteriormente)
      const response = await api.get(`/reservas/farmacia/${userData.farm_id}`);
      
      if (response.data.sucesso) {
        setReservas(response.data.dados);
      }
    } catch (error) {
      console.error("Erro ao buscar reservas", error);
      if (error.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Lógica para processar a mudança de status
  const handleStatusChange = async () => {
    if (!modalAction) return;
    
    // Simulação de chamada para atualizar status (PUT)
    // No backend real, você criaria uma rota: router.put('/:id', updateStatusController)
    try {
        const novoStatus = modalAction.type === 'RETIRAR' ? 'RETIRADO' : 'CANCELADO';
        
        // await api.put(`/reservas/${modalAction.id}`, { status: novoStatus });
        // console.log(`Atualizando reserva ${modalAction.id} para ${novoStatus}`);
        
        // Atualização Otimista local
        setReservas(prev => prev.map(res => 
            res.reserva_id === modalAction.id ? { ...res, status: novoStatus } : res
        ));
        
        alert(`Reserva ${modalAction.type === 'RETIRAR' ? 'concluída' : 'cancelada'} com sucesso!`);

    } catch (error) {
        alert("Erro ao atualizar status.");
    } finally {
        setModalAction(null);
    }
  };

  // Filtragem e Estatísticas
  const filteredReservas = useMemo(() => {
    let data = reservas;

    if (statusFilter !== "TODOS") {
      data = data.filter(r => r.status === statusFilter);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(r => 
        r.medicamento_nome?.toLowerCase().includes(lower) || 
        r.usuario_nome?.toLowerCase().includes(lower) ||
        String(r.reserva_id).includes(lower)
      );
    }

    // Ordenar pendentes primeiro, depois data mais recente
    return data.sort((a, b) => {
        if(a.status === 'PENDENTE' && b.status !== 'PENDENTE') return -1;
        if(a.status !== 'PENDENTE' && b.status === 'PENDENTE') return 1;
        return new Date(b.data_reserva) - new Date(a.data_reserva);
    });
  }, [reservas, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const pendentes = reservas.filter(r => r.status === 'PENDENTE');
    const totalPendente = pendentes.reduce((acc, curr) => acc + Number(curr.valor_total), 0);
    return {
        qtdPendentes: pendentes.length,
        valorPendente: totalPendente
    };
  }, [reservas]);

  return (
    <AuthGuard>
      <div className={styles.dashboard}>

        {/* --- MODAL CONFIRMAÇÃO --- */}
        {modalAction && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>
                {modalAction.type === 'RETIRAR' ? '✅' : '❌'}
              </div>
              <h3>Confirmar Ação?</h3>
              <p>
                Deseja marcar a reserva #{modalAction.id} como 
                <strong> {modalAction.type === 'RETIRAR' ? 'RETIRADA' : 'CANCELADA'}</strong>?
              </p>
              <div className={styles.modalActions}>
                <button className={styles.btnModalCancel} onClick={() => setModalAction(null)}>Voltar</button>
                <button 
                    className={styles.btnModalConfirm} 
                    style={{backgroundColor: modalAction.type === 'CANCELAR' ? '#ef4444' : '#458B00'}}
                    onClick={handleStatusChange}
                >
                    Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className={styles.title}>Gestão de Reservas</h1>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          
          {/* --- SIDEBAR (Idêntica ao Favoritos) --- */}
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.logoContainer}>
                {farmaciaInfo?.farm_logo_url && (
                  <img src={farmaciaInfo.farm_logo_url} alt="Logo" className={styles.logoImage} />
                )}
                <span className={styles.logoText}>{farmaciaInfo?.farm_nome || "PharmaX"}</span>
              </div>
              <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>×</button>
            </div>

            <nav className={styles.nav}>
              <div className={styles.navSection}>
                <p className={styles.navLabel}>Principal</p>
                <Link href="/farmacias/favoritos" className={styles.navLink}>
                  <span className={styles.navText}>Favoritos & Avaliações</span>
                </Link>
                <Link href="/farmacias/produtos/medicamentos" className={styles.navLink}>
                  <span className={styles.navText}>Medicamentos</span>
                </Link>
              </div>

              <div className={styles.navSection}>
                <p className={styles.navLabel}>Gestão</p>
                <div className={`${styles.navLink} ${styles.active}`}>
                  <span className={styles.navText}>Reservas</span>
                </div>
                <Link href="/farmacias/cadastro/funcionario/lista" className={styles.navLink}>
                  <span className={styles.navText}>Funcionários</span>
                </Link>
                <Link href="/farmacias/laboratorio/lista" className={styles.navLink}>
                  <span className={styles.navText}>Laboratórios</span>
                </Link>
              </div>

              <div className={styles.navSection}>
                <p className={styles.navLabel}>Conta</p>
                <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <span className={styles.navText}>Sair</span>
                </button>
              </div>
            </nav>
          </aside>

          {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

          <main className={styles.mainContent}>
            
            {/* --- ESTATÍSTICAS --- */}
            <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.iconPending}`}>📦</div>
                    <div>
                        <h3>Pendentes</h3>
                        <strong style={{fontSize: '1.8rem', color: '#1e293b'}}>{stats.qtdPendentes} pedidos</strong>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.iconMoney}`}>💰</div>
                    <div>
                        <h3>A Receber (Balcão)</h3>
                        <strong style={{fontSize: '1.8rem', color: '#1e293b'}}>{formatCurrency(stats.valorPendente)}</strong>
                    </div>
                </div>
            </div>

            {/* --- TOOLBAR --- */}
            <div className={styles.toolbar}>
              <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Buscar por cliente, remédio ou ID..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="RETIRADO">Concluídos/Retirados</option>
                <option value="CANCELADO">Cancelados</option>
              </select>
            </div>

            {loading ? (
              <div className={styles.grid}>
                <SkeletonLoader />
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredReservas.length > 0 ? (
                  filteredReservas.map((reserva, index) => (
                    <div 
                        className={styles.reservaCard} 
                        key={reserva.reserva_id}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Topo: Data e Status */}
                        <div className={styles.cardTop}>
                            <span className={styles.dateLabel}>
                                📅 {formatDate(reserva.data_reserva)}
                            </span>
                            <span className={`${styles.statusBadge} ${styles[`status${reserva.status.charAt(0) + reserva.status.slice(1).toLowerCase()}`]}`}>
                                {reserva.status}
                            </span>
                        </div>

                        {/* Informações Principais */}
                        <div className={styles.cardContent}>
                            <div className={styles.medInfo}>
                                <h3>{reserva.medicamento_nome}</h3>
                                <p>{reserva.dosagem} • {reserva.quantidade} unidade(s)</p>
                            </div>
                            
                            <div className={styles.priceRow}>
                                <span style={{color:'#64748b'}}>Total a receber:</span>
                                <span className={styles.priceTag}>{formatCurrency(reserva.valor_total)}</span>
                            </div>

                            <div className={styles.clientInfo} style={{marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9'}}>
                                <div className={styles.clientAvatar}>
                                    {reserva.usuario_nome ? reserva.usuario_nome.charAt(0) : 'U'}
                                </div>
                                <div>
                                    <strong style={{display:'block', color: '#334155', fontSize: '1.4rem'}}>
                                        {reserva.usuario_nome || "Usuário não ident."}
                                    </strong>
                                    <span style={{fontSize: '1.2rem', color: '#94a3b8'}}>CPF: {reserva.usuario_cpf || '---'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Botões de Ação (Apenas se Pendente) */}
                        {reserva.status === 'PENDENTE' && (
                            <div className={styles.cardActions}>
                                <button 
                                    className={`${styles.btnAction} ${styles.btnCancel}`}
                                    onClick={() => setModalAction({ type: 'CANCELAR', id: reserva.reserva_id })}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className={`${styles.btnAction} ${styles.btnConfirm}`}
                                    onClick={() => setModalAction({ type: 'RETIRAR', id: reserva.reserva_id })}
                                >
                                    Confirmar Retirada
                                </button>
                            </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b'}}>
                    <h3>Nenhuma reserva encontrada com os filtros atuais.</h3>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </AuthGuard>
  );
}